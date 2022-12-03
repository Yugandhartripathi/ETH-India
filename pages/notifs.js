import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { oasisAddress } from "./../config";
import Oasis from "./../artifacts/contracts/Oasis.sol/Oasis.json";

import * as PushAPI from "@pushprotocol/restapi";

import { Button } from "web3uikit";

import { EmbedSDK } from "@pushprotocol/uiembed";

export default function Home() {
    const [creatoraddrs, setcreatoraddrs] = useState([]);
    const [subsriptions, setSubscriptions] = useState([])
    const [account, setAccount] = useState("")


    useEffect(() => {
        getAddress()

        return () => {
            EmbedSDK.cleanup();
        };
    }, []);

    async function loadcreatoraddrs(acc) {
        const provider = new ethers.providers.JsonRpcProvider(
            "https://rpc-mumbai.maticvigil.com"
        );

        const contract = new ethers.Contract(oasisAddress, Oasis.abi, provider);
        const data = await contract.getAllMedia();

        const creatoraddrs = await Promise.all(
            data.map(async (i) => {
                return i.creator;
            })
        );
        let creators = [...new Set(creatoraddrs)];
        setcreatoraddrs(creators);
        await checkCreatorChannels(creators);
        await getSubscriptions(acc);
    }

    async function checkCreatorChannels(creators) {
        let values = await creators.reduce(async (acc, addr) => {
            const channelData = await PushAPI.channels.getChannel({
                channel: `eip155:80001:${addr}`, // channel address in CAIP
                env: 'staging'
            });
            if (!channelData) {
                return acc;
            }
            return (await acc).concat(channelData.channel);
        }, []);

        console.log(values)
        setcreatoraddrs(values)
    }

    async function getAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        let accounts = await provider.send("eth_requestAccounts", []);

        setAccount(accounts[0])

        if (accounts[0]) { // 'your connected wallet address'
            EmbedSDK.init({
                headerText: 'Hello DeFi', // optional
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
        await loadcreatoraddrs(accounts[0])
    }

    async function optIn(addr) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await PushAPI.channels.subscribe({
            signer: signer,
            channelAddress: `eip155:80001:${addr}`, // channel address in CAIP
            userAddress: `eip155:80001:${account}`, // user address in CAIP
            onSuccess: () => {
                console.log('opt in success');
            },
            onError: () => {
                console.error('opt in error');
            },
            env: 'staging'
        })
    }

    async function optOut(addr) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        await PushAPI.channels.unsubscribe({
            signer: signer,
            channelAddress: `eip155:80001:${addr}`, // channel address in CAIP
            userAddress: `eip155:80001:${account}`, // user address in CAIP
            onSuccess: () => {
                console.log('opt out success');
            },
            onError: () => {
                console.error('opt out error');
            },
            env: 'staging'
        })
    }


    async function getSubscriptions(acc) {
        const subs = await PushAPI.user.getSubscriptions({
            user: `eip155:80001:${acc}`,
            env: 'staging'
        });

        let subaddr = subs.map(a => a.channel)
        setSubscriptions(subaddr)
    }

    return (
        <div>
            {<div>
                {creatoraddrs.length == 0 && (
                    <h5 style={{ textAlign: "center", width: "100%" }}>
                        No creators yet...
                    </h5>
                )}
                {creatoraddrs.map((d) => {
                    if (subsriptions.includes(d)) {
                        return (
                            <div style={{
                                color: "white"
                            }}>
                                Subscribed {d} <Button onClick={() => optOut(d)} text="Opt Out" />
                            </div>
                        )
                    } else {
                        return (
                            <div style={{
                                color: "white"
                            }}>
                                Not Subscribed {d} <Button onClick={() => optIn(d)} text="Opt In" />
                            </div>
                        )
                    }
                })}
                <button id="sdk-trigger-id">trigger button</button>
            </div>
            }

        </div>
    );
}
