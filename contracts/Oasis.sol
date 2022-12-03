// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Oasis is ERC721URIStorage {
    uint256 listingPrice = 0.025 ether;

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    address payable smartContractOwner;

    using Counters for Counters.Counter;
    Counters.Counter private _mediaIds;
    Counters.Counter private _tokenIds;

    mapping(uint256 => MediaItem) private mediaIdToMediaItems;
    mapping(uint256 => NFTToken) private tokenIdToToken;

    // Mappings
    mapping(address => User[]) private creatorToFollowers;
    mapping(address => MediaItem[]) private creatorToMediaItems;
    mapping(address => uint256[]) private userOwnedTokens;
    mapping(uint256 => uint256[]) private mediaIdToTokenIds;
    mapping(uint256 => uint256) private tokenIdToMediaId;
    mapping(address => uint256) private creatorTokenSaleCount;
    mapping(address => uint256) private creatorTokenSaleValue;

    // Structs
    struct NFTToken {
        uint256 tokenId;
        uint256 price;
        uint256 royalty;
        address creator;
        address owner;
        address seller;
        bool isSold;
        string NFTCoverURI;
    }

    struct MediaItem {
        uint256 mediaId;
        uint256 tokenCount;
        uint256 availableCount;
        address payable creator;
        bool isGated;
        string title;
        string description;
        string mediaURI;
        string coverURI;
        string mediaType;
    }

    struct User {
        address accountAddress;
        string accountType;
    }

    constructor() ERC721("OasisTokens", "OASIS") {
        smartContractOwner = payable(msg.sender);
    }

    function createMediaItem(
        string memory _mediaType,
        string memory _mediaURI,
        string memory _mediaCoverURI,
        string memory _title,
        string memory _description,
        bool _isGated,
        string memory _NFTCoverURI,
        uint256 _tokenCount,
        uint256 _price,
        uint256 _royalty
    ) public payable {
        // new MediaItem object
        require(
            _isGated == true && _tokenCount > 0,
            "Gated media must have atleast one token"
        );

        _mediaIds.increment();

        uint256 id = _mediaIds.current();

        MediaItem memory item = MediaItem(
            id,
            _tokenCount,
            _tokenCount,
            payable(msg.sender),
            _isGated,
            _title,
            _description,
            _mediaURI,
            _mediaCoverURI,
            _mediaType
        );

        creatorToMediaItems[msg.sender].push(item);
        mediaIdToMediaItems[id] = item;

        if (_isGated) {
            createTokens(
                msg.sender,
                _tokenCount,
                _price,
                _royalty,
                id,
                _NFTCoverURI
            );
        }
    }

    function createTokens(
        address _creator,
        uint256 _tokenCount,
        uint256 _price,
        uint256 _royalty,
        uint256 _mediaId,
        string memory _tokenCoverURI
    ) private {
        for (uint256 i = 0; i < _tokenCount; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _mint(_creator, newTokenId);
            _setTokenURI(newTokenId, _tokenCoverURI);

            //create NFTTokenItem
            NFTToken memory token = NFTToken(
                newTokenId,
                _price,
                _royalty,
                payable(_creator),
                payable(address(this)),
                payable(_creator),
                false,
                _tokenCoverURI
            );

            //     struct NFTToken {
            //     uint256 tokenId;
            //     uint256 price;
            //     uint256 royalty;
            //     address creator;
            //     address owner;
            //     address seller;
            //     bool isSold;
            //     string NFTCoverURI;
            // }

            tokenIdToToken[newTokenId] = token;
            mediaIdToTokenIds[_mediaId].push(newTokenId);
            tokenIdToMediaId[newTokenId] = _mediaId;
            _transfer(msg.sender, address(this), newTokenId);
        }
    }

    // get all mediaItems
    function getAllMedia() public view returns (MediaItem[] memory) {
        uint itemCount = _mediaIds.current();
        uint currentIndex = 0;

        MediaItem[] memory items = new MediaItem[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            MediaItem memory currentItem = mediaIdToMediaItems[i + 1];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function NFTTokenSale(uint256 tokenId) public payable {
        NFTToken memory token = tokenIdToToken[tokenId];
        uint256 price = token.price;
        address seller = token.seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        _transfer(address(this), msg.sender, tokenId);
        payable(smartContractOwner).transfer(listingPrice);

        if (seller == token.creator) {
            payable(seller).transfer(msg.value);
            creatorTokenSaleCount[seller] += 1;
            creatorTokenSaleValue[seller] += token.price;
        } else {
            payable(seller).transfer((msg.value / 100) * (100 - token.royalty));
            payable(token.creator).transfer((msg.value / 100) * token.royalty);
            creatorTokenSaleValue[seller] += (msg.value / 100) * token.royalty;
        }
        token.isSold = true;
        token.owner = payable(msg.sender);
        token.seller = payable(address(0));
        userOwnedTokens[token.owner].push(tokenId);
    }

    function getAllOwnedNFTs(
        address userAddress
    ) public view returns (NFTToken[] memory) {
        uint256[] memory tokenIds = userOwnedTokens[userAddress];
        uint currentIndex = 0;
        NFTToken[] memory tokens = new NFTToken[](tokenIds.length);
        for (uint i = 0; i < tokenIds.length; i++) {
            NFTToken memory currentToken = tokenIdToToken[tokenIds[i]];
            tokens[currentIndex] = currentToken;
            currentIndex += 1;
        }
        return tokens;
    }

    // getter functions
    function getMediaItem(
        uint256 mediaId
    ) public view returns (MediaItem memory) {
        return mediaIdToMediaItems[mediaId];
    }
}
