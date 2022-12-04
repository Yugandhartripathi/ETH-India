import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classes from "../../styles/songPage.module.css";
import { ethers } from "ethers";

import { oasisAddress } from "./../../config";
import Oasis from "./../../artifacts/contracts/Oasis.sol/Oasis.json";

import { EmbedSDK } from "@pushprotocol/uiembed";

import {
    Card,
    Illustration,
    TabList,
    Tab,
    Typography,
    Button,
    Input,
    TextArea
} from "web3uikit";
import MediaItems from "../../components/mediaitems";

export default function UserPage() {
    const [account, setAccount] = useState(null);
    const [userInfo, setUserInfo] = useState("");

    const [showModal, setShowModal] = useState(false);

    const router = useRouter();
    const { userId } = router.query;

    useEffect(() => {
        console.log("loading user and user details");
        loadUser();
        getAddress()

        return () => {
            EmbedSDK.cleanup();
        };
    }, [account]);

    async function loadUser() {
        const userAddress = router.query.userId;
        if (!userAddress) return;

        const provider = new ethers.providers.JsonRpcProvider();
        // "https://rpc-mumbai.maticvigil.com"

        const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);

        const userData = await contract.getUser(userAddress);

        const userNFTData = await contract.fetchMyNFTs(userAddress);

        const userContentData = await contract.fetchMediaforCreator(userAddress);

        const userEventData = await contract.fetchEventsForCreator(userAddress);

        const userFollowersData = await contract.getUserFollowers(userAddress);

        const userRevenueData = await contract.creatorRev(userAddress);

        const userSaleData = await contract.creatorSale(userAddress);

        const uCD = await Promise.all(
            userContentData.map(async (i) => {
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

        const uND = await Promise.all(
            userNFTData.map(async (i) => {
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

        const uED = await Promise.all(
            userEventData.map(async (i) => {
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

        setUserInfo({
            userData,
            uND,
            uCD,
            uED,
            userFollowersData,
            userRevenueData,
            userSaleData,
        });
    }

    async function getAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        let accounts = await provider.send("eth_requestAccounts", []);

        if (accounts[0]) { // 'your connected wallet address'
            EmbedSDK.init({
                headerText: 'GM', // optional
                targetID: 'sdk-trigger-id', // mandatory
                appName: 'consumerApp', // mandatory
                user: accounts[0], // mandatory
                chainId: 1, // mandatory
                viewOptions: {
                    type: 'sidebar', // optional [default: 'sidebar', 'modal']
                    showUnreadIndicator: true, // optional
                    unreadIndicatorColor: '#cc1919',
                    unreadIndicatorPosition: 'bottom-right',
                },
                theme: 'light',
                onOpen: () => {
                    console.log('-> client dApp onOpen callback');
                },
                onClose: () => {
                    console.log('-> client dApp onClose callback');
                }
            });
        }
    }

    async function broadcastMessage() {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        try {
            const apiResponse = await PushAPI.payloads.sendNotification({
                signer,
                type: 1, // broadcast
                identityType: 0, // minimal
                // identityType: 2, // direct payload
                notification: {
                    title: title,
                    body: body
                },
                payload: {
                    title: title,
                    body: body,
                },
                // recipients: '', // recipient address
                channel: `eip155:80001:${userId}`, // your channel address
                env: 'staging'
            });

            console.log(apiResponse)
        } catch (error) {
            console.log(error)
        }


    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "center"

        }}>
            <div style={{

            }}>
                {userInfo?.userData?.accountType != 1
                    ?
                    (showModal &&
                        <div style={{

                        }}
                        >
                            <div className="input-div">

                                <Typography variant="title1">Creator Broadcast</Typography>
                            </div>
                            <div className="input-div">

                                <Input
                                    label="Message Title"
                                    name="title"
                                    onChange={(e) => {
                                        e.preventDefault()
                                        setTitle(e.target.value)
                                    }}
                                />
                            </div>
                            <br></br>

                            <div className="input-div">
                                <TextArea
                                    label="Message Body"
                                    name="desc"
                                    onChange={(e) => {
                                        e.preventDefault()
                                        setBody(e.target.value)
                                    }}
                                    placeholder="Type your broadcast message body"
                                />


                            </div>

                            <br></br>

                            <div className="input-div">
                                <Button
                                    onClick={broadcastMessage}
                                    text="Send Message"
                                    theme="primary"
                                />
                            </div>

                        </div>
                    ) : null}
            </div>
            <div
                style={{
                    width: '60%'
                }}
            >
                <div className={classes.songpage_main}>
                    <h1>
                        {" "}
                        {console.log(userInfo)}
                        {userInfo?.userData?.accountType == 1
                            ? "Creator"
                            : "User"} Details{" "}
                    </h1>
                    <div className={classes.user1}>
                        <div className={classes.song_left}>
                            <div
                                style={{
                                    width: "250px",
                                }}
                            >
                                <Card
                                    onClick={function noRefCheck() { }}
                                    setIsSelected={function noRefCheck() { }}
                                >
                                    <div>
                                        <Illustration height="180px" logo="lazyNft" width="100%" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div className={classes.song_center}>
                            <div className={classes.labelss}>
                                <p>
                                    <Typography variant="H1">ID</Typography>
                                </p>
                                <p>
                                    <Typography variant="H1">Follower Count</Typography>
                                </p>
                                <p>
                                    <Typography variant="H1">Revenue Generated</Typography>
                                </p>
                            </div>
                            <div className={classes.details}>
                                <p
                                    style={{
                                        alignItems: "center",
                                        color: "#68738D",
                                        display: "flex",
                                        maxWidth: "220px",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {userId}
                                </p>

                                <p>
                                    {userInfo.userFollowersData
                                        ? userInfo?.userFollowersData?.length
                                        : "NA"}
                                </p>
                                <p>{userInfo ? userInfo?.userRevenueData.toNumber() : "NA"}</p>
                            </div>

                            <br />
                        </div>
                        <div className={classes.song_right}>
                            <Button
                                style={{
                                    margin: "20px 20px",
                                    padding: "10px 30px",
                                }}
                                isFullWidth
                                text="Follow"
                            //   onClick={followUser}
                            />
                            <Button
                                style={{
                                    margin: "20px 20px",
                                    padding: "10px 30px",
                                }}
                                isFullWidth
                                onClick={() => setShowModal(!showModal)}
                                text="Broadcast"
                            />
                            <Button
                                style={{
                                    margin: "20px 20px",
                                    padding: "10px 30px",
                                }}
                                isFullWidth
                                id="sdk-trigger-id"
                                text="Notifications"
                            />
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
                <TabList
                    defaultActiveKey={1}
                    onChange={function noRefCheck() { }}
                    tabStyle="bar"
                >
                    <Tab tabKey={1} tabName="My Content">
                        {userInfo?.uCD?.length == 0 && (
                            <h5 style={{ textAlign: "center", width: "100%" }}>
                                Nothing published yet...
                            </h5>
                        )}
                        <MediaItems mediaItems={userInfo?.uCD}></MediaItems>
                    </Tab>
                    <Tab tabKey={2} tabName="My Assets">
                        {userInfo?.uND?.length == 0 && (
                            <h5 style={{ textAlign: "center", width: "100%" }}>
                                Nothing published yet...
                            </h5>
                        )}
                        <MediaItems mediaItems={userInfo?.uND}></MediaItems>
                    </Tab>
                    <Tab tabKey={3} tabName="My Events">
                        {userInfo?.uED?.length == 0 && (
                            <h5 style={{ textAlign: "center", width: "100%" }}>
                                Nothing published yet...
                            </h5>
                        )}
                        <MediaItems mediaItems={userInfo?.uED}></MediaItems>
                    </Tab>
                </TabList>
            </div >
        </div>

    );
}
