const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const FIXED_PRICE = 1000000000000000000; // 1 ETH
const TEST_PRICE_IN_WEI = 10000000000; //
const TOTAL_INVENTORY = 1000;
const FREE_QUOTA = 75;
const LOCK_FREE_QUOTA = false;
const LOCK_TOTAL_INVENTORY = true;
const RESERVE_FREE_QUOTA = true;
const testConfigWithLowerLimits = {
  totalInventory: 10,
  maxPerAddress: 0,
  maxPerTx: 0,
  freeQuota: 5,
  lockFreeQuota: false,
  reserveFreeQuota: true,
  lockTotalInventory: true
};

// const FIXED_PRICE = 100000000000000; // 0.0001 ETH while testing only
describe("VikingArtCollective", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployCollectiveContract() {
    const NAME = "Voyager";
    const SYMBOL = "VOYAGE";
    const BENEFICIARY = "0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3";
    const ROYALTY_RECEIVER ="0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3";

    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const VikingArtCollective = await ethers.getContractFactory("VikingArtCollective");
    const contract = await VikingArtCollective.deploy(
        NAME,
        SYMBOL,
        BENEFICIARY,
        ROYALTY_RECEIVER
    );

    return { owner, contract, NAME, SYMBOL, BENEFICIARY, ROYALTY_RECEIVER };
  }

  describe("Deployment", function () {
    it("Should set the name", async function () {
      const { contract, NAME } = await loadFixture(deployCollectiveContract);

      expect(await contract.name()).to.equal(NAME);
    });

    it("Should set the symbol", async function () {
      const { contract, SYMBOL } = await loadFixture(deployCollectiveContract);

      expect(await contract.symbol()).to.equal(SYMBOL);
    });

    it("Should set the beneficiary", async function () {
      const { contract, BENEFICIARY } = await loadFixture(deployCollectiveContract);

      expect(await contract.beneficiary()).to.equal(BENEFICIARY);
    });

    // it("Should set the royalty info", async function () {
    //   const { contract, ROYALTY_RECEIVER } = await loadFixture(deployCollectiveContract);

    //   expect(await contract.royaltyInfo(0,100)).to.equal(ROYALTY_RECEIVER);
    // });


    it("Should set public minting to false", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.publicMinting()).to.equal(false);
    });

    // TODO: is there a way to test this after deploy?
    it("Should have an empty Whitelist map", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.Whitelist).to.equal(undefined);
    });

    it("Should support the ERC2981 interface", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.supportsInterface('0x2a55205a')).to.equal(true);
    });

    it("Should support the ERC1165 interface", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.supportsInterface('0x01ffc9a7')).to.equal(true);
    });

    it("Should support the ERC721 interface", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.supportsInterface('0x80ac58cd')).to.equal(true);
    });

    it("Should support the IERC721Metadata interface", async function () {
      const { contract } = await loadFixture(deployCollectiveContract);

      expect(await contract.supportsInterface('0x5b5e139f')).to.equal(true);
    });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployCollectiveContract
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  describe("Seller", function () {

    describe("Validations", function () {
      
      // TODO handle overflow for price
      // it("Should set the fixed price on deploy", async function () {
      //   const { contract } = await loadFixture(deployCollectiveContract);
      //   const price = await contract.price();
      //   console.log(price)
      //   await expect(price.eq(FIXED_PRICE)).to.be.equal(true);
      // });

      // TODO handle overflow for price when calculating cost
      // it("Should calculate cost using fixed price", async function () {
      //   const { contract } = await loadFixture(deployCollectiveContract);
      //   const quantity = 3;
      //   const cost = await contract.cost(quantity, 0)
      //   await expect(cost.toNumber()).to.be.equal(FIXED_PRICE * quantity);
      // });

      it("Should have a total supply of 0 on deploy", async function () {
        const { contract } = await loadFixture(deployCollectiveContract);
        const totalSupply = await contract.totalSupply();
        await expect(totalSupply.toNumber()).to.be.equal(0);
      });

      it("Should be able to set price as a owner", async function () {
        const { contract } = await loadFixture(deployCollectiveContract);
        const NEW_PRICE = 990000000000000;
        await contract.setPrice(NEW_PRICE);
        const price = await contract.price();
        await expect(price.eq(NEW_PRICE)).to.be.equal(true);
      });

      it("Should be able to update the beneficiary of sales proceeds", async function () {
        const { contract } = await loadFixture(deployCollectiveContract);
        const newBeneficiaryAddress = '0x1260443F80a91eA400B055D8825D6a99ee8b81A2';
        const originalBeneficiary = await contract.beneficiary();
        await contract.setBeneficiary(newBeneficiaryAddress);
        const newBeneficiary = await contract.beneficiary();
        await expect(newBeneficiary).to.be.equal(newBeneficiaryAddress);
        await expect(newBeneficiary).to.not.be.equal(originalBeneficiary);
      });
      
      it("Should be able to read seller config", async function () {
        const { contract } = await loadFixture(deployCollectiveContract);
        const config = await contract.sellerConfig();
        await expect(config.totalInventory.toNumber()).to.be.equal(TOTAL_INVENTORY);
        await expect(config.maxPerAddress.toNumber()).to.be.equal(0);
        await expect(config.maxPerTx.toNumber()).to.be.equal(0);
        await expect(config.freeQuota.toNumber()).to.be.equal(FREE_QUOTA);
        await expect(config.reserveFreeQuota).to.be.equal(true);
        await expect(config.lockFreeQuota).to.be.equal(false);
        await expect(config.lockTotalInventory).to.be.equal(false); // for testing
      });

    });

    describe("Free purchase", function () {

      it("Should be able to purchase free of charge as the owner", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        const AMOUNT = 2;

        await expect(
          contract.purchaseFreeOfCharge(owner.address, AMOUNT)
        ).to.changeTokenBalance(
          contract,
          owner,
          AMOUNT
        )
      });

      it("Should not be able to more free of charge than free quota", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setSellerConfig(testConfigWithLowerLimits)

        const MINT_AMOUNT = 7;

        await expect(
          contract.purchaseFreeOfCharge(owner.address, MINT_AMOUNT)
        ).to.changeTokenBalance(
          contract,
          owner,
          5
        )
      });

      it("Should update totalSupply data after free of charge mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        const AMOUNT = 2;

        await contract.purchaseFreeOfCharge(owner.address, AMOUNT)
        const supply = await contract.totalSupply();
        await expect(supply.toNumber()).to.equal(AMOUNT)
      });

      it("Should update totalSold data after free of charge mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        const AMOUNT = 2;

        await contract.purchaseFreeOfCharge(owner.address, AMOUNT)
        const sold = await contract.totalSold();
        await expect(sold.toNumber()).to.equal(AMOUNT)
      });
    });

    describe("Public mint - no whitelist needed", function () {

      it("Should not be able to mint if public mint is not active", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        // const AMOUNT = 1;
        await expect(
          contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.be.revertedWith(
          "Public minting closed"
        );

      });

      it("Should not be able to mint if paying less than price", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);
        const AMOUNT = 1;
        const paymentAmount = TEST_PRICE_IN_WEI - 1;
        await expect(
          contract.mintPublic(owner.address, { value: paymentAmount })
        ).to.revertedWith(
          "Seller: Costs 10 GWei"
        )
      });

      it("Should be able mint if public mint is enable and correct payment amount is submitted", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);

        await expect(
          contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.changeTokenBalance(
          contract,
          owner,
          1
        )
      });

      it("Should get royalto info for minted tokens", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })
        const [,feePercentage] = await contract.royaltyInfo(0, "10000000000000")
        await expect(feePercentage.toNumber()).to.be.equal(750000000000)
      });

      it("Should update totalSupply data after public mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })

        const supply = await contract.totalSupply();
        await expect(supply.toNumber()).to.equal(1)
      });

      it("Should update totalSold data after public mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })

        const sold = await contract.totalSold();
        await expect(sold.toNumber()).to.equal(1)
      });


      it("Should not be able to mint more than max supply", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        
        const AMOUNT = 11;
        
        await contract.setSellerConfig(testConfigWithLowerLimits)
        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setPublicMinting(true);
        // const config = await contract.sellerConfig()
        // console.log(config)
        let count = 0
        const  mintAll = async () => {
          while (count < AMOUNT) {
            await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI })
            count++
          }
        }
        await expect(mintAll()).to.revertedWith("Seller: Sold out")
      });
    });

    describe("Whitelist needed - public mint disabled", function () {

      it("Should not be able to mint if whitelist minting is disabled", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        
        await expect(
          contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.be.revertedWith(
          "Whitelist minting is not enabled"
        );

      });

      it("Should not be able to mint if whitelist minting is enabled but the address is not on the white list", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);

        await expect(
          contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.be.revertedWith(
          "Address is not on the whitelist"
        );

      });

      it("Should be able to add a single address to the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.addMemberToWhitelist(owner.address);

        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(    true);

      });

      it("Should be able to remove a single address to the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        await contract.addMemberToWhitelist(owner.address);

        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(true);
        
        await contract.removeMemberFromWhitelist(owner.address);

        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(false);

      });

      it("Should be able to batch load addresses to the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        const addresses = [
          "0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3",
          "0x1260443F80a91eA400B055D8825D6a99ee8b81A2"
        ];

        await contract.batchAddMembersToWhitelist(addresses);

        await expect(await contract.isMemberOnWhitelist(addresses[0])).to.be.equal(true);
        await expect(await contract.isMemberOnWhitelist(addresses[1])).to.be.equal(true);

      });


      it("Should be able to batch remove addresses to the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        const addresses = [
          "0xD149b3b88b4Ca9cb9a174a95f2EE492a80AC0EC3",
          "0x1260443F80a91eA400B055D8825D6a99ee8b81A2"
        ];

        await contract.batchAddMembersToWhitelist(addresses);

        await expect(await contract.isMemberOnWhitelist(addresses[0])).to.be.equal(true);
        await expect(await contract.isMemberOnWhitelist(addresses[1])).to.be.equal(true);

        await contract.batchRemoveMembersFromWhitelist(addresses);

        await expect(await contract.isMemberOnWhitelist(addresses[0])).to.be.equal(false);
        await expect(await contract.isMemberOnWhitelist(addresses[1])).to.be.equal(false);

      });

      it("Should be able mint if whitelist mint is enabled and the address is in the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);

        await contract.addMemberToWhitelist(owner.address);
        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(true);
        
        await expect(
          contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.changeTokenBalance(
          contract,
          owner,
          1
        )
      });

      it("Should not be able to mint twice when on the whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);

        await contract.addMemberToWhitelist(owner.address);
        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(true);
        await contract.mint(owner.address, { value: TEST_PRICE_IN_WEI });
        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(false);
        await expect(
          contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })
        ).to.revertedWith(
          "Address is not on the whitelist"
        )
      });

      it("Should get whitelist info about a specific address for all stages of whitelist flow", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );
        
        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);

        const infoBefore = await contract.getWhitelistInfo(owner.address)
        await expect(infoBefore.onList).to.be.equal(false);
        await expect(infoBefore.alreadyMinted).to.be.equal(false);
        
        // add address to whitelist
        await contract.addMemberToWhitelist(owner.address);
        await expect(await contract.hasAlreadyMinted(owner.address)).to.be.equal(false);

        const infoAfterAdded = await contract.getWhitelistInfo(owner.address)
        await expect(infoAfterAdded.onList).to.be.equal(true);
        await expect(infoAfterAdded.alreadyMinted).to.be.equal(false);

        // mint
        await contract.mint(owner.address, { value: TEST_PRICE_IN_WEI });
        const infoAfterMint = await contract.getWhitelistInfo(owner.address)
        await expect(infoAfterMint.onList).to.be.equal(false);
        await expect(infoAfterMint.alreadyMinted).to.be.equal(true);

        await expect(await contract.hasAlreadyMinted(owner.address)).to.be.equal(true);
        await expect(await contract.isMemberOnWhitelist(owner.address)).to.be.equal(false);
      });


      it("Should update totalSupply data after whitelist mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);
        await contract.addMemberToWhitelist(owner.address);
        await contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })

        const supply = await contract.totalSupply();
        await expect(supply.toNumber()).to.equal(1)
      });

      it("Should update totalSold data after public mint", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);
        await contract.addMemberToWhitelist(owner.address);
        await contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })

        const sold = await contract.totalSold();
        await expect(sold.toNumber()).to.equal(1)
      });


      it("Should be able to mint additional tokens in public mint when previously minted on whitelist", async function () {
        const { contract, owner } = await loadFixture(
          deployCollectiveContract
        );

        await contract.setPrice(TEST_PRICE_IN_WEI);
        await contract.setWhitelistMinting(true);
        await contract.addMemberToWhitelist(owner.address);
        await contract.mint(owner.address, { value: TEST_PRICE_IN_WEI })

        await contract.setPublicMinting(true);
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI });
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI });
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI });
        await contract.mintPublic(owner.address, { value: TEST_PRICE_IN_WEI });
        const sold = await contract.totalSold();
        await expect(sold.toNumber()).to.equal(5)
      });
    });
  });
});
