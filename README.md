# Viking Art Collective - Membership NFT

This repository contains the open source code used for the ERC721A smart contract used for 
minting the Viking Art Collective membership NFT (https://vikingart.com)

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run scripts/run.js
```

## Contract specs

### Modes of minting

There are two different flags to disable minting or enable two different types of minting.
* `publicMinting` - This enables minting for anyone without restrictions
* `whitelistMinting`- This enables minting for anyone that is added to the Whitelist. They can mint one token per address when added to the whitelist. It is possible for the same address to be re-added after they have minted to support the case if the mint would fail or if there is a need for one wallet to mint more than once token when on the whitelist.

If none of `publicMinting` or `whitelistMinting` is enabled the minting is disabled for anyone except the contract owner.

### Whitelist management

There are methods to add and remove address from the whitelist and a few methods to check the whitelist and minting status.

* To add addresses to the whitelist there are `batchAddMembersToWhitelist(addesses[])` to add multiple address at once and the `addMemberToWhitelist(address)` to add a single address.
* To remove addresses to the whitelist there are `batchRemoveMembersFromWhitelist(addesses[])` to remove multiple address at once and the `removeMemberFromWhitelist(address)` to remove a single address.
* To check if an address is on the whitelist the `isMemberOnWhitelist(address)` can be used. Note that once the address has minted using this address the address is removed from the whitelist. To check if an address has already minted the method is `hasAlreadyMinted(address)`. There is a convenience mthod that return both those results in one call, the `getWhitelistInfo(address)` that will return whether or not the address did mint as well as if the address is on the whitelist. The paylaod for the result is:
  ```
  bool onList
  bool alreadyMinted
  ```

### Minting
There are three methods in total to mint tokens, all of these can only mint once token at a time. There is not method to batch mint in this contract.
* `publicMinting(to)` - Enabled for anyone that signs and pay the price of the token
* `whitelistMinting(to)`- Enabled for anyone that is on the whitelist and signs and pay the price of the token.
* `purchaseFreeOfCharge(to)` - Enabled only for the contract owner up to a quota that is configured in the contract.

### Flow for the deployment and whitelist management

1. Deploy the contract and do the necessary configuration for beneficary, royalty receivers on the contract and Opensea.
1. If tokens are assigned to the team, or for company treasury for giveaways and rewards, they can be minted with `purchaseFreeOfCharge` by the owner. There is a max assignment for free mints that is set and, optionally fixed, when the contract is deployed (see the SellerConfig options).
1. Upload the whitelist addresses to the contract by using the `batchAddMembersToWhitelist` method.
1. When the whitelist minting should start use the method `setWhitelistMinting(true)` to enable whitelist minting. When this mode is enabled use the `mint()`method to mint the tokens.
1. When it is time to enable public minting, set method `setPublicMinting(true)` while the whitelist minting is still enabled. Once the publicMinting is enabled the front-end should detect the mode and switch to use the `publicMint()` method instead of the `mint()` method. 
1. Once the switch to public minting is confirmed the whitelist minting can be turned off with `setWhitelistMinting(false)`
1. Once all tokens are sold out the mint public minting can be disabled with `setPublicMinting(false)`
1. 
