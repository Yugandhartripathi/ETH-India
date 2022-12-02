// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Schema.sol";
import "./TokenActions.sol";
import {MediaItem} from "./Schema.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CreatorActions is ERC721URIStorage {
    Schema public schema = new Schema();

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

        schema._mediaIds.increment();

        uint256 id = schema._mediaIds.current();

        MediaItem item = MediaItem(
            id,
            _tokenCount,
            msg.sender,
            _isGated,
            _title,
            _description,
            _mediaURI,
            _mediaCoverURI,
            _mediaType
        );

        schema.creatorToMediaItems[msg.sender].push(item);
        schema.mediaIdToMediaItems[id] = item;

        // creatorToMediaItems push
        // counter for mediaIds++

        if (_isGated) {
            createTokens(
                msg.sender,
                _tokenCount,
                _price,
                _royalty,
                _tokenCoverURI
            );
        }

        // if not Gated => done
        // if Gated =>
        // createTokens()
        //
    }
}
