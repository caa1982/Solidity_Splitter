pragma solidity ^0.4.4;

contract Splitter {

    struct Addresses {
        address owner;
        address carol;
        address bob;
    }
    
    Addresses public addresses;

    mapping (address => uint) public balances;
    mapping (address => uint) public totalPayed;
    mapping (address => uint) public totalReceived;

    function Splitter (address carol, address bob) public {

        addresses.owner = msg.sender;
        addresses.carol = carol;
        addresses.bob = bob;

    }

    function split() public payable returns (bool splited) {

        require(msg.value > 0);

        var amount = msg.value / 2;

        totalPayed[msg.sender] += msg.value;

        balances[addresses.bob] += amount;
        totalReceived[addresses.bob] += amount;

        balances[addresses.carol] += amount;
        totalReceived[addresses.carol] += amount;

        if (msg.value % 2 > 0)
            msg.sender.transfer(1);
        
        return true;
    }

    function withdrawal() public returns (bool transfer) {
        
        uint withdraw = balances[msg.sender];

        balances[msg.sender] = 0;
        
        require(withdraw > 0);

        msg.sender.transfer(withdraw);

        return true;
    } 

    function kill() public {
        require(msg.sender == addresses.owner);
        selfdestruct(addresses.owner);
    }

}
