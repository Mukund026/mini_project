import { CONTRACT_ADDRESS } from "./constants";
import abi from "./abi/SupplyChainV2.json"; // artifact ABI

import { ethers } from "ethers";

export function getContractWithSigner(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signerOrProvider);
}
