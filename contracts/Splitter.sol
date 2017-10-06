pragma solidity ^0.4.4;

import "./Pausable.sol";

contract Splitter is Pausable {

    event SendSplitt(
        address from, 
        address receiver1, 
        address receiver2,
        uint totalAmount
    );

    event Withdraw(address from, uint amount);

    struct UserStruct {
        uint balance;
        uint totalSplitted;
        uint totalReceived;
        uint totalWithdrawn;
    }

    mapping (address => UserStruct) public userStructs;
    
    function Splitter () public {
        owner = msg.sender;
    }

    function sendSplit(address receiver1, address receiver2) public payable returns (bool success) {

        SendSplitt(msg.sender, receiver1, receiver2, msg.value);
        
        require(
            !contractPaused && 
            receiver1 != receiver2 && 
            receiver1 != 0 && 
            receiver2 != 0 &&
            msg.value > 0 
        );

        var amount = msg.value / 2;

        userStructs[msg.sender].totalSplitted += msg.value;

        userStructs[receiver1].balance += amount;
        userStructs[receiver1].totalReceived += amount;

        userStructs[receiver2].balance += amount;
        userStructs[receiver2].totalReceived += amount;

        if (msg.value % 2 > 0) msg.sender.transfer(1);
        
        return true;
    }
    
    function withdrawal() public returns (bool success) {
        
        Withdraw(msg.sender, amount);

        uint amount = userStructs[msg.sender].balance;

        require(!contractPaused && amount > 0);

        userStructs[msg.sender].totalWithdrawn += amount;

        userStructs[msg.sender].balance = 0;

        msg.sender.transfer(amount);

        return true;
    } 


}
