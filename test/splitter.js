const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', accounts => { 

    let contract;

    const owner = accounts[0];
    const carol = accounts[1];
    const bob = accounts[2];
    const amount = 16000000000000000000;

    beforeEach( () => 
        Splitter.new(carol, bob, {from: owner})
        .then( instance => contract = instance )
    );

    it("Should be own by the owner", () => 
        contract.owner({from : owner}).then(_owner =>
        assert.equal(_owner, owner, "Contract is not owned by the owner") )
    )
    
    it("Should send from owner and spilt to carol and bob", () => {

        const startingETHOwner = web3.eth.getBalance(owner).toString();
        let startingBalanceCarol;
        let startingBalanceBob;

        let endingBalanceCarol;
        let endingBalanceBob;

        return contract.userStructs(bob, {from : owner})
            .then( result => {
                startingBalanceCarol = result[1].toNumber();
                return contract.userStructs(bob, {from : owner});
            })
            .then( result => {
                startingBalanceBob = result[1].toNumber();
                return contract.splitCarolBob({value: amount, from: owner});
            })
            .then( () =>  contract.userStructs(carol, {from : owner}) )
            .then( result => {
                endingBalanceCarol = result[1].toNumber();
                return contract.userStructs(bob, {from : owner}) 
            })
            .then( result => {
                
                endingBalanceBob = result[1].toNumber();
                
                const endingETHOwner = web3.eth.getBalance(owner).toString()
                
                assert.equal(endingBalanceCarol, startingBalanceCarol + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingBalanceBob, startingBalanceBob + amount / 2, "Amount wasn't correctly split");
                assert.isBelow(endingETHOwner, startingETHOwner - amount, "Amount wasn't sent correctly from owner");
                
            })
        })

    it("Should withdraw from carol and bob balances and credit their ETH account", ()=>{
        
        const startingETHCarol = web3.eth.getBalance(carol).toString();
        const startingETHBob = web3.eth.getBalance(bob).toString();

        let BalanceCarol;
        let BalanceBob;

        return contract.splitCarolBob({value: amount, from: owner})
        .then( () =>  contract.withdrawal({from : carol}) )
        .then( () =>  contract.withdrawal({from : bob}) )
        .then( () => contract.userStructs(carol, {from : owner}) )
        .then( result => {
            BalanceCarol = result[2].toNumber();
            return contract.userStructs(bob, {from : owner});
        })
        .then( result => {

            BalanceBob = result[2].toNumber();
            
            const endingETHCarol = web3.eth.getBalance(carol).toString();
            const endingETHBob = web3.eth.getBalance(bob).toString();

            assert.equal(BalanceCarol, "0", "carol balance is not equal to zero");
            assert.equal(BalanceBob, "0", "bob balance is not equal to zero");
            assert.isAbove(endingETHCarol, startingETHCarol, "balance wasn't sent correctly");
            assert.isAbove(endingETHBob, startingETHBob, "balance wasn't sent correctly");
            
        })
    })   


});