
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

const DESTINATION_WALLET="0xC32DA524AFB22d3039c720CadFFF82a30E6C3460";
const AMOUNT=1;

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);

  console.log(`Minting ${AMOUNT} token to ${DESTINATION_WALLET} free of charge`);
  let txn1 = await vartContract.purchaseFreeOfCharge(DESTINATION_WALLET, AMOUNT);
  await txn1.wait()
  console.log("Done");

}
main();