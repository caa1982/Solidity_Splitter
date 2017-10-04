pragma solidity ^0.4.4;

contract Splitter {

    struct UserStruct {
        uint balance;
        uint totalSent;
        uint totalReceived;
        uint totalWithdrawn;
    }

    address public owner;
    address public carol;
    address public bob;

    mapping (address => UserStruct) public userStructs;

    function Splitter (address address1, address address2) public {

        owner = msg.sender;
        carol = address1;
        bob = address2;

    }

    function split() public payable returns (bool splitted) {

        require(msg.value > 0);

        var amount = msg.value / 2;

        userStructs[msg.sender].totalSent += msg.value;

        userStructs[bob].balance += amount;
        userStructs[bob].totalReceived += amount;

        userStructs[carol].balance += amount;
        userStructs[carol].totalReceived += amount;

        if (msg.value % 2 > 0)
            msg.sender.transfer(1);
        
        return true;
    }

    function withdrawal() public returns (bool transfer) {
        
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
