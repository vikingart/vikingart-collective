
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

// const NEW_BENEFICIARY_ADDRESS="0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3";
const NEW_BENEFICIARY_ADDRESS="0x08920FA81EFEE661cE39A57FF6C584Ca49f9B806";

async function main() {
  console.log("Contract",  CONTRACT_ADDRESS);

  const currentOwner = await vartContract.beneficiary();
  console.log("current beneficiary: ", currentOwner);
  if (currentOwner !== NEW_BENEFICIARY_ADDRESS) {
    console.log("new beneficiary: ", NEW_BENEFICIARY_ADDRESS)
    const tx = await vartContract.setBeneficiary(NEW_BENEFICIARY_ADDRESS);
    await tx.wait();
  } else { console.log("no beneficiary change")}
  const owner = await vartContract.beneficiary();
  console.log("beneficiary after update: ", owner);
}
main();