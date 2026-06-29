// escrow.js
import { ethers } from "ethers";

let escrowContract;

/**
 * Initialize escrow with connected wallet
 * @param {ethers.Wallet | ethers.Signer} wallet
 */
export const initEscrow = (wallet) => {
  const escrowAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // replace with your deployed escrow address
  const escrowAbi = [
    "function createOrder(uint orderId, address farmer)",
    "function deposit(uint orderId) payable",
    "function confirmReceipt(uint orderId)",
    "function getOrderBalance(uint orderId) view returns (uint)"
  ];

  escrowContract = new ethers.Contract(escrowAddress, escrowAbi, wallet);
  console.log("Escrow contract initialized at:", escrowAddress);
};
export const createOrder = async (orderId, farmerAddress) => {
  if (!escrowContract) throw new Error("Escrow not initialized. Call initEscrow(wallet) first.");

  const tx = await escrowContract.createOrder(orderId, farmerAddress);
  await tx.wait();
  console.log(`Order ${orderId} created for farmer ${farmerAddress}`);
};

export const depositToOrder = async (orderId, amountEth) => {
  if (!escrowContract) throw new Error("Escrow not initialized. Call initEscrow(wallet) first.");

  const tx = await escrowContract.deposit(orderId, { value: ethers.parseEther(amountEth) });
  await tx.wait();
  console.log(`Deposited ${amountEth} ETH to order ${orderId}`);
};

export const confirmProductReceived = async (orderId) => {
  if (!escrowContract) throw new Error("Escrow not initialized. Call initEscrow(wallet) first.");

  const tx = await escrowContract.confirmReceipt(orderId);
  await tx.wait();
  console.log(`Funds released to farmer for order ${orderId}`);
};

export const getOrderBalance = async (orderId) => {
  if (!escrowContract) throw new Error("Escrow not initialized. Call initEscrow(wallet) first.");

  const balance = await escrowContract.getOrderBalance(orderId);
  return ethers.formatEther(balance);
};