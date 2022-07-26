
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


// const PRICE="1000000000000000000"; // 1 ETH
// const PRICE="750000000000000000"; // 0.75 ETH
// const PRICE="850000000000000000"; // 0.85 ETH
const PRICE="850000000000000";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);
  
  const priceBefore = (await vartContract.price()).toString();
  console.log("price before: ", priceBefore);
  console.log("price in ETH: ", ethers.utils.formatEther(priceBefore));
  if (priceBefore !== PRICE) {
    console.log("new price in ETH: ", ethers.utils.formatEther(PRICE));
    const tx = await vartContract.setPrice(PRICE);
    await tx.wait();
  } else { console.log("no change")}
  const price = (await vartContract.price()).toString();
  console.log("price after: ", price);
  console.log("price in ETH: ", ethers.utils.formatEther(price));
}

main();