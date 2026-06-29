import { ethers } from "ethers";
import contractABI from "./contractABI.json" assert { type: "json" };
import { wallets } from "./wallets.js";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT;
console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

export const connectWallet = async (userType, walletAddress) => {
  console.log("connectWallet called with userType:", userType, "walletAddress:", walletAddress);

  // If walletAddress is not provided, use local wallet for userType
  if (!walletAddress) {
    console.log("No walletAddress provided, using local wallet for userType:", userType);
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(wallets[userType].privateKey, provider);
    return wallet;
  }

  // Check if walletAddress matches any local wallet
  const localWallet = Object.values(wallets).find(wallet => wallet.address.toLowerCase() === walletAddress?.toLowerCase());
  if (localWallet) {
    console.log("Using local wallet for address:", walletAddress);
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(localWallet.privateKey, provider);
    return wallet;
  }

  if (!window.ethereum || !window.ethereum.request) {
    console.log("MetaMask not installed or not functional, using local provider");
    // Use local provider with private key
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(wallets[userType].privateKey, provider);
    return wallet;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Check current chain
    const chainId = await provider.send("eth_chainId", []);
    console.log("Current chainId:", chainId);

    // If not on Hardhat local network (31337), switch or add it
    if (chainId !== "0x7a69") {
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0x7a69" }]);
        console.log("Switched to Hardhat network");
      } catch (error) {
        // Check for 4902 error code (network not added) in various places
        const errorCode = error.error?.code || error.data?.code || error.code;
        const isUnrecognizedChain = error.message && error.message.includes("Unrecognized chain ID");
        const isRequestPending = error.message && error.message.includes("already pending");
        if (errorCode === 4902 || isUnrecognizedChain) {
          // Network not added, add it
          try {
            await provider.send("wallet_addEthereumChain", [{
              chainId: "0x7a69",
              chainName: "Hardhat",
              rpcUrls: ["http://127.0.0.1:8545"],
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
            }]);
            console.log("Added Hardhat network");
          } catch (addError) {
            const addErrorCode = addError.error?.code || addError.data?.code || addError.code;
            const isAddRequestPending = addError.message && addError.message.includes("already pending");
            if (addErrorCode === -32002 || isAddRequestPending) {
              console.log("Network add request already pending, continuing without waiting...");
              // Don't wait, just continue - user can approve later
            } else {
              throw addError;
            }
          }
        } else if (errorCode === -32002 || isRequestPending) {
          // Request already pending, wait for user approval
          console.log("Network switch request pending, waiting for user approval...");
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait longer for user approval
          const newChainId = await provider.send("eth_chainId", []);
          if (newChainId !== "0x7a69") {
            throw new Error("User did not approve network switch. Please switch to Hardhat network in MetaMask.");
          }
        } else {
          throw error;
        }
      }
    }

    console.log("Requesting permissions...");
    await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
    console.log("Permissions requested");

    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    // Fallback to local provider
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");




    const sender = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

    // Replace with the wallet you imported (which has 0 ETH)
    const receiver = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

    async function fundWallet() {
      const tx = await sender.sendTransaction({
        to: receiver,
        value: ethers.parseEther("10") // send 10 ETH
      });
      console.log("Transaction hash:", tx.hash);
    }

    fundWallet();




    const wallet = new ethers.Wallet(wallets[userType].privateKey, provider);
    return wallet;
  }
};

export const getContract = async () => {
  const walletAddress = localStorage.getItem("walletAddress");
  const userType = localStorage.getItem("userType");

  if (!userType) {
    throw new Error("userType not found in localStorage");
  }

  const signer = await connectWallet(userType, walletAddress);
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

export const loadBlockchain = async () => {
  const walletAddress = localStorage.getItem("walletAddress");
  const userType = localStorage.getItem("userType");

  if (!userType) {
    throw new Error("userType not found in localStorage");
  }

  await connectWallet(userType, walletAddress);
};
