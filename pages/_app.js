import React,{useState} from "react";
import Link from "next/link";

import ReactDOM from "react-dom/client";
import "./home.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

import classes from "./../styles/app.module.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className={classes.App}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          {/* <Link href="/"></Link> */}
          <Component

          />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp
