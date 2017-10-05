pragma solidity ^0.4.4;

contract Pausable {
    
    address public owner;
    bool private stopped = false;

    modifier isAdmin() {
        require(msg.sender == owner);
        _;
    }

    function toggleContractActive() isAdmin public{
        stopped = !stopped;
    }
    
    modifier stopInEmergency { if (!stopped) _; else revert(); }
    modifier onlyInEmergency { if (stopped) _; }


    function emergencyWithdrawal() onlyInEmergency isAdmin public returns (bool success) {
        
        msg.sender.transfer(this.balance);

        return true;

    }

}