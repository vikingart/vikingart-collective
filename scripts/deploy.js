// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('VikingArtCollective');
  const nftContract = await nftContractFactory.deploy(
    "Viking Art Collective",
    "VIKINGART",
    "0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3",
    "0x1260443F80a91eA400B055D8825D6a99ee8b81A2"
  );
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
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