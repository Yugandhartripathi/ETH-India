import Link from 'next/link'
import { ConnectButton } from "web3uikit";


export default function Header() {
    return (
        <>
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
        </>
    )
}