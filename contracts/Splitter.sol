pragma solidity ^0.4.4;

contract Splitter {

    struct UserStruct {
        string name;
        uint balance;
        uint totalSent;
        uint totalReceived;
        uint totalWithdrawn;
    }

    address public owner;
    address public carol;
    address public bob;

    mapping (address => UserStruct) public userStructs;
    
    function Splitter (address _carol, address _bob) public {

        owner = msg.sender;
        carol = _carol;
        bob = _bob;
        userStructs[owner].name = "Alice";
        userStructs[carol].name = "Carol";
        userStructs[bob].name = "Bob";

    }

    function splitCarolBob() public payable returns (bool success){
        
        customSplit({receiver1: carol, receiver2: bob});

        return true;

    }

    function registerNameToAddress(address Address, string name) public returns (bool success) {
        
        userStructs[Address].name = name;

        return true;
    }

    function customSplit(address receiver1, address receiver2) public payable returns (bool success) {

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
    
    function withdrawal() public returns (bool success) {
        
        uint withdraw = userStructs[msg.sender].balance;

        userStructs[msg.sender].totalWithdrawn += withdraw;

        userStructs[msg.sender].balance = 0;
        
        require(withdraw > 0);

        msg.sender.transfer(withdraw);

        return true;
    } 

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }

}
