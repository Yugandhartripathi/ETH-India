import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import * as PushAPI from "@pushprotocol/restapi";

import { Button, Input, TextArea, Typography } from "web3uikit";

export default function Home() {
    const [isCreator, setIsCreator] = useState(false)
    const [account, setAccount] = useState("")

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    useEffect(() => {
        getAddress()
    }, []);

    async function checkCreator(acc) {
        let data = await PushAPI.channels.getChannel({
            channel: `eip155:80001:${acc}`,
            env: 'staging'
        })
        if (data) {
            console.log(data)
            setAccount(data.channel)
            setIsCreator(true)
        }
    }

    async function getAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        let accounts = await provider.send("eth_requestAccounts", []);

        await checkCreator(accounts[0])
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
                channel: `eip155:80001:${account}`, // your channel address
                env: 'staging'
            });

            console.log(apiResponse)
        } catch (error) {
            console.log(error)
        }


    }

    return (
        <div className="form" style={{
            marginTop: 60
        }}>
            {isCreator ?
                <div style={{
                    color: "white"
                }}>
                    I am creator
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

                </div> : <div>
                    <h5 style={{ textAlign: "center", width: "100%", color: "white" }}>
                        Not a creator yet...
                    </h5>
                </div>
            }

        </div>
    );
}
