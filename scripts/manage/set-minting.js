
require("dotenv").config({ path: ".env" });

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.RINKEBY_CONTRACT_ADDRESS;
const NETWORK='rinkeby';

console.log(API_KEY)
console.log(CONTRACT_ADDRESS)
const { ethers } = require("hardhat");
const contractSpec = require("../../artifacts/contracts/VikingArtCollective.sol/VikingArtCollective.json");

const provider = new ethers.providers.AlchemyProvider(NETWORK, API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const vartContract = new ethers.Contract(CONTRACT_ADDRESS, contractSpec.abi, signer);

const PUBLIC_MINTING=false;
const WHITELIST_MINTING=false;

async function main() {

  const publicMintingBefore = await vartContract.publicMinting();
  console.log("publicMinting before: ", publicMintingBefore);
  if (publicMintingBefore !== PUBLIC_MINTING) {
    console.log("new public setting: ", PUBLIC_MINTING)
    const tx1 = await vartContract.setPublicMinting(PUBLIC_MINTING);
    await tx1.wait();
  } else { console.log("no public minting change")}
  const publicMinting = await vartContract.publicMinting();
  console.log("publicMinting after: ", publicMinting);


  const whitelistMintingBefore = await vartContract.whitelistMinting();
  console.log("whitelistMinting before: ", whitelistMintingBefore);
  if (whitelistMintingBefore !== WHITELIST_MINTING) {
    console.log("new WL setting: ", WHITELIST_MINTING)
    const tx2 = await vartContract.setWhitelistMinting(WHITELIST_MINTING);
    await tx2.wait();
  } else { console.log("no WL minting change")}
  const whitelistMinting = await vartContract.whitelistMinting();
  console.log("whitelistMinting after: ", whitelistMinting);

}
main();