const { ethers } = require("hardhat");

async function main() {
  const [consumer, farmer] = await ethers.getSigners();

  console.log("Consumer:", consumer.address);
  console.log("Farmer:", farmer.address);

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log("Escrow deployed at:", escrowAddress);

  // 1️⃣ Create Order
  await escrow.connect(consumer).createOrder(1, farmer.address);
  console.log("Order created");

  // 2️⃣ Deposit ETH
  await escrow.connect(consumer).deposit(1, {
    value: ethers.parseEther("0.5"),
  });
  console.log("Deposited 0.5 ETH");

  // 3️⃣ Check Balance
  const balance = await escrow.getOrderBalance(1);
  console.log("Escrow Balance:", ethers.formatEther(balance), "ETH");

  // 4️⃣ Confirm Receipt
  await escrow.connect(consumer).confirmReceipt(1);
  console.log("Funds released to farmer");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});