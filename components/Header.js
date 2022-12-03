import Link from 'next/link'
import { ConnectButton } from "web3uikit";
import { Button } from '@web3uikit/core';



export default function Header() {
    return (
        <>
            <div className="header_main">
                <div className="header_left">
                    <Link href="/">
                        <img src="/images/logo2.png" />
                    </Link>
                </div>
                <Link href="/addnewmedia">
                    <Button
                        onClick={function noRefCheck() { }}
                        text="Upload Content"
                        theme="outline"
                        style={{
                            marginLeft: '10px'
                        }}
                        size='large'
                    />
                </Link>
                <Link href="/addnewmedia">
                    <Button
                        onClick={function noRefCheck() { }}
                        text="Upload Content"
                        theme="outline"
                        style={{
                            marginLeft: '10px'
                        }}
                        size='large'
                    />
                </Link>
                <Link href="/addnewmedia">
                    <Button
                        onClick={function noRefCheck() { }}
                        text="Upload Content"
                        theme="outline"
                        style={{
                            marginLeft: '10px'
                        }}
                        size='large'
                    />
                </Link>
                <div className="header_right">
                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </>
    )
}