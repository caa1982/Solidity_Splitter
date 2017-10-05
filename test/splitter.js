const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', accounts => { 

    let contract;

    const owner = accounts[0];
    const carol = accounts[1];
    const bob = accounts[2];

    beforeEach( () => 
        Splitter.new(carol, bob, {from: owner})
        .then( instance => contract = instance )
    );

    it("Should be own by the owner", () => 
        contract.owner({from : owner}).then(_owner =>
        assert.striclyEqual(_owner, owner, "Contract is not owned by the owner") )
    )
    
    it("Should send from owner and spilt to carol and bob", () => {

        const startingETHOwner = web3.eth.getBalance(owner).toString();
        let startingBalanceCarol;
        let startingBalanceBob;

        let endingBalanceCarol;
        let endingBalanceBob;

        const amount = 16000000000000000000;

        return contract.balances(carol, {from : owner})
            .then( balance => {
                startingBalanceCarol = balance.toNumber();
                return contract.balances(bob, {from : owner});
            })
            .then( balance => {
                startingBalanceBob = balance.toNumber();
                return contract.split({value: amount, from: owner});
            })
            .then( () =>  contract.balances(carol, {from : owner}) )
            .then( balance => {
                endingBalanceCarol = balance;
                return contract.balances(bob, {from : owner}) 
            })
            .then( balance => {
                
                endingBalanceBob = balance;
                
                const endingETHOwner = web3.eth.getBalance(owner).toString()

                assert.equal(endingBalanceCarol, startingBalanceCarol + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingBalanceBob, startingBalanceBob + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingETHOwner, startingETHOwner - (amount + 12399200000000000), "Amount wasn't sent correctly from owner");
                
            })
        })

    it("Should withdraw from carol and bob balances and credit their ETH account", ()=>{
        
        const startingETHCarol = web3.eth.getBalance(carol).toString();
        const startingETHBob = web3.eth.getBalance(bob).toString();

        let BalanceCarol;
        let BalanceBob;

        const amount = 16000000000000000000;

        return contract.split({value: amount, from: owner})
        .then( () =>  contract.withdrawal({from : carol}) )
        .then( () =>  contract.withdrawal({from : bob}) )
        .then( () => contract.balances(carol, {from : owner}) )
        .then( balance => {
            BalanceCarol = balance.toNumber();
            return contract.balances(bob, {from : owner});
        })
        .then( balance => {

            BalanceBob = balance.toNumber();
            
            const endingETHCarol = web3.eth.getBalance(carol).toString();
            const endingETHBob = web3.eth.getBalance(bob).toString();

            assert.equal(BalanceCarol, "0", "carol balance is not equal to zero");
            assert.equal(BalanceBob, "0", "bob balance is not equal to zero");
            assert.isAbove(endingETHCarol, startingETHCarol, "balance wasn't sent correctly");
            assert.isAbove(endingETHBob, startingETHBob, "balance wasn't sent correctly");
            
        })
    })   


});