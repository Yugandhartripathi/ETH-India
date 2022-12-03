import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classes from "../../styles/songPage.module.css";
import { Card, Illustration, TabList, Tab, Typography, Button } from "web3uikit";
import MediaItems from "../../components/mediaitems";


export default function UserPage() {
    const router = useRouter();
    const { userId } = router.query;

    const mediaItems = []

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "80vw",
            margin: "auto auto"
        }}>
            <div className={classes.songpage_main}>

                <h1> User Details </h1>
                <div className={classes.user1}>
                    <div className={classes.song_left}>
                        <div
                            style={{
                                width: '250px'
                            }}
                        >
                            <Card
                                onClick={function noRefCheck() { }}
                                setIsSelected={function noRefCheck() { }}
                            >
                                <div>
                                    <Illustration
                                        height="180px"
                                        logo="lazyNft"
                                        width="100%"
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className={classes.song_center}>
                        <div className={classes.labelss}>
                            <p>

                                <Typography
                                    variant="H1"
                                >
                                    ID
                                </Typography>
                            </p>
                            <p>

                                <Typography
                                    variant="H1"
                                >
                                    Total Stake
                                </Typography>
                            </p>
                            <p>

                                <Typography
                                    variant="H1"
                                >
                                    Follower Count
                                </Typography>
                            </p>
                            <p>

                                <Typography
                                    variant="H1"
                                >
                                    Revenue Generated
                                </Typography>
                            </p>
                        </div>
                        <div className={classes.details}>
                            <p>{userId}</p>

                            <p>XYZ</p>
                            <p>420</p>
                            <p>69,420</p>
                        </div>

                        <br />
                    </div>
                    <div className={classes.song_right}>
                        <Button
                            style={{
                                margin: "20px 20px",
                                padding: "10px 30px"
                            }}
                            isFullWidth
                            text="Follow" />
                        <Button
                            style={{
                                margin: "20px 20px",
                                padding: "10px 30px"
                            }}
                            isFullWidth
                            text="Broadcast" />
                        <Button
                            style={{
                                margin: "20px 20px",
                                padding: "10px 30px"
                            }}
                            isFullWidth
                            text="Notifications" />
                    </div>
                </div>
            </div>
            <br></br><br></br>
            <TabList
                defaultActiveKey={1}
                onChange={function noRefCheck() { }}
                tabStyle="bar"
            >
                <Tab
                    tabKey={1}
                    tabName="My Assets"
                >
                    {mediaItems.length == 0 && (
                        <h5 style={{ textAlign: "center", width: "100%" }}>
                            Nothing published yet...
                        </h5>
                    )}
                    <MediaItems mediaItems={mediaItems}></MediaItems>

                </Tab>
                <Tab
                    tabKey={2}
                    tabName="My Content"
                >
                    {mediaItems.length == 0 && (
                        <h5 style={{ textAlign: "center", width: "100%" }}>
                            Nothing published yet...
                        </h5>
                    )}
                    <MediaItems mediaItems={mediaItems}></MediaItems>
                </Tab>
                <Tab
                    tabKey={3}
                    tabName="My Events"
                >
                    {mediaItems.length == 0 && (
                        <h5 style={{ textAlign: "center", width: "100%" }}>
                            Nothing published yet...
                        </h5>
                    )}
                    <MediaItems mediaItems={mediaItems}></MediaItems>
                </Tab>
            </TabList>
        </div>
    )
}