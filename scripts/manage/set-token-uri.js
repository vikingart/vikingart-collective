
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


// const BASE_URI="https://www.vikingart.com/collective/metadata.json?token_id=";
const BASE_URI="https://metadata.vikingart.com/collective/metadata.json?token_id=";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);

  const baseTokenURIBefore = await vartContract.baseTokenURI();
  console.log("baseTokenURI before: ", baseTokenURIBefore);
  if (baseTokenURIBefore !== BASE_URI) {
    console.log("new baseTokenURI: ", BASE_URI)
    const tx = await vartContract.setBaseTokenURI(BASE_URI);
    await tx.wait();
  } else { console.log("no change")}
  const baseTokenURI = await vartContract.baseTokenURI();
  console.log("baseTokenURI after: ", baseTokenURI);
}
main();