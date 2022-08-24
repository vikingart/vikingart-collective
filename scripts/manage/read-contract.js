
require("dotenv").config({ path: ".env" });

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.RINKEBY_CONTRACT_ADDRESS;
const NETWORK='rinkeby';

console.log(API_KEY)
console.log(CONTRACT_ADDRESS)
const { ethers } = require("hardhat");
const contractSpec = require("../../artifacts/contracts/VikingArtCollective.sol/VikingArtCollective.json");

// console.log(JSON.stringify(contractSpec.abi));

const provider = new ethers.providers.AlchemyProvider(NETWORK, API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const vartContract = new ethers.Contract(CONTRACT_ADDRESS, contractSpec.abi, signer);

async function main() {
  const name = await vartContract.name();
  console.log("name: ", name);

  const symbol = await vartContract.symbol();
  console.log("symbol: ", symbol);

  const beneficiary = await vartContract.beneficiary();
  console.log("beneficiary: ", beneficiary);

  const royaltyInfo = await vartContract.royaltyInfo(0,100000000000000);
  console.log("royaltyInfo: ", royaltyInfo);

  const baseTokenURI = await vartContract.baseTokenURI();
  console.log("baseTokenURI: ", baseTokenURI);

  const price = (await vartContract.price()).toString();
  console.log("price: ", price);
  console.log("price in ETH: ", ethers.utils.formatEther(price));

  const paused = await vartContract.paused();
  console.log("paused: ", paused);

  const publicMinting = await vartContract.publicMinting();
  console.log("publicMinting: ", publicMinting);
  
  const whitelistMinting = await vartContract.whitelistMinting();
  console.log("whitelistMinting: ", whitelistMinting);

  const sellerConfig = await vartContract.sellerConfig();
  // console.log("sellerConfig: ", sellerConfig);
  console.log("sellerConfig")
  console.log("  totalInventory: ", sellerConfig.totalInventory.toString())
  console.log("  maxPerAddress: ", sellerConfig.maxPerAddress.toString())
  console.log("  maxPerTx: ", sellerConfig.maxPerTx.toString())
  console.log("  freeQuota: ", sellerConfig.freeQuota.toString())
  console.log("  reserveFreeQuota: ", sellerConfig.reserveFreeQuota)
  console.log("  lockFreeQuota: ", sellerConfig.lockFreeQuota)
  console.log("  lockTotalInventory: ", sellerConfig.lockTotalInventory)

  const tokenURI = await vartContract.tokenURI(0); // only works if first token is minted
  console.log("tokenURI: ", tokenURI);
  
  const totalSold = await vartContract.totalSold();
  console.log("totalSold: ", totalSold.toString());

  const totalSupply = await vartContract.totalSupply();
  console.log("totalSupply: ", totalSupply.toString());

  // const supportsInterface = await vartContract.supportsInterface(id);
  // console.log("supportsInterface: ", supportsInterface);

  // const getWhitelistInfo = await vartContract.getWhitelistInfo(address);
  // console.log("getWhitelistInfo: ", getWhitelistInfo);

  
  // console.log("Updating the message...");
  // const tx = await vartContract.update("Hola y bienvenido");
  // await tx.wait();

  // const newMessage = await vartContract.message();
  // console.log("The new message is: ", newMessage);
}
main();