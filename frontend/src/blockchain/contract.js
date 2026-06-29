import { ethers } from "ethers";
import abi from "./SupplyChainABI.json";

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    abi,
    signer
  );
};
