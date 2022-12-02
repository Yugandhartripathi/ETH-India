// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Schema.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenActions is ERC721URIStorage {
    function createTokens(
        address _creator,
        uint256 _tokenCount,
        uint256 _price,
        uint256 _royalty,
        uint256 _tokenCoverURI
    ) public {}
}
