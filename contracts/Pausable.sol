pragma solidity ^0.4.4;

contract Pausable {
    
    bool public contractPaused;
    address public owner;

    modifier isAdmin() {
        require(msg.sender == owner);
        _;
    }

    function pauseContract() isAdmin public returns (bool success){
        contractPaused = !contractPaused;
        return true;
    }

    function emergencyWithdrawal() isAdmin public returns (bool success) {
        require(contractPaused);

        msg.sender.transfer(this.balance);

        return true;
    }

}