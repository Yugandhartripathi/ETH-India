import React from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";
import { ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";

export default function Home() {
  const [loadingState, setLoadingState] = useState(true);
  return (
    <div>
    
      <div className="header_main">
        <div className="header_left">
          <Link href="/">
            <img src="/images/logo2.png" />
          </Link>
        </div>
        <div className="header_center">
          <button>UploadContent</button>
        </div>
        <div className="header_right">
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
      {loadingState?<p>Loading</p>:
      "Test"
    }
    </div>
  )
}
