
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

const ADDRESS="0xf0140627F3bF4ab29AEeCE027194b9f82972265b";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);
  
  const isOnWhitelist = await vartContract.isMemberOnWhitelist(ADDRESS);
  console.log("isOnWhitelist: ", isOnWhitelist);

  if (isOnWhitelist) {
    console.log("remove address from whitelist: ", ADDRESS)
    const tx = await vartContract.removeMemberFromWhitelist(ADDRESS);
    await tx.wait();
  } else { console.log("no change")}
  
  const isStillOnWhitelist = await vartContract.isMemberOnWhitelist(ADDRESS);
  console.log("isMemberOnWhitelist after: ", isStillOnWhitelist);
}

main();