// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

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
    Counters.Counter private _eventIds;
    Counters.Counter private _userIds;

    mapping(uint256 => MediaItem) private mediaIdToMediaItems;
    mapping(uint256 => NFTToken) private tokenIdToToken;
    mapping(uint256 => Event) private eventIdToEvent;
    mapping(uint256 => User) private userIdToUser;
    mapping(address => User) private userAddressToUser;

    // Mappings
    mapping(address => address[]) private userToFollowers;
    mapping(address => MediaItem[]) private creatorToMediaItems;
    mapping(address => Event[]) private creatorToEvent;

    mapping(uint256 => uint256[]) private mediaIdToTokenIds;

    mapping(uint256 => uint256) private tokenIdToMediaId;
    mapping(address => uint256) private creatorTokenSaleCount;
    mapping(address => uint256) private creatorTokenSaleValue;
    mapping(uint256 => uint256) private eventToMedia;
    mapping(uint256 => uint256) private mediaToEvent;

    mapping(address => bool) private userToExistence;

    // Structs
    struct Event {
        uint256 eventId;
        string eventType;
        string eventDate;
        string eventTime;
        string venueAddress;
    }

    struct NFTToken {
        uint256 tokenId;
        uint256 price;
        uint256 royalty;
        address payable creator;
        address payable owner;
        address payable seller;
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
        uint256 userId;
        address accountAddress;
        uint accountType;
    }

    constructor() ERC721("OasisTokens", "OASIS") {
        smartContractOwner = payable(msg.sender);
    }

    function createUser(address userAddress, uint accountType) private {
        _userIds.increment();
        uint256 id = _userIds.current();
        User memory user = User(id, userAddress, accountType);
        userIdToUser[id] = user;
        userAddressToUser[userAddress] = user;
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

        if (!userToExistence[msg.sender]) {
            createUser(msg.sender, 1);
            userToExistence[msg.sender] = true;
        }

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

    function createEvent(
        string memory _eventDate,
        string memory _eventTime,
        string memory _eventType,
        string memory _venueAddress
    ) public {
        _eventIds.increment();
        uint256 id = _eventIds.current();
        Event memory eventItem = Event(
            id,
            _eventType,
            _eventDate,
            _eventTime,
            _venueAddress
        );
        uint256 _mediaId = _mediaIds.current();
        mediaToEvent[_mediaId] = id;
        eventToMedia[id] = _mediaId;
        eventIdToEvent[id] = eventItem;
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
            console.log("NEWTOKENS", newTokenId, _creator, msg.sender);
            _mint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, _tokenCoverURI);

            //create NFTTokenItem
            NFTToken memory token = NFTToken(
                newTokenId,
                _price,
                _royalty,
                payable(msg.sender),
                payable(address(this)),
                payable(msg.sender),
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
        uint256 price = tokenIdToToken[tokenId].price;
        address seller = tokenIdToToken[tokenId].seller;
        console.log("TESTTTT", msg.value, price, seller);
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //payable(smartContractOwner).transfer(listingPrice);

        if (!userToExistence[msg.sender]) {
            createUser(msg.sender, 2);
            userToExistence[msg.sender] = true;
        }
        tokenIdToToken[tokenId].owner = payable(msg.sender);
        tokenIdToToken[tokenId].isSold = true;
        tokenIdToToken[tokenId].seller = payable(address(0));

        _transfer(address(this), msg.sender, tokenId);

        address payable artist = tokenIdToToken[tokenId].creator;
        uint royalty = tokenIdToToken[tokenId].royalty;

        payable(seller).transfer((msg.value / 100) * (100 - royalty));
        payable(artist).transfer((msg.value / 100) * royalty);

        if (seller == artist) {
            console.log("artist is selling");
            uint256 mediaId = tokenIdToMediaId[tokenId];
            mediaIdToMediaItems[mediaId].availableCount -= 1;
            creatorTokenSaleCount[seller] += 1;
            creatorTokenSaleValue[seller] += price;
        } else {
            console.log("non creator selling");
            creatorTokenSaleValue[artist] += (msg.value / 100) * royalty;
        }
    }

    // function getAllOwnedNFTs(
    //     address userAddress
    // ) public view returns (NFTToken[] memory) {
    //     uint256[] memory tokenIds = userOwnedTokens[userAddress];
    //     uint currentIndex = 0;
    //     NFTToken[] memory tokens = new NFTToken[](tokenIds.length);
    //     for (uint i = 0; i < tokenIds.length; i++) {
    //         NFTToken memory currentToken = tokenIdToToken[tokenIds[i]];
    //         tokens[currentIndex] = currentToken;
    //         currentIndex += 1;
    //     }
    //     return tokens;
    // }

    function fetchNFTUpForSale(
        uint256 mediaId
    ) public view returns (NFTToken memory) {
        uint256[] memory tokenIdsForMedia = mediaIdToTokenIds[mediaId];
        for (uint i = 0; i < tokenIdsForMedia.length; i++) {
            uint256 tempTokenId = tokenIdsForMedia[i];
            NFTToken memory tempToken = tokenIdToToken[tempTokenId];
            if (!tempToken.isSold) {
                return tempToken;
            }
        }
        return
            NFTToken(
                uint256(0),
                uint256(0),
                uint256(0),
                payable(address(0)),
                payable(address(this)),
                payable(address(0)),
                false,
                "sold"
            );
    }

    // getter functions
    function getMediaItem(
        uint256 mediaId
    ) public view returns (MediaItem memory) {
        return mediaIdToMediaItems[mediaId];
    }

    function getTokenData(
        uint256 mediaId
    ) public view returns (NFTToken memory) {
        return tokenIdToToken[mediaIdToTokenIds[mediaId][0]];
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs(
        address userAddress
    ) public view returns (NFTToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (tokenIdToToken[i + 1].owner == userAddress) {
                itemCount += 1;
            }
        }

        NFTToken[] memory items = new NFTToken[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (tokenIdToToken[i + 1].owner == userAddress) {
                uint currentId = i + 1;
                NFTToken storage currentItem = tokenIdToToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Return all MArketItems for a specific creator
    function fetchMediaforCreator(
        address creator
    ) public view returns (MediaItem[] memory) {
        uint totalItemCount = _mediaIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (mediaIdToMediaItems[i + 1].creator == creator) {
                itemCount += 1;
            }
        }

        MediaItem[] memory items = new MediaItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (mediaIdToMediaItems[i + 1].creator == creator) {
                uint256 currentId = i + 1;
                MediaItem storage currentItem = mediaIdToMediaItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Fetch Events for a Creator
    function fetchEventsForCreator(
        address creator
    ) public view returns (Event[] memory) {
        return creatorToEvent[creator];
    }

    //  sale of a creator
    function creatorSale(address creator) public view returns (uint256) {
        return creatorTokenSaleCount[creator];
    }

    // revenue generated for a creator
    function creatorRev(address creator) public view returns (uint256) {
        return creatorTokenSaleValue[creator];
    }

    function followUser(address userAddress) public {
        userToFollowers[userAddress].push(msg.sender);
    }

    function getUserFollowers(
        address userAddress
    ) public view returns (address[] memory) {
        return userToFollowers[userAddress];
    }

    function getUser(address userAddress) public view returns (User memory) {
        return userAddressToUser[userAddress];
    }

    function hasAccessToMedia(uint256 mediaId) public returns (bool) {
        bool hasAccess = false;
        NFTToken[] memory tokensForThisMedia = mediaIdToTokenIds[mediaId];
        for (uint i = 0; i < tokensForThisMedia.length; i++) {
            if (msg.sender == tokensForThisMedia[i].owner) {
                hasAccess = true;
            }
        }
        return hasAccess;
    }
}
