
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

const ADDRESSES = require('../allowlist-addresses/to-add.json');

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);
  
  console.log("Reading allow list status for addresses before removing")
  for (const address of ADDRESSES) {
    const isOnWhitelist = await vartContract.isMemberOnWhitelist(address);
    console.log(`${address}: ${isOnWhitelist}`);
    if(!isOnWhitelist) {
      console.log("Address is not on the whitelist")
      process.exit(1);
    }
  }
    
  console.log("remove addresses from whitelist: ", ADDRESSES.length)
  const tx = await vartContract.batchRemoveMembersFromWhitelist(ADDRESSES);
  await tx.wait();
  
  console.log("Reading allow list status for addresses")
  for (const address of ADDRESSES) {
    const isOnWhitelist = await vartContract.isMemberOnWhitelist(address);
    console.log(`${address}: ${isOnWhitelist}`);
  }
}

main();