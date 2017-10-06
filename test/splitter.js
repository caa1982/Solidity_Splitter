const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', accounts => { 

    let contract;

    const owner = accounts[0];
    const carol = accounts[1];
    const bob = accounts[2];
    const amount = web3.toWei(16, "ether");

    beforeEach( () => 
        Splitter.new(carol, bob, {from: owner})
        .then( instance => contract = instance )
    );

    it("Should be own by the owner", () => 
        contract.owner({from : owner}).then(_owner =>
        assert.equal(_owner, owner, "Contract is not owned by the owner") )
    );
    
    it("Should send from owner and spilt to carol and bob", () => {

        const startingETHOwner = web3.eth.getBalance(owner).toNumber();
        let startingBalanceCarol;
        let startingBalanceBob;

        let endingBalanceCarol;
        let endingBalanceBob;

        return contract.userStructs(bob, {from : owner})
            .then( result => {
                startingBalanceCarol = result[0].toNumber();
                return contract.userStructs(bob, {from : owner});
            })
            .then( result => {
                startingBalanceBob = result[0].toNumber();
                return contract.sendSplit(carol, bob, {value: amount, from: owner});
            })
            .then( () =>  contract.userStructs(carol, {from : owner}) )
            .then( result => {
                endingBalanceCarol = result[0].toNumber();
                return contract.userStructs(bob, {from : owner}) 
            })
            .then( result => {
                
                endingBalanceBob = result[0].toNumber();
                
                const endingETHOwner = web3.eth.getBalance(owner).toNumber();
                
                assert.equal(endingBalanceCarol, startingBalanceCarol + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingBalanceBob, startingBalanceBob + amount / 2, "Amount wasn't correctly split");
                assert.isBelow(endingETHOwner, startingETHOwner, "Amount wasn't sent correctly from owner");
                
            });
    });

    it("Should withdraw from carol and bob balances and credit their ETH account", ()=>{
        
        const startingETHCarol = web3.eth.getBalance(carol).toNumber();
        const startingETHBob = web3.eth.getBalance(bob).toNumber();

        let BalanceCarol;
        let BalanceBob;

        return contract.sendSplit(carol, bob, {value: amount, from: owner})
        .then( () =>  contract.withdrawal({from : carol}) )
        .then( () =>  contract.withdrawal({from : bob}) )
        .then( () => contract.userStructs(carol, {from : owner}) )
        .then( result => {
            BalanceCarol = result[0].toNumber();
            return contract.userStructs(bob, {from : owner});
        })
        .then( result => {

            BalanceBob = result[0].toNumber();
            
            const endingETHCarol = web3.eth.getBalance(carol).toNumber();
            const endingETHBob = web3.eth.getBalance(bob).toNumber();

            assert.equal(BalanceCarol, 0, "carol balance is not equal to zero");
            assert.equal(BalanceBob, 0, "bob balance is not equal to zero");
            assert.isAbove(endingETHCarol, startingETHCarol, "balance wasn't sent correctly");
            assert.isAbove(endingETHBob, startingETHBob, "balance wasn't sent correctly");
            
        });
    });


});