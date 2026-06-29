import Web3 from "web3";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const contractJSON = require("../../blockchain/build/contracts/SupplyChain.json");

const web3 = new Web3("http://127.0.0.1:8545"); // Ganache RPC

const networkId = Object.keys(contractJSON.networks)[0]; // gets deployed network id
const contractAddress = contractJSON.networks[networkId].address;

const supplyChainContract = new web3.eth.Contract(contractJSON.abi, contractAddress);

export default supplyChainContract;
