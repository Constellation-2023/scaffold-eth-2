// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC20 } from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import { MultiOwners } from "./MultiOwners.sol";
import { CCIPReceiver } from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

contract Wallet is CCIPReceiver, MultiOwners {
	// Custom errors to provide more descriptive revert messages.
	error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
	error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
	error SourceChainNotAllowlisted(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
	error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
	error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.

	// Event emitted when the tokens are transferred to an account on another chain.
	event TokensTransferred(
		bytes32 indexed messageId, // The unique ID of the message.
		uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
		address receiver, // The address of the receiver on the destination chain.
		address token, // The token address that was transferred.
		uint256 tokenAmount, // The token amount that was transferred.
		address feeToken, // the token address used to pay CCIP fees.
		uint256 fees // The fees paid for sending the message.
	);

	// Event emitted when a message is sent to another chain.
	event MessageSent(
		bytes32 indexed messageId, // The unique ID of the CCIP message.
		uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
		address receiver, // The address of the receiver on the destination chain.
		string text, // The text being sent.
		address feeToken, // the token address used to pay CCIP fees.
		uint256 fees // The fees paid for sending the CCIP message.
	);

	// Event emitted when a message is received from another chain.
	event MessageReceived(
		bytes32 indexed messageId, // The unique ID of the CCIP message.
		uint64 indexed sourceChainSelector, // The chain selector of the source chain.
		address sender, // The address of the sender from the source chain.
		string text // The text that was received.
	);

	// Event emitted when a message is sent to another chain.
	event MessageWithTokenSent(
		bytes32 indexed messageId, // The unique ID of the CCIP message.
		uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
		address receiver, // The address of the receiver on the destination chain.
		string text, // The text being sent.
		address token, // The token address that was transferred.
		uint256 tokenAmount, // The token amount that was transferred.
		address feeToken, // the token address used to pay CCIP fees.
		uint256 fees // The fees paid for sending the message.
	);

	// Event emitted when a message is received from another chain.
	event MessageWithTokenReceived(
		bytes32 indexed messageId, // The unique ID of the CCIP message.
		uint64 indexed sourceChainSelector, // The chain selector of the source chain.
		address sender, // The address of the sender from the source chain.
		string text, // The text that was received.
		address token, // The token address that was transferred.
		uint256 tokenAmount // The token amount that was transferred.
	);

	bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
	string private s_lastReceivedText; // Store the last received text.
	address private s_lastReceivedTokenAddress; // Store the last received token address.
	uint256 private s_lastReceivedTokenAmount; // Store the last received amount.

	// Mapping to keep track of allowlisted destination chains.
	mapping(uint64 => bool) public allowlistedDestinationChains;

	// Mapping to keep track of allowlisted source chains.
	mapping(uint64 => bool) public allowlistedSourceChains;

	IRouterClient private s_router;

	IERC20 private s_linkToken;

	/// @notice Constructor initializes the contract with the router address.
	/// @param _router The address of the router contract.
	/// @param _link The address of the link contract.
	constructor(address _router, address _link, address _owner) CCIPReceiver(_router) MultiOwners(_owner){
		s_router = IRouterClient(_router);
		s_linkToken = IERC20(_link);
	}

	/// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
	/// @param _destinationChainSelector The selector of the destination chain.
	modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
		if (!allowlistedDestinationChains[_destinationChainSelector])
			revert DestinationChainNotAllowlisted(_destinationChainSelector);
		_;
	}

	/// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted.
	/// @param _sourceChainSelector The selector of the source chain.
	modifier onlyAllowlistedSourceChain(uint64 _sourceChainSelector) {
		if (!allowlistedSourceChains[_sourceChainSelector])
			revert SourceChainNotAllowlisted(_sourceChainSelector);
		_;
	}

	/// @dev Updates the allowlist status of a destination chain for transactions.
	/// @notice This function can only be called by the owner.
	/// @param _destinationChainSelector The selector of the destination chain to be updated.
	/// @param allowed The allowlist status to be set for the destination chain.
	function allowlistDestinationChain(
		uint64 _destinationChainSelector,
		bool allowed
	) external onlyOwners {
		allowlistedDestinationChains[_destinationChainSelector] = allowed;
	}

	/// @dev Updates the allowlist status of a source chain
	/// @notice This function can only be called by the owner.
	/// @param _sourceChainSelector The selector of the source chain to be updated.
	/// @param allowed The allowlist status to be set for the source chain.
	function allowlistSourceChain(
		uint64 _sourceChainSelector,
		bool allowed
	) external onlyOwners {
		allowlistedSourceChains[_sourceChainSelector] = allowed;
	}

	/// @notice Transfer tokens to receiver on the destination chain.
	/// @notice Pay in native gas such as ETH on Ethereum or MATIC on Polgon.
	/// @notice the token must be in the list of supported tokens.
	/// @notice This function can only be called by the owner.
	/// @dev Assumes your contract has sufficient native gas like ETH on Ethereum or MATIC on Polygon.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _token token address.
	/// @param _amount token amount.
	/// @return messageId The ID of the message that was sent.
	function transferTokensPayNative(
		uint64 _destinationChainSelector,
		address _receiver,
		address _token,
		uint256 _amount
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		// address(0) means fees are paid in native gas
		Client.EVM2AnyMessage
			memory evm2AnyMessage = _buildCCIPMessageForTokenTransfer(
				_receiver,
				_token,
				_amount,
				address(0)
			);

		// Get the fee required to send the message
		uint256 fees = s_router.getFee(
			_destinationChainSelector,
			evm2AnyMessage
		);

		if (fees > address(this).balance)
			revert NotEnoughBalance(address(this).balance, fees);

		// approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
		IERC20(_token).approve(address(s_router), _amount);

		// Send the message through the router and store the returned message ID
		messageId = s_router.ccipSend{ value: fees }(
			_destinationChainSelector,
			evm2AnyMessage
		);

		// Emit an event with message details
		emit TokensTransferred(
			messageId,
			_destinationChainSelector,
			_receiver,
			_token,
			_amount,
			address(0),
			fees
		);

		// Return the message ID
		return messageId;
	}

	/// @notice Transfer tokens to receiver on the destination chain.
	/// @notice pay in LINK.
	/// @notice the token must be in the list of supported tokens.
	/// @notice This function can only be called by the owner.
	/// @dev Assumes your contract has sufficient LINK tokens to pay for the fees.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _token token address.
	/// @param _amount token amount.
	/// @return messageId The ID of the message that was sent.
	function transferTokensPayLINK(
		uint64 _destinationChainSelector,
		address _receiver,
		address _token,
		uint256 _amount
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		//  address(linkToken) means fees are paid in LINK
		Client.EVM2AnyMessage
			memory evm2AnyMessage = _buildCCIPMessageForTokenTransfer(
				_receiver,
				_token,
				_amount,
				address(s_linkToken)
			);

		// Get the fee required to send the message
		uint256 fees = s_router.getFee(
			_destinationChainSelector,
			evm2AnyMessage
		);

		if (fees > s_linkToken.balanceOf(address(this)))
			revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

		// approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
		s_linkToken.approve(address(s_router), fees);

		// approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
		IERC20(_token).approve(address(s_router), _amount);

		// Send the message through the router and store the returned message ID
		messageId = s_router.ccipSend(
			_destinationChainSelector,
			evm2AnyMessage
		);

		// Emit an event with message details
		emit TokensTransferred(
			messageId,
			_destinationChainSelector,
			_receiver,
			_token,
			_amount,
			address(s_linkToken),
			fees
		);

		// Return the message ID
		return messageId;
	}

	/// @notice Construct a CCIP message.
	/// @dev This function will create an EVM2AnyMessage struct with all the necessary information for tokens transfer.
	/// @param _receiver The address of the receiver.
	/// @param _token The token to be transferred.
	/// @param _amount The amount of the token to be transferred.
	/// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
	/// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
	function _buildCCIPMessageForTokenTransfer(
		address _receiver,
		address _token,
		uint256 _amount,
		address _feeTokenAddress
	) internal pure returns (Client.EVM2AnyMessage memory) {
		// Set the token amounts
		Client.EVMTokenAmount[]
			memory tokenAmounts = new Client.EVMTokenAmount[](1);
		tokenAmounts[0] = Client.EVMTokenAmount({
			token: _token,
			amount: _amount
		});

		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		return
			Client.EVM2AnyMessage({
				receiver: abi.encode(_receiver), // ABI-encoded receiver address
				data: "", // No data
				tokenAmounts: tokenAmounts, // The amount and type of token being transferred
				extraArgs: Client._argsToBytes(
					// Additional arguments, setting gas limit to 0 as we are not sending any data and non-strict sequencing mode
					Client.EVMExtraArgsV1({ gasLimit: 0, strict: false })
				),
				// Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
				feeToken: _feeTokenAddress
			});
	}

	/// @notice Sends data to receiver on the destination chain.
	/// @notice Pay for fees in LINK.
	/// @dev Assumes your contract has sufficient LINK.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _text The text to be sent.
	/// @return messageId The ID of the CCIP message that was sent.
	function sendMessagePayLINK(
		uint64 _destinationChainSelector,
		address _receiver,
		string calldata _text
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
			_receiver,
			_text,
			address(s_linkToken)
		);

		// Initialize a router client instance to interact with cross-chain router
		IRouterClient router = IRouterClient(this.getRouter());

		// Get the fee required to send the CCIP message
		uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

		if (fees > s_linkToken.balanceOf(address(this)))
			revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

		// approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
		s_linkToken.approve(address(router), fees);

		// Send the CCIP message through the router and store the returned CCIP message ID
		messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

		// Emit an event with message details
		emit MessageSent(
			messageId,
			_destinationChainSelector,
			_receiver,
			_text,
			address(s_linkToken),
			fees
		);

		// Return the CCIP message ID
		return messageId;
	}

	/// @notice Sends data to receiver on the destination chain.
	/// @notice Pay for fees in native gas.
	/// @dev Assumes your contract has sufficient native gas tokens.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _text The text to be sent.
	/// @return messageId The ID of the CCIP message that was sent.
	function sendMessagePayNative(
		uint64 _destinationChainSelector,
		address _receiver,
		string calldata _text
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
			_receiver,
			_text,
			address(0)
		);

		// Initialize a router client instance to interact with cross-chain router
		IRouterClient router = IRouterClient(this.getRouter());

		// Get the fee required to send the CCIP message
		uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

		if (fees > address(this).balance)
			revert NotEnoughBalance(address(this).balance, fees);

		// Send the CCIP message through the router and store the returned CCIP message ID
		messageId = router.ccipSend{ value: fees }(
			_destinationChainSelector,
			evm2AnyMessage
		);

		// Emit an event with message details
		emit MessageSent(
			messageId,
			_destinationChainSelector,
			_receiver,
			_text,
			address(0),
			fees
		);

		// Return the CCIP message ID
		return messageId;
	}

	/// @notice Construct a CCIP message.
	/// @dev This function will create an EVM2AnyMessage struct with all the necessary information for sending a text.
	/// @param _receiver The address of the receiver.
	/// @param _text The string data to be sent.
	/// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
	/// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
	function _buildCCIPMessage(
		address _receiver,
		string calldata _text,
		address _feeTokenAddress
	) internal pure returns (Client.EVM2AnyMessage memory) {
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		return
			Client.EVM2AnyMessage({
				receiver: abi.encode(_receiver), // ABI-encoded receiver address
				data: abi.encode(_text), // ABI-encoded string
				tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
				extraArgs: Client._argsToBytes(
					// Additional arguments, setting gas limit and non-strict sequencing mode
					Client.EVMExtraArgsV1({ gasLimit: 200_000, strict: false })
				),
				// Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
				feeToken: _feeTokenAddress
			});
	}

	/// handle a received message
	function _ccipReceive(
		Client.Any2EVMMessage memory any2EvmMessage
	)
		internal
		override
		onlyAllowlistedSourceChain(any2EvmMessage.sourceChainSelector) // Make sure source chain is allowlisted
	{
		s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
		s_lastReceivedText = abi.decode(any2EvmMessage.data, (string)); // abi-decoding of the sent text
		// Expect one token to be transferred at once, but you can transfer several tokens.
		s_lastReceivedTokenAddress = any2EvmMessage.destTokenAmounts[0].token;
		s_lastReceivedTokenAmount = any2EvmMessage.destTokenAmounts[0].amount;

		if (s_lastReceivedTokenAmount == 0) {
			emit MessageReceived(
				any2EvmMessage.messageId,
				any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
				abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
				abi.decode(any2EvmMessage.data, (string))
			);
		}

		emit MessageWithTokenReceived(
			any2EvmMessage.messageId,
			any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
			abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
			abi.decode(any2EvmMessage.data, (string)),
			any2EvmMessage.destTokenAmounts[0].token,
			any2EvmMessage.destTokenAmounts[0].amount
		);
	}

	/// @notice Sends data and transfer tokens to receiver on the destination chain.
	/// @notice Pay for fees in LINK.
	/// @dev Assumes your contract has sufficient LINK to pay for CCIP fees.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _text The string data to be sent.
	/// @param _token token address.
	/// @param _amount token amount.
	/// @return messageId The ID of the CCIP message that was sent.
	function sendMessageWithTokenPayLINK(
		uint64 _destinationChainSelector,
		address _receiver,
		string calldata _text,
		address _token,
		uint256 _amount
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		// address(linkToken) means fees are paid in LINK
		Client.EVM2AnyMessage
			memory evm2AnyMessage = _buildCCIPMessageWithToken(
				_receiver,
				_text,
				_token,
				_amount,
				address(s_linkToken)
			);

		// Initialize a router client instance to interact with cross-chain router
		IRouterClient router = IRouterClient(this.getRouter());

		// Get the fee required to send the CCIP message
		uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

		if (fees > s_linkToken.balanceOf(address(this)))
			revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

		// approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
		s_linkToken.approve(address(router), fees);

		// approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
		IERC20(_token).approve(address(router), _amount);

		// Send the message through the router and store the returned message ID
		messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

		// Emit an event with message details
		emit MessageWithTokenSent(
			messageId,
			_destinationChainSelector,
			_receiver,
			_text,
			_token,
			_amount,
			address(s_linkToken),
			fees
		);

		// Return the message ID
		return messageId;
	}

	/// @notice Sends data and transfer tokens to receiver on the destination chain.
	/// @notice Pay for fees in native gas.
	/// @dev Assumes your contract has sufficient native gas like ETH on Ethereum or MATIC on Polygon.
	/// @param _destinationChainSelector The identifier (aka selector) for the destination blockchain.
	/// @param _receiver The address of the recipient on the destination blockchain.
	/// @param _text The string data to be sent.
	/// @param _token token address.
	/// @param _amount token amount.
	/// @return messageId The ID of the CCIP message that was sent.
	function sendMessageWithTokenPayNative(
		uint64 _destinationChainSelector,
		address _receiver,
		string calldata _text,
		address _token,
		uint256 _amount
	)
		external
		onlyOwners
		onlyAllowlistedDestinationChain(_destinationChainSelector)
		returns (bytes32 messageId)
	{
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		// address(0) means fees are paid in native gas
		Client.EVM2AnyMessage
			memory evm2AnyMessage = _buildCCIPMessageWithToken(
				_receiver,
				_text,
				_token,
				_amount,
				address(0)
			);

		// Initialize a router client instance to interact with cross-chain router
		IRouterClient router = IRouterClient(this.getRouter());

		// Get the fee required to send the CCIP message
		uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

		if (fees > address(this).balance)
			revert NotEnoughBalance(address(this).balance, fees);

		// approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
		IERC20(_token).approve(address(router), _amount);

		// Send the message through the router and store the returned message ID
		messageId = router.ccipSend{ value: fees }(
			_destinationChainSelector,
			evm2AnyMessage
		);

		// Emit an event with message details
		emit MessageWithTokenSent(
			messageId,
			_destinationChainSelector,
			_receiver,
			_text,
			_token,
			_amount,
			address(0),
			fees
		);

		// Return the message ID
		return messageId;
	}

	/// @notice Construct a CCIP message.
	/// @dev This function will create an EVM2AnyMessage struct with all the necessary information for programmable tokens transfer.
	/// @param _receiver The address of the receiver.
	/// @param _text The string data to be sent.
	/// @param _token The token to be transferred.
	/// @param _amount The amount of the token to be transferred.
	/// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
	/// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
	function _buildCCIPMessageWithToken(
		address _receiver,
		string calldata _text,
		address _token,
		uint256 _amount,
		address _feeTokenAddress
	) internal pure returns (Client.EVM2AnyMessage memory) {
		// Set the token amounts
		Client.EVMTokenAmount[]
			memory tokenAmounts = new Client.EVMTokenAmount[](1);
		tokenAmounts[0] = Client.EVMTokenAmount({
			token: _token,
			amount: _amount
		});
		// Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
		return
			Client.EVM2AnyMessage({
				receiver: abi.encode(_receiver), // ABI-encoded receiver address
				data: abi.encode(_text), // ABI-encoded string
				tokenAmounts: tokenAmounts, // The amount and type of token being transferred
				extraArgs: Client._argsToBytes(
					// Additional arguments, setting gas limit and non-strict sequencing mode
					Client.EVMExtraArgsV1({ gasLimit: 200_000, strict: false })
				),
				// Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
				feeToken: _feeTokenAddress
			});
	}

	/// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
	/// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
	/// It should only be callable by the owner of the contract.
	/// @param _beneficiary The address to which the Ether should be transferred.
	function withdraw(address _beneficiary) public onlyOwners {
		// Retrieve the balance of this contract
		uint256 amount = address(this).balance;

		// Revert if there is nothing to withdraw
		if (amount == 0) revert NothingToWithdraw();

		// Attempt to send the funds, capturing the success status and discarding any return data
		(bool sent, ) = _beneficiary.call{ value: amount }("");

		// Revert if the send failed, with information about the attempted transfer
		if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
	}

	/// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
	/// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
	/// @param _beneficiary The address to which the tokens will be sent.
	/// @param _token The contract address of the ERC20 token to be withdrawn.
	function withdrawToken(
		address _beneficiary,
		address _token
	) public onlyOwners {
		// Retrieve the balance of this contract
		uint256 amount = IERC20(_token).balanceOf(address(this));

		// Revert if there is nothing to withdraw
		if (amount == 0) revert NothingToWithdraw();

		IERC20(_token).transfer(_beneficiary, amount);
	}

	/// @notice Fallback function to allow the contract to receive Ether.
	/// @dev This function has no function body, making it a default function for receiving Ether.
	/// It is automatically called when Ether is transferred to the contract without any data.
	receive() external payable {}
}