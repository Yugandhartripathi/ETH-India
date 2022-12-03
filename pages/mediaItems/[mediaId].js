import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import { oasisAddress } from "./../../config";
import Oasis from "./../../artifacts/contracts/Oasis.sol/Oasis.json";

import classes from "../../styles/songPage.module.css";
import { SleepyCat } from "web3uikit";

function MediaItemPage() {
  const [media, setMedia] = useState({});
  const [account, setAccount] = useState(null);

  let router = useRouter();
  useEffect(() => {
    console.log("loading media");
    loadMedia();
  }, [account]);

  async function loadMedia() {
    console.log(router.query.mediaId);
    const mediaId = router.query.mediaId;
    if (!mediaId) return;

    const provider = new ethers.providers.JsonRpcProvider();
    // "https://rpc-mumbai.maticvigil.com"

    console.log("testing in song page", oasisAddress, Oasis);

    const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
    const data = await contract.getMediaItem(mediaId);
    console.log("media item data is", typeof data, data);
    //console.log(media.tokenCount);
    setMedia(data);
  }

  return (
    <div>
      <p>Test</p>
      <div>
        <div className="home2">
          <div>
            <div className={classes.songpage_main}>
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
