import React from "react";
// import Link from "next/link";
// import { BiSearch } from "react-icons/bi";
// import { AiOutlineHome } from "react-icons/ai";
// import { RiMoneyDollarCircleLine } from "react-icons/ri";
// import { IoPersonOutline } from "react-icons/io5";
// import { ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
// import { MdLibraryMusic } from "react-icons/md";
// import { ethers } from "ethers";
// import axios from "axios";
import AddMediaForm from "./components/addmedia/addmediaform";
// import sha256 from "./helperfunctions/hash";
// import { marketplaceAddress } from "./../../backend/config";
// import NFTMarketplace from "./../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
// import Song from "./components/songs/songs";
import { useRouter } from "next/router";
// import Loader from "./components/loader";

function Addnewmedia() {
  let router = useRouter();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingState(false);
    }, 2000);
  }, []);

  return (
    <div className="home2">
      {loadingState ? (
        <p>Loading...</p>
      ) : (
        <AddMediaForm setLoadingState={setLoadingState} />
      )}
    </div>
  );
}

export default Addnewmedia;
