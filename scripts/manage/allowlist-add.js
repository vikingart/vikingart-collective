
require("dotenv").config({ path: ".env" });

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.RINKEBY_CONTRACT_ADDRESS;
const NETWORK = process.env.NETWORK;

const { ethers } = require("hardhat");
const contractSpec = require("../../artifacts/contracts/VikingArtCollective.sol/VikingArtCollective.json");

const provider = new ethers.providers.AlchemyProvider(NETWORK, API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const vartContract = new ethers.Contract(CONTRACT_ADDRESS, contractSpec.abi, signer);

const ADDRESS="0x4849c1DcF8674d19636Fba82D7C3cb8bFf377636";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);
  
  const isAlreadyOnWhitelist = await vartContract.isMemberOnWhitelist(ADDRESS);
  console.log("isAlreadyOnWhitelist: ", isAlreadyOnWhitelist);

  if (!isAlreadyOnWhitelist) {
    console.log("add address to whitelist: ", ADDRESS)
    const tx = await vartContract.addMemberToWhitelist(ADDRESS);
    await tx.wait();
  } else { console.log("no change")}
  
  const isOnWhitelist = await vartContract.isMemberOnWhitelist(ADDRESS);
  console.log("isMemberOnWhitelist after: ", isOnWhitelist);
}

main();