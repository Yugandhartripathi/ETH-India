import React from "react";
import { Card, Illustration } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { oasisAddress } from "./../config";
import Oasis from "./../artifacts/contracts/Oasis.sol/Oasis.json";
import MediaItems from "../components/mediaitems";
// import sha256 from "../../pixie-copy/frontend/pages/helperfunctions/hash";

export default function Home() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    loadMediaItems();
  }, []);

  async function loadMediaItems() {
    // query media items

    const provider = new ethers.providers.JsonRpcProvider();
    // "https://rpc-mumbai.maticvigil.com"

    console.log("testing abis n adds", oasisAddress, Oasis);

    const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
    const data = await contract.getAllMedia();
    console.log("media items data is", data);

    const mediaItems = await Promise.all(
      data.map(async (i) => {
        let item = {
          mediaId: i.mediaId.toNumber(),
          title: i.title,
          description: i.description,
          tokenCount: i.tokenCount.toNumber(),
          creator: i.creator,
          mediaType: i.mediaType,
          mediaURI: i.mediaURI,
          coverURI: i.coverURI,
          isGated: i.isGated,
          availableCount: i.availableCount.toNumber(),
        };
        return item;
      })
    );
    setMediaItems(mediaItems);
    setLoadingState(false);
  }

  return (
    <div>
      {mediaItems.length == 0 && (
        <h5 style={{ textAlign: "center", width: "100%" }}>
          Nothing published yet...
        </h5>
      )}
      <MediaItems mediaItems={mediaItems}></MediaItems>
    </div>
  );
}
