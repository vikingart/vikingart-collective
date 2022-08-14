// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('Voyager');
  const nftContract = await nftContractFactory.deploy(
    "Voyager",
    "VOYAGER",
    "0xC32DA524AFB22d3039c720CadFFF82a30E6C3460",
    "0xDE1020942352067e542035a97eac36e6D0DDEbb4"
  );
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const whiteList = [
    "0xC32DA524AFB22d3039c720CadFFF82a30E6C3460",
    "0xDE1020942352067e542035a97eac36e6D0DDEbb4",
    "0x45e00169Ef2C7297BD187A3A364b8eA809CF388a",
    "0xE34c0Ca35C2A8AAaA3cA3b7CEf6c650D0726877d",
    "0xC95060a1284Fb238259087a85473BB64601Aa417"
  ];
  
  await nftContract.setBaseTokenURI("https://www.vikingart.com/collective/metadata.json?token_id=");
  await nftContract.batchAddMembersToWhitelist(whiteList);
  let txn1 = await nftContract.purchaseFreeOfCharge("0xC32DA524AFB22d3039c720CadFFF82a30E6C3460", 7)
  await txn1.wait()
  
  // await nftContract.setPublicMinting(true);
  // let txn = await nftContract.mintPublic("0x1260443F80a91eA400B055D8825D6a99ee8b81A2", { value: ethers.utils.parseEther("0.0001") })
  // await txn.wait()
  // await nftContract.mintPublic("0x1260443F80a91eA400B055D8825D6a99ee8b81A2", { value: ethers.utils.parseEther("0.0001") })
  // await nftContract.mintPublic("0x1260443F80a91eA400B055D8825D6a99ee8b81A2", { value: ethers.utils.parseEther("0.0001") })
  // await nftContract.mintPublic("0x1260443F80a91eA400B055D8825D6a99ee8b81A2", { value: ethers.utils.parseEther("0.0001") })
  // let txn = await nftContract.mintPublic()
  // let txn = await nftContract.buy("0x1260443F80a91eA400B055D8825D6a99ee8b81A2")
  // Wait for it to be mined.

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();