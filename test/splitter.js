const Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', (accounts) => { 

    let contract;

    const owner = accounts[0];
    const carole = accounts[1];
    const bob = accounts[2];

    beforeEach( () => 
        Splitter.new(carole, bob, {from: owner})
        .then( (instance) => contract = instance )
    );

    it("Should be own by the owner", () => 
        contract.addresses({from : owner}).then( (address) => (_owner) =>
        assert.striclyEqual(_owner, owner, "Contract is not owned by the owner") )
    )
    
    it("Should send from owner and spilt to carole and bob", () => {

        const startingETHOwner = web3.eth.getBalance(owner).toString();
        let startingBalanceCarole;
        let startingBalanceBob;

        let endingBalanceCarole;
        let endingBalanceBob;

        const amount = 16000;

        return contract.balances(carole, {from : owner})
            .then( (balance) => {
                startingBalanceCarole = balance.toNumber();
                return contract.balances(bob, {from : owner});
            })
            .then((balance) => {
                startingBalanceBob = balance.toNumber();
                return contract.split({value: amount, from: owner});
            })
            .then( () =>  contract.balances(carole, {from : owner}) )
            .then( (balance) => {
                endingBalanceCarole = balance;
                return contract.balances(bob, {from : owner}) 
            })
            .then( (balance) => {
                
                endingBalanceBob = balance;
                
                const endingETHOwner = web3.eth.getBalance(owner).toString()

                assert.equal(endingBalanceCarole, startingBalanceCarole + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingBalanceBob, startingBalanceBob + amount / 2, "Amount wasn't correctly split");
                assert.equal(endingETHOwner, startingETHOwner - (amount + 12399200000000000), "Amount wasn't sent correctly from owner");
                
            })
        })

    it("Should withdraw from carole and bob balances and credit their ETH account", ()=>{
        
        const startingETHCarole = web3.eth.getBalance(carole).toString();
        const startingETHBob = web3.eth.getBalance(bob).toString();

        let BalanceCarole;
        let BalanceBob;

        amount = 1600;

        return contract.split({value: amount, from: owner})
        .then( () =>  contract.withdrawal({from : carole}) )
        .then( () =>  contract.withdrawal({from : bob}) )
        .then( () => contract.balances(carole, {from : owner}) )
        .then( (balance) => {
            BalanceCarole = balance.toNumber();
            return contract.balances(bob, {from : owner});
        })
        .then( (balance) => {

            BalanceBob = balance.toNumber();
            
            const endingETHCarole = web3.eth.getBalance(carole).toString();
            const endingETHBob = web3.eth.getBalance(bob).toString();

            assert.equal(BalanceCarole, "0", "carole balance is not equal to zero");
            assert.equal(BalanceBob, "0", "bob balance is not equal to zero");
            assert.isAbove(startingETHCarole, endingETHCarole, "balance wasn't sent correctly");
            assert.isAbove(startingETHBob, endingETHBob, "balance wasn't sent correctly");
            
        })
    })   


});