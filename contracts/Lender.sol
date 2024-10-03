// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lender {
    address public owner;
    mapping(address => uint256) public balances;
    
    constructor() {
        owner = msg.sender;
    }

    // Lend function
    function lend() public payable {
        require(msg.value > 0, "You need to lend some ether");
        balances[msg.sender] += msg.value;
    }

    // Borrow function
    function borrow(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance to borrow");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    // Get balance
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
