// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Oasis is ERC721URIStorage {
    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private _mediaIds;
    Counters.Counter private _tokenIds;

    mapping(uint256 => MediaItem) private mediaIdToMediaItems;
    mapping(uint256 => NFTToken) private tokenIdToToken;

    // Mappings
    mapping(address => User[]) private creatorToFollowers;
    mapping(address => MediaItem[]) private creatorToMediaItems;
    mapping(uint256 => uint256[]) private mediaIdToTokenIds;
    mapping(uint256 => uint256) private tokenIdToMediaId;

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
        owner = payable(msg.sender);
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
    ) public {
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

    // get all functions
    function getAllMedia() public view returns (MediaItem[] memory) {
        uint itemCount = _mediaIds.current();
        uint currentIndex = 0;

        MediaItem[] memory items = new MediaItem[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            MediaItem storage currentItem = mediaIdToMediaItems[i + 1];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }
}
