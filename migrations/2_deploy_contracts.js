var hodlcoin = artifacts.require("HODLCoin");

module.exports = function(deployer, network) {
  return deployer.deploy(hodlcoin);
};
