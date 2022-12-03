import React, { useState } from "react";
import { Select, Input, Checkbox, Button, Upload, Typography } from "web3uikit";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
const axios = require("axios").default;
import { useRouter } from "next/router";

import { PROJECTID, PROJECTSECRET } from "./../../../api_key";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = PROJECTID;
const projectSecret = PROJECTSECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});

import { oasisAddress } from "./../../../config";
import Oasis from "./../../../artifacts/contracts/Oasis.sol/Oasis.json";

// import { Web3Storage } from "web3.storage";

// const apitoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlhMTRCMDdEOTM5NDQwYWM1N0Y0NEVGOTAyQzBENjc5OEQ1NTNmRUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwNDc2OTI4MDAsIm5hbWUiOiJvYXNpcyJ9.Hw4pDEfS9Q0LZ4aJAnq87723j7wj5dtb_3rasb4Ishs"
// // Construct with token and endpoint
// const client = new Web3Storage({ token: apiToken });

function AddMediaForm({ setLoadingState }) {
  const [tokenCount, setTokenCount] = useState(0);
  const [isGated, setIsGated] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaUri, setMediaUri] = useState("");
  const [mediaCover, setMediaCover] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [NFTCover, setNFTCover] = useState(null);
  const [NFTCoverUri, setNFTCoverUri] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventType, setEventType] = useState("");

  const router = useRouter();
  function handleSelect(e) {
    console.log(e.id);
    setMediaType(e.id);
  }
  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name") {
      setTitle(value);
    }
    if (name === "event") {
      setIsEvent(!isEvent);
      console.log(value);
    }
    if (name === "gated") {
      setIsGated(!isGated);
      console.log(value);
    }
    if (name === "desc") {
      setDescription(value);
    }
    if (isGated == true) {
      if (name === "count") {
        setTokenCount(value);
      }

      if (name === "price") {
        setTokenPrice(value);
      }
      if (name === "royalty") {
        setRoyalty(value);
      }
    }
    if (isEvent == true) {
      if (name === "eventDate") {
        setEventDate(value);
      }
      if (name === "eventTime") {
        setEventTime(value);
      }
      if (name === "eventVenue") {
        setEventVenue(value);
      }
      if (name === "eventType") {
        setEventType(value);
      }
    }
  }
  function handleMediaFile(file) {
    console.log(file);
    setMedia(file);
  }
  function handleMediaCoverFile(file) {
    console.log(file);
    setMediaCover(file);
  }
  function handleNFTCoverFile(file) {
    console.log(file);
    setNFTCover(file);
  }
  async function uploadToIPFS(NFTCoverUrl) {
    /* first, upload to IPFS */
    const NFTTitle = title + "token";
    const data = JSON.stringify({
      NFTTitle,
      description,
      image: NFTCoverUrl,
    });
    let nftUrl;
    try {
      const added = await ipfs.add(data);
      nftUrl = `https://pixie2.infura-ipfs.io/ipfs/${added.path}`;
    } catch (error) {
      console.log("Error uploading nft json: ", error);
    }
    return nftUrl;
  }

  async function listNFTForSale() {
    let mediaUrl;
    try {
      const result = await ipfs.add(media);
      console.log("infura result for media", result);
      mediaUrl = `https://pixie2.infura-ipfs.io/ipfs/${result.path}`;
    } catch (error) {
      console.log("Error uploading mp3: ", error);
    }
    console.log("media url is is ", mediaUrl);

    let mediaCoverUrl;
    try {
      const result = await ipfs.add(mediaCover);
      console.log("infura result", result);
      mediaCoverUrl = `https://pixie2.infura-ipfs.io/ipfs/${result.path}`;
    } catch (error) {
      console.log("Error uploading media cover photo: ", error);
    }
    console.log("media cover url is ", mediaCoverUrl);

    //NFTCover
    let tokenCoverUrl;
    try {
      const result = await ipfs.add(NFTCover);
      console.log("infura result", result);
      tokenCoverUrl = `https://pixie2.infura-ipfs.io/ipfs/${result.path}`;
    } catch (error) {
      console.log("Error uploading NFT cover photo: ", error);
    }
    console.log("NFT cover url is ", tokenCoverUrl);

    const nftUrl = await uploadToIPFS(tokenCoverUrl); //
    console.log("nft url is ", nftUrl);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //     /* next, create the item */
    const price_ = ethers.utils.parseUnits(tokenPrice.toString(), "ether");
    console.log(price_, tokenPrice, tokenPrice.toString());
    // return;
    let contract = new ethers.Contract(oasisAddress, Oasis.abi, signer);

    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    // console.log("testing mediatype", mediaType);

    console.log(isGated, tokenCount, "testing");

    let transaction = await contract.createMediaItem(
      mediaType,
      mediaUrl,
      mediaCoverUrl,
      title,
      description,
      isGated,
      tokenCoverUrl,
      tokenCount,
      tokenPrice,
      royalty,
      {
        value: listingPrice,
      }
    );

    await transaction.wait();
    if (isEvent) {
      let transaction2 = await contract.createEvent(
        eventDate,
        eventTime,
        eventType,
        eventVenue
      );
      await transaction2.wait();
    }
    setLoadingState(false);
    router.push("/");
  }

  return (
    <div className="form">
      <div className="input-div">
        <Select
          defaultOptionIndex={0}
          id="Select"
          name="mediaType"
          label="Media Type"
          onChange={handleSelect}
          options={[
            {
              id: "image",
              label: "Image",
            },
            {
              id: "audio",
              label: "Audio",
            },
            {
              id: "video",
              label: "Video",
            },
          ]}
          validation={{
            required: true,
          }}
        />
      </div>
      <div className="input-div">
        <Typography variant="subtitle2">Upload Media</Typography>
        <Upload
          onChange={handleMediaFile}
          name="media"
          theme="textOnly"
          validation={{
            required: true,
          }}
        />
      </div>
      <div className="input-div">
        <Typography variant="subtitle2">Upload Media Cover</Typography>
        <Upload
          onChange={handleMediaCoverFile}
          name="cover"
          theme="textOnly"
          validation={{
            required: true,
          }}
        />
      </div>
      <div className="input-div">
        <Input
          label="Title"
          name="name"
          onChange={handleChange}
          validation={{
            required: true,
          }}
        />
      </div>
      <div className="input-div">
        <Input
          label="Description"
          name="desc"
          //   type="text"
          onChange={handleChange}
          validation={{
            required: true,
          }}
        />
      </div>
      <div className="input-div">
        <Checkbox
          id="event"
          label="Is Event?"
          name="event"
          onChange={handleChange}
        />
      </div>
      <div className="Optionals2">
        {!isEvent ? null : (
          <div>
            <div className="input-div">
              <Input
                label="Event Date"
                onChange={handleChange}
                name="eventDate"
                type="string"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
            <div className="input-div">
              <Input
                label="Event Time"
                onChange={handleChange}
                name="eventTime"
                type="string"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
            <div className="input-div">
              <Input
                label="Event Venue"
                onChange={handleChange}
                name="eventVenue"
                type="string"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
            <div className="input-div">
              <Input
                label="Event Type"
                onChange={handleChange}
                name="eventType"
                type="string"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="input-div">
        <Checkbox
          id="gated"
          label="Gated by NFT?"
          name="gated"
          onChange={handleChange}
        />
      </div>

      <div className="Optionals">
        {!isGated ? null : (
          <div>
            <div className="input-div">
              <Input
                label="NFT Count"
                onChange={handleChange}
                name="count"
                type="number"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
            <div className="input-div">
              <Input
                label="Royalty Percentage"
                onChange={handleChange}
                type="number"
                name="royalty"
                prefixIcon="%"
                validation={{
                  numberMax: 100,
                  numberMin: 0,
                }}
              />
            </div>
            <div className="input-div">
              <Input
                label="NFT Price"
                onChange={handleChange}
                name="price"
                prefixIcon="ETH"
                type="text"
              />
            </div>
            <div className="input-div">
              <Typography variant="subtitle2">
                Upload NFT Cover Image
              </Typography>
              <Upload
                onChange={handleNFTCoverFile}
                theme="textOnly"
                name="nftcover"
                validation={{
                  required: true,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="input-div">
        <Button onClick={listNFTForSale} text="Submit" theme="primary" />
      </div>
    </div>
  );
}

export default AddMediaForm;
