import React from "react";
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
        <div>
          <Link href="/addnewmedia">
            <div className="upload_button ">
              <p>Upload Content</p>
            </div>
          </Link>
        </div>
        <div>
          <Link href="/addnewmedia">
            <div className="upload_button ">
              <p>Upload Content</p>
            </div>
          </Link>
        </div>
        <div>
          <Link href="/addnewmedia">
            <div className="upload_button ">
              <p>Upload Content</p>
            </div>
          </Link>
        </div>
        <div className="header_right">
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </div>
  )
}
