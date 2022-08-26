
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

const NEW_OWNER_ADDRESS="0x502D74D9c1d273248Cd47AA777af83a079E8865A";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);

  const currentOwner = await vartContract.owner();
  console.log("currentOwner: ", currentOwner);
  if (currentOwner !== NEW_OWNER_ADDRESS) {
    console.log("new owner: ", NEW_OWNER_ADDRESS)
    const tx = await vartContract.transferOwnership(NEW_OWNER_ADDRESS);
    await tx.wait();
  } else { console.log("no owner change")}
  const owner = await vartContract.owner();
  console.log("owner after: ", owner);
}
main();