// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiOwners {
	mapping(address => bool) private owners;
	uint8 public ownersCount;

	modifier onlyOwners() {
		require(owners[msg.sender], "Only owners can call this function");
		_;
	}

	constructor(address _owner) {
		owners[_owner] = true;
		ownersCount++;
	}

	function addOwner(address newOwner) public onlyOwners {
		owners[newOwner] = true;
		ownersCount++;
	}

	function removeOwner(address owner) public onlyOwners {
		require(ownersCount != 0, "Atleast one owner should own the contract");
		owners[owner] = false;
		ownersCount++;
	}
}