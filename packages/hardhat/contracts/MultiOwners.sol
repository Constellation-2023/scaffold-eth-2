// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiOwners {
	mapping(address => bool) private owners;
	uint8 ownersCount;

	modifier onlyOwners() {
		require(owners[msg.sender], "Only owners can call this function");
		_;
	}

	constructor() {
		owners[msg.sender] = true;
		ownersCount++;
	}

	function addOwner(address newOwner) public onlyOwners {
		owners[newOwner] = true;
		ownersCount++;
	}

	function removeOwner(address owner) public onlyOwners {
		owners[owner] = false;
		ownersCount++;
	}
}
