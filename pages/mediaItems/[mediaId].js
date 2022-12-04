import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import { oasisAddress } from "./../../config";
import Oasis from "./../../artifacts/contracts/Oasis.sol/Oasis.json";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Web3Modal from "web3modal";
import { Loader } from "../components/addmedia/Loader";
import classes from "../../styles/songPage.module.css";
import ReactPlayer from "react-player";
import "./../../node_modules/video-react/dist/video-react.css";
import { Player } from "video-react";
function MediaItemPage() {
  const [media, setMedia] = useState({});
  const [tokenDetails, setTokenDetails] = useState({});
  const [account, setAccount] = useState(null);
  const [audio, setAudio] = useState(null);
  const [ensName, setENS] = useState("");
  const [loadingState, setLoadingState] = useState(true);

  let router = useRouter();
  useEffect(() => {
    console.log("loading media and token details");
    loadMedia();
    loadENS();
  }, [account]);

  async function loadENS() {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum, "any");
    let accounts = await provider2.send("eth_requestAccounts", []);
    var address = accounts[0];
    console.log("address", address);
    var name = await provider2.lookupAddress(address);
    console.log("ENS NAME", name);
    setENS(name);
    setLoadingState(false);
  }

  async function loadMedia() {
    const mediaId = router.query.mediaId;
    if (!mediaId) return;

    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/NUyx787FuwDesAUWYDIP7Gbp9OHvOcex"
    );
    // "https://rpc-mumbai.maticvigil.com"

    const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
    const data1 = await contract.getMediaItem(mediaId);

    const data2 = await contract.getTokenData(mediaId);

    // console.log("media item data is", typeof data1, data1);
    // console.log("token item data is", typeof data2, data2);
    //console.log(media.tokenCount);
    if (data1.mediaType == "song") {
      setAudio(new Audio(media.mediaURI));
    }
    setMedia(data1);
    setTokenDetails(data2);
  }
  // async function loadToken() {
  //   const mediaId = router.query.mediaId;
  //   if (!mediaId) return;

  //   const provider = new ethers.providers.JsonRpcProvider();
  //   // "https://rpc-mumbai.maticvigil.com"

  //   const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
  //   const data = await contract.getTokenData(mediaId);
  //   console.log("token item data is", typeof data, data);
  //   setTokenDetails(data);
  // }

  async function initNFTTransaction() {
    setLoadingState(true);
    console.log("NFT transaction in progress.");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(oasisAddress, Oasis.abi, signer);

    console.log(media.mediaId, "testing");
    let sellingToken = await contract.fetchNFTUpForSale(media.mediaId);
    console.log(sellingToken);
    if (sellingToken["NFTCoverURI"] === "sold") {
      console.log("SOLD OUT!!!!");
    } else {
      // let price_ = ethers.utils.formatUnits(
      //   sellingToken.price.toString(),
      //   "ether"
      // );
      // const price_ = ethers.utils.parseUnits(
      //   sellingToken.price.toString(),
      //   "ether"
      // );
      let price_ = sellingToken.price;
      console.log(
        "UI PRICE TEST:",
        price_,
        sellingToken.price,
        sellingToken.price.toString()
      );
      let transaction = await contract.NFTTokenSale(sellingToken.tokenId, {
        value: price_,
      });
      await transaction.wait();
      console.log("Sale successful");
    }
    setLoadingState(false);
  }

  return (
    <div>
      <p>Test</p>
      {loadingState == true ? (
        <Loader />
      ) : (
        <div>
          <div className="home2">
            <div>
              <div className={classes.songpage_main}>
                {media.mediaType === "image" && (
                  <img src={media.mediaURI} width="50%" />
                )}
                {media.mediaType === "audio" && (
                  <AudioPlayer
                    autoPlay
                    src={media.mediaURI}
                    onPlay={(e) => console.log("onPlay")}
                    // other props here
                    // style={{ position: "fixed" }}
                  />
                )}

                {media.mediaType == "video" && (
                  <ReactPlayer url="https://cdn.livepeer.com/hls/0efey7a5s67ha39v/index.m3u8" /> // live stream
                  // <Player
                  //   playsInline
                  //   poster="/assets/poster.png"
                  //   // src={media.mediaURI}
                  //   src="https://cdn.livepeer.com/hls/0efey7a5s67ha39v/index.m3u8"
                  // /> // pre recorded
                )}
                <h1>Content Details</h1>
                <div className={classes.song1}>
                  <div className={classes.song_left}>
                    <img src={media.coverURI} />
                  </div>
                  {console.log("media test ", media)}
                  <div className={classes.song_center}>
                    <div className={classes.labelss}>
                      <p>Content Title</p>
                      <p>Content Description</p>
                      <p>Creator </p>
                      <p>Total Access Tokens</p>
                      <p>Available Access Tokens</p>
                      {/* <p>Owner</p> */}
                    </div>
                    <div className={classes.details}>
                      <p>: {media.title}</p>
                      <p>: {media.description}</p>
                      <p>: {ensName != null ? ensName : media.creator}</p>
                      <p>
                        :{" "}
                        {media.tokenCount
                          ? media.tokenCount.toString()
                          : "Loading..."}
                      </p>
                      <p>
                        :{" "}
                        {media.availableCount
                          ? media.availableCount.toString()
                          : "Loading..."}
                      </p>

                      {/* <p>: {media.sold ? `For Sale` : `Sold`}</p> */}
                    </div>
                  </div>
                  <div className={classes.song_right}>
                    <button
                      onClick={initNFTTransaction}
                      className={classes.play_btn}
                    >
                      Buy
                    </button>
                    <button
                      // onClick={}
                      className={classes.play_btn}
                    >
                      Resell
                    </button>

                    {/* {media.sold == false ? (
              <button className={classes.buy_nft}>Buy NFT</button>
            ) : (
              ""
            )}
            {console.log(account, media.owner)}
            {account == media.owner ? (
              <button onClick={handleShow} className={classes.buy_nft}>
                Relist NFT
              </button>
            ) : (
              ""
            )} */}
                  </div>
                </div>
                <h1>Token Details</h1>
                <div className={classes.song1}>
                  <div className={classes.song_left}>
                    <img src={tokenDetails.NFTCoverURI} />
                  </div>
                  <div className={classes.song_center}>
                    <div className={classes.labelss}>
                      <p>Ticket Price</p>
                      <p>Royalty</p>
                    </div>
                    <div className={classes.details}>
                      <p>
                        :{" "}
                        {tokenDetails.price
                          ? tokenDetails.price.toString()
                          : "Loading..."}
                      </p>
                      <p>
                        :{" "}
                        {tokenDetails.royalty
                          ? tokenDetails.royalty.toString()
                          : "Loading..."}
                      </p>

                      {/* <p>: {media.sold ? `For Sale` : `Sold`}</p> */}
                    </div>
                  </div>
                  <div className={classes.song_right}>
                    <button
                      // onClick={}
                      className={classes.play_btn}
                    >
                      ReSell
                    </button>
                    <button
                      // onClick={}
                      className={classes.play_btn}
                    >
                      Buy
                    </button>

                    {/* {media.sold == false ? (
              <button className={classes.buy_nft}>Buy NFT</button>
            ) : (
              ""
            )}
            {console.log(account, media.owner)}
            {account == media.owner ? (
              <button onClick={handleShow} className={classes.buy_nft}>
                Relist NFT
              </button>
            ) : (
              ""
            )} */}
                  </div>
                </div>
                {/* <div className={classes.fans_list}>
                <div className={classes.artist_fans}>
                  <h1>Top Fans</h1>
                  <div className={classes.songs_table}>
                    {fans.map((d, index) => (
                      <FansList fanData={d} index={index} />
                    ))}
                  </div>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaItemPage;
