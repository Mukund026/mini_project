const SupplyChainV2 = artifacts.require("SupplyChainV2");

module.exports = function (deployer) {
  deployer.deploy(SupplyChainV2);
};
