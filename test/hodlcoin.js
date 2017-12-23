var hodlcoin = artifacts.require("HODLCoin");

contract('HODLCoin', function(accounts) {
  var hodl;

  before(async function() {
    hodl = await hodlcoin.deployed();
  });

  it('should issue tokens', async function() {
    // First depositor gets 98% of their deposit in tokens, for full value
    // since there's nobody else to get the fee
    await hodl.sendTransaction({from: accounts[0], value: 1e18});
    assert.equal((await hodl.balanceOf(accounts[0])).toNumber(), 1e20);
    assert.equal((await hodl.totalSupply()), 1e20);
    assert.equal((await hodl.value(1e20)).toNumber(), 1e18);
    assert.equal((await web3.eth.getBalance(hodl.address)), 1e18);
    assert.equal((await hodl.value(await hodl.totalSupply())).toNumber(), (await web3.eth.getBalance(hodl.address)).toNumber());

    // Second depositor gets ~99% of their value, the remainder going in tx fees
    // to existing holders.
    await hodl.sendTransaction({from: accounts[1], value: 1e18});
    var totalSupply = await hodl.totalSupply();
    assert.equal(totalSupply, 1e20 + 1e20 * 0.98);
    var balance = await hodl.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(), 1e20 * 0.98);
    assert.equal((await web3.eth.getBalance(hodl.address)), 2e18);
    assert.equal((await hodl.value(balance)).toNumber(), web3.toBigNumber(2e18).div(totalSupply).mul(balance));
    assert.equal((await hodl.value(await hodl.totalSupply())).toNumber(), (await web3.eth.getBalance(hodl.address)).toNumber());
  });

  it('should return tokens', async function() {
    var startBalance = web3.eth.getBalance(accounts[0]);
    await hodl.withdraw(await hodl.balanceOf(accounts[0]), {from: accounts[0], gasPrice: 0});
    var firstBalance = (await web3.eth.getBalance(accounts[0])).sub(startBalance);
    assert.isAtLeast(firstBalance.toNumber(), 1e18);
    assert.equal((await hodl.balanceOf(accounts[0])).toNumber(), 0);

    startBalance = web3.eth.getBalance(accounts[1]);
    await hodl.withdraw(await hodl.balanceOf(accounts[1]), {from: accounts[1], gasPrice: 0});
    var secondBalance = (await web3.eth.getBalance(accounts[1])).sub(startBalance);
    assert.isAtLeast(secondBalance.toNumber(), 9.8e17);
    assert.equal((await hodl.balanceOf(accounts[1])).toNumber(), 0);

    assert.equal(firstBalance.plus(secondBalance).toNumber(), 2e18);
    assert.equal((await web3.eth.getBalance(hodl.address)).toNumber(), 0);
    assert.equal((await hodl.totalSupply()).toNumber(), 0);
  });
});
