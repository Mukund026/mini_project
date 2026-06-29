import hre from "hardhat";

async function main() {
  // Deploy SupplyChain
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy({
    gasLimit: 15000000,
  });
  await supplyChain.waitForDeployment();
  console.log("SupplyChain deployed to:", supplyChain.target);

  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy({
    gasLimit: 15000000,
  });
  await escrow.waitForDeployment();
  console.log("Escrow deployed to:", escrow.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});