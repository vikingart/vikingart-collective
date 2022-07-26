// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.9;

import "@divergencetech/ethier/contracts/erc721/ERC721ACommon.sol";
// import "@divergencetech/ethier/contracts/erc721/BaseTokenURI.sol";
import "@divergencetech/ethier/contracts/sales/FixedPriceSeller.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/// @title Collective NFT
/// @author @odentorp
contract Vingo is ERC721ACommon, ERC2981, FixedPriceSeller {
    using Strings for uint256;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(
        string memory name,
        string memory symbol,
        address payable beneficiary,
        address payable royaltyReceiver
    )
    ERC721ACommon(name, symbol)
    FixedPriceSeller(
        0.001 ether,
        // How to white list mints?
        Seller.SellerConfig({
            totalInventory: 3,
            lockTotalInventory: true,
            maxPerAddress: 0,
            maxPerTx: 0,
            freeQuota: 2,
            lockFreeQuota: true,
            reserveFreeQuota: true
        }),
        beneficiary
    )
    {
        _setDefaultRoyalty(royaltyReceiver, 750);
    }

    function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();
     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
    //_setTokenURI(newItemId, "blah");
    // _setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=");

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }

    /// @notice Entry point for purchase of a single token.
    function buy() external payable {
        Seller._purchase(msg.sender, 1);
    }

    /**
    @notice Internal override of Seller function for handling purchase (i.e. minting).
     */
    function _handlePurchase(
        address to,
        uint256 num,
        bool
    ) internal override {
        for (uint256 i = 0; i < num; i++) {
            _safeMint(to, totalSold() + i);
        }
    }

    /**
    @dev Required override to select the correct baseTokenURI.
     */
    // function _baseURI()
    //     internal
    //     view
    //     override(BaseTokenURI, ERC721A)
    //     returns (string memory)
    // {
    //     return BaseTokenURI._baseURI();
    // }

    /// @notice Prefix for tokenURI return values.
    string public baseTokenURI = "https://www.vikingart.com/images/vikingart-card.svg?token_id=";

    /// @notice Set the baseTokenURI.
    function setBaseTokenURI(string memory baseTokenURI_) external onlyOwner {
        baseTokenURI = baseTokenURI_;
    }

    // /// @notice Returns the token's metadata URI.
    function tokenURI(uint256 tokenId)
        public
        view
        override
        tokenExists(tokenId)
        returns (string memory)
    {
        return string(abi.encodePacked(baseTokenURI, tokenId.toString()));
    }

    /**
    @notice Sets the contract-wide royalty info.
     */
    function setRoyaltyInfo(address receiver, uint96 feeBasisPoints)
        external
        onlyOwner
    {
        _setDefaultRoyalty(receiver, feeBasisPoints);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721ACommon, ERC2981)
        returns (bool)
    {
        if(interfaceId == _INTERFACE_ID_ERC2981) {
          return true;
        }
        return super.supportsInterface(interfaceId);
    }
}
