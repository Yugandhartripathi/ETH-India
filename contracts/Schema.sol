// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Schema {
    // getAllMedia
    using Counters for Counters.Counter;
    Counters.Counter private _mediaIds;
    mapping(uint256 => MediaItem) private mediaIdToMediaItems;

    // Mappings
    mapping(address => User[]) private creatorToFollowers;
    mapping(address => MediaItem[]) private creatorToMediaItems;
    mapping(uint256 => NFTToken[]) private mediaToTokens;
    mapping(uint256 => MediaItem) private tokenToMediaItems;

    // Structs
    struct NFTToken {
        uint256 tokenId;
        uint256 price;
        uint256 royalty;
        address creator;
        address owner;
        address seller;
        bool isSold;
    }

    struct MediaItem {
        uint256 mediaId;
        uint256 tokenCount;
        address payable creator;
        bool isGated;
        string title;
        string description;
        string cover;
        string data;
        string mediaType;
    }

    struct User {
        address accountAddress;
        string accountType;
    }
}
