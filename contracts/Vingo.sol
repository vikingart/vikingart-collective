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
    _purchase(msg.sender, newItemId);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }

    /// @notice Entry point for purchase of a single token.
    function buy() external payable {
        _purchase(msg.sender, 1);
    }

    /**
    @notice Internal override of Seller function for handling purchase (i.e. minting).
     */
    function _handlePurchase(
        address to,
        uint256 num,
        bool
    ) internal override {
        _safeMint(to, num);
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
