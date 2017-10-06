pragma solidity ^0.4.4;

contract Pausable {
    
    bool public contractPaused;
    address public owner;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function pauseContract() isOwner public returns (bool success){
        contractPaused = !contractPaused;
        return true;
    }

    function emergencyWithdrawal() isOwner public returns (bool success) {
        require(contractPaused);

        msg.sender.transfer(this.balance);

        return true;
    }

}