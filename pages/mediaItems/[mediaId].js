import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import { oasisAddress } from "./../../config";
import Oasis from "./../../artifacts/contracts/Oasis.sol/Oasis.json";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import classes from "../../styles/songPage.module.css";
import { SleepyCat } from "web3uikit";
import ReactPlayer from "react-player";
import "./../../node_modules/video-react/dist/video-react.css";
import { Player } from "video-react";
function MediaItemPage() {
  const [media, setMedia] = useState({});
  const [tokenDetails, setTokenDetails] = useState({});
  const [account, setAccount] = useState(null);
  const [audio, setAudio] = useState(null);

  let router = useRouter();
  useEffect(() => {
    console.log("loading media and token details");
    loadMedia();
  }, [account]);

  async function loadMedia() {
    const mediaId = router.query.mediaId;
    if (!mediaId) return;

    const provider = new ethers.providers.JsonRpcProvider();
    // "https://rpc-mumbai.maticvigil.com"

    const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
    const data1 = await contract.getMediaItem(mediaId);

    const data2 = await contract.getTokenData(mediaId);

    console.log("media item data is", typeof data1, data1);
    console.log("token item data is", typeof data2, data2);
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
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  return (
    <div>
      <p>Test</p>
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
                    <p>: {media.creator}</p>
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
    </div>
  );
}

export default MediaItemPage;
