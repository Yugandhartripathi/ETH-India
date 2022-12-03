import React from "react";
import { Card, Illustration } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { oasisAddress } from "./../config";
import Oasis from "./../artifacts/contracts/Oasis.sol/Oasis.json";

export default function Home() {
  const [loadingState, setLoadingState] = useState(true);
  const names = [
    "James",
    "Paul",
    "John",
    "George",
    "Ringo",
    "James",
    "Paul",
    "John",
    "George",
    "Ringo",
    "James",
    "Paul",
    "John",
    "George",
    "Ringo",
    "James",
    "Paul",
    "John",
    "George",
    "Ringo",
    "James",
    "Paul",
    "John",
    "George",
    "Ringo",
  ];

  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    loadMediaItems();
  }, []);

  async function loadMediaItems() {
    // query media items

    const provider = new ethers.providers.JsonRpcProvider();

    console.log(oasisAddress, Oasis);

    const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
    const data = await contract.getAllMedia();
    console.log("media items data is", data);
    setLoadingState(false);
  }

  return (
    <div className="home2">
      {loadingState ? (
        <p>Loading</p>
      ) : (
        names.map((name) => (
          <div
            style={{
              width: "250px",
              padding: "20px",
            }}
          >
            <Card
              description="Create your own NFT Marketplace"
              onClick={function noRefCheck() {}}
              setIsSelected={function noRefCheck() {}}
              title={name}
              tooltipText="Create and earn money from your own NFT Marketplace"
            >
              <div>
                <Illustration height="180px" logo="marketplace" width="100%" />
              </div>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
