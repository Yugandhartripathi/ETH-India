import React, { useState } from "react";
// import classes from "../../../styles/addmusic.module.css";
// import classes from "./../../../styles/addmusic.module.css";
// import { useRouter } from "next/router";
import { Form } from "web3uikit";
// import { ethers } from "ethers";
// import Web3Modal from "web3modal";
const axios = require("axios").default;

// import { PROJECTID, PROJECTSECRET } from "../../../api_key";
// import { create as ipfsHttpClient } from "ipfs-http-client";

// const projectId = PROJECTID;
// const projectSecret = PROJECTSECRET;
// const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

// const ipfs = ipfsHttpClient({
//   url: "https://ipfs.infura.io:5001/api/v0",
//   headers: {
//     authorization,
//   },
// });

// import { marketplaceAddress } from "../../../../backend/config";
// import NFTMarketplace from "./../../../../backend/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";

function AddMediaForm({ setLoadingState }) {
  //   return (
  //     <>
  //       <p color="white">media form</p>
  //     </>
  //   );

  // uint256 tokenCount;
  const [tokenCount, setTokenCount] = useState(0);
  // bool isGated;
  const [isGated, setIsGated] = useState(true);
  // string title;
  const [title, setTitle] = useState("");
  // string description;
  const [description, setDescription] = useState("");
  // string mediaURI;
  const [mediaUri, setMediaUri] = useState("");
  // string coverURI;
  const [mediaCover, setMediaCover] = useState("");
  // string mediaType;
  const [mediaType, setMediaType] = useState("");

  //   uint256 price;
  const [tokenPrice, setTokenPrice] = useState(0);
  //   uint256 royalty;
  const [royalty, setRoyalty] = useState(0);

  //   string NFTCoverURI;
  const [NFTCoverUri, setNFTCoverUri] = useState("");

  //   const router = useRouter();
  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    }
    if (name === "desc") {
      setDesc(value);
    }
    if (name === "price") {
      setPrice(value);
    }
    if (name === "royalty") {
      setRoyalty(value);
    }
  }
  async function onChange(e) {
    const file = e.target.files[0];
    setMp3(file);
  }
  async function selectCover(e) {
    const file = e.target.files[0];
    setCover(file);
  }
  //   async function uploadToIPFS(mp3Url) {
  //     /* first, upload to IPFS */
  //     const data = JSON.stringify({
  //       name,
  //       desc,
  //       image: mp3Url,
  //     });
  //     let nftUrl;
  //     try {
  //       const added = await ipfs.add(data);
  //       nftUrl = `https://music-mania.infura-ipfs.io/ipfs/${added.path}`;
  //     } catch (error) {
  //       console.log("Error uploading nft json: ", error);
  //     }
  //     return nftUrl;
  //   }
  //   async function listNFTForSale() {
  //     setLoadingState(true);
  //     if (!name || !desc || !price || !royalty || !cover || !mp3) return;
  //     let mp3Url;
  //     try {
  //       const result = await ipfs.add(mp3);
  //       console.log("infura result", result);
  //       mp3Url = `https://music-mania.infura-ipfs.io/ipfs/${result.path}`;
  //     } catch (error) {
  //       console.log("Error uploading mp3: ", error);
  //     }
  //     console.log("mp3url is ", mp3Url);
  //     let coverUrl;
  //     try {
  //       const result = await ipfs.add(cover);
  //       console.log("infura result", result);
  //       coverUrl = `https://music-mania.infura-ipfs.io/ipfs/${result.path}`;
  //     } catch (error) {
  //       console.log("Error uploading cover photo: ", error);
  //     }
  //     console.log("cover url is ", coverUrl);
  //     const nftUrl = await uploadToIPFS(mp3Url);
  //     console.log("nft url is ", nftUrl);
  //     const web3Modal = new Web3Modal();
  //     const connection = await web3Modal.connect();
  //     const provider = new ethers.providers.Web3Provider(connection);
  //     const signer = provider.getSigner();
  //     /* next, create the item */
  //     const price_ = ethers.utils.parseUnits(price.toString(), "ether");
  //     let contract = new ethers.Contract(
  //       marketplaceAddress,
  //       NFTMarketplace.abi,
  //       signer
  //     );
  //     let listingPrice = await contract.getListingPrice();
  //     listingPrice = listingPrice.toString();
  //     let transaction = await contract.createToken(
  //       nftUrl,
  //       price_,
  //       royalty,
  //       coverUrl,
  //       {
  //         value: listingPrice,
  //       }
  //     );
  //     await transaction.wait();
  // setLoadingState(false);
  //     router.push("/");
  //   }
  return (
    <Form
      buttonConfig={{
        onClick: function noRefCheck() {},
        theme: "primary",
      }}
      data={[
        {
          inputWidth: "100%",
          name: "first name",
          type: "text",
          value: "",
        },
        {
          inputWidth: "100%",
          name: "your email",
          type: "email",
          validation: {
            regExp: "^[^@s]+@[^@s]+.[^@s]+$",
            required: true,
          },
          value: "",
        },
        {
          name: "your digits",
          type: "tel",
          validation: {
            required: true,
          },
          value: "",
        },
        {
          name: "your password",
          type: "password",
          validation: {
            characterMaxLength: 20,
            characterMinLength: 6,
            required: true,
          },
          value: "",
        },
        {
          name: "Rate our form? 1-10",
          type: "number",
          validation: {
            numberMax: 10,
            numberMin: 1,
            required: true,
          },
          value: "",
        },
        {
          name: "pizza fav",
          options: ["pineapple", "peppers", "chillies"],
          type: "box",
          value: "what toppings do you like?",
        },
        {
          name: "Morning checklist",
          options: ["say GM", "make coffee", "build killer web3uiKit"],
          type: "switch",
          validation: {
            required: true,
          },
          value: "Check list",
        },
        {
          name: "pokemon",
          options: ["charmander", "squirtle", "bulbasaur"],
          type: "radios",
          value: "who's that pokemon?",
        },
        {
          inputWidth: "100%",
          name: "Image",
          type: "file",
          value: "",
        },
        {
          inputWidth: "100%",
          name: "Any more comments?",
          type: "textarea",
          validation: {
            required: true,
          },
          value: "",
        },
      ]}
      onSubmit={function noRefCheck() {}}
      title="Test form"
    />
  );
  //   onClick={listNFTForSale}
}

export default AddMediaForm;
