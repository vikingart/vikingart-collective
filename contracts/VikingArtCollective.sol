// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.9;

import "@divergencetech/ethier/contracts/erc721/ERC721ACommon.sol";
import "@divergencetech/ethier/contracts/erc721/BaseTokenURI.sol";
import "@divergencetech/ethier/contracts/sales/FixedPriceSeller.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Viking Art Collective NFT
/// @author @odentorp
contract VikingArtCollective is ERC721ACommon, BaseTokenURI, ERC2981, FixedPriceSeller {
    using Strings for uint256;

    mapping(address => bool) Whitelist;
    /**
    @notice Flag indicating that public minting is open.
     */
    bool public publicMinting;


    event AddedMemberToWhitelist(address indexed member);
    event RemovedMemberFromWhitelist(address indexed member);

    constructor(
        string memory name,
        string memory symbol,
        address payable beneficiary,
        address payable royaltyReceiver
    )
    ERC721ACommon(name, symbol)
    BaseTokenURI("")
    FixedPriceSeller(
        0.0001 ether,
        Seller.SellerConfig({
            totalInventory: 100,
            maxPerAddress: 0,
            maxPerTx: 0,
            freeQuota: 10,
            lockFreeQuota: false,
            reserveFreeQuota: true,
            lockTotalInventory: true
        }),
        beneficiary
    )
    {
        _setDefaultRoyalty(royaltyReceiver, 750);
    }

    /**
    @notice Internal override of Seller function for handling purchase (i.e. minting).
     */
    function _handlePurchase(
        address to,
        uint256 num,
        bool
    ) internal override {
        if (!publicMinting) {
            require(Whitelist[to], "Mint is not yet public and member is not on whitelist");
            delete Whitelist[to];
        }
        _safeMint(to, num);
    }

    /**
    @notice Mint as an address on one of the early-access lists.
     */
     // TODO: handle allow list minting
    // function mint(
    //     address to,
    //     uint256 price,
    //     bytes32 nonce,
    //     bytes calldata sig
    // ) external payable {
    //     signers.requireValidSignature(
    //         signaturePayload(to, price, nonce),
    //         sig,
    //         usedMessages
    //     );
    //     _purchase(to, 1, price);
    // }


    /**
    @notice Set the `publicMinting` flag.
     */
    function setPublicMinting(bool _publicMinting) external onlyOwner {
        publicMinting = _publicMinting;
    }

    /**
    @dev Public minting method only available when public minting is enabled
    */
    function mintPublic(
        address to
    ) external payable {
        require(publicMinting, "Public minting closed");
        _purchase(to, 1);
    }

    /**
    @dev Required override to select the correct baseTokenURI.
     */
    function _baseURI()
        internal
        view
        override(BaseTokenURI, ERC721A)
        returns (string memory)
    {
        return BaseTokenURI._baseURI();
    }

    /**
    @notice If renderingContract is set then returns its tokenURI(tokenId)
    return value, otherwise returns the standard baseTokenURI + tokenId.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
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

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721ACommon, ERC2981) returns (bool) {
        // Supports the following `interfaceId`s:
        // - IERC165: 0x01ffc9a7
        // - IERC721: 0x80ac58cd
        // - IERC721Metadata: 0x5b5e139f
        // - IERC2981: 0x2a55205a
        return
            ERC721A.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId);
    }

    function addMemberToWhitelist(address member) external onlyOwner {
        Whitelist[member] = true;
        emit AddedMemberToWhitelist(member);
    }

    function batchAddMembersToWhitelist(address[] memory members) external onlyOwner {
        for (uint256 i = 0; i < members.length; i++) {
            Whitelist[members[i]] = true;
            emit AddedMemberToWhitelist(members[i]);
        }
    }

    function removeMemberFromWhitelist(address member) external onlyOwner {
        Whitelist[member] = false;
        emit RemovedMemberFromWhitelist(member);
    }

    function batchRemoveMembersFromWhitelist(address[] memory members) external onlyOwner {
        for (uint256 i = 0; i < members.length; i++) {
            Whitelist[members[i]] = false;
            emit RemovedMemberFromWhitelist(members[i]);
        }
    }

    function isMemberOnWhitelist(address member) external view returns (bool) {
        return Whitelist[member];
    }
}
