import { ethers } from "ethers";

export const createWalletProvider = (privateKey) => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  return provider;
};
