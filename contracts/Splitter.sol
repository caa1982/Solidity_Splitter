pragma solidity ^0.4.4;

import "./Pausable.sol";

contract Splitter is Pausable {

    struct UserStruct {
        string name;
        uint balance;
        uint totalSent;
        uint totalReceived;
        uint totalWithdrawn;
    }

    address public carol;
    address public bob;

    bool private stopped = false;

    mapping (address => UserStruct) public userStructs;
    
    function Splitter (address _carol, address _bob) public {

        owner = msg.sender;
        carol = _carol;
        bob = _bob;
        userStructs[owner].name = "Alice";
        userStructs[carol].name = "Carol";
        userStructs[bob].name = "Bob";

    }

    function splitCarolBob() stopInEmergency public payable returns (bool success){
        
        customSplit({receiver1: carol, receiver2: bob});

        return true;

    }

    function registerNameToAddress(address Address, string name) stopInEmergency public returns (bool success) {
        
        require(msg.sender == Address);

        userStructs[Address].name = name;

        return true;
    }

    function customSplit(address receiver1, address receiver2) stopInEmergency public payable returns (bool success) {

        require(msg.value > 0);

        var amount = msg.value / 2;

        userStructs[msg.sender].totalSent += msg.value;

        userStructs[receiver1].balance += amount;
        userStructs[receiver1].totalReceived += amount;

        userStructs[receiver2].balance += amount;
        userStructs[receiver2].totalReceived += amount;

        if (msg.value % 2 > 0) msg.sender.transfer(1);
        
        return true;
    }
    
    function withdrawal() stopInEmergency public returns (bool success) {
        
        uint withdraw = userStructs[msg.sender].balance;

        userStructs[msg.sender].totalWithdrawn += withdraw;

        userStructs[msg.sender].balance = 0;
        
        require(withdraw > 0);

        msg.sender.transfer(withdraw);

        return true;
    }

}

