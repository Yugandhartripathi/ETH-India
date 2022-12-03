import React from "react";
import { Card, Avatar } from "@web3uikit/core";

function MediaItems(props) {
  // console.log("ind com",props)
  return (
    <div>
      {props.mediaItems.map((d, index) => (
        
        <div
        style={{
          width: "250px",
          padding: "20px",
        }}
        >
          {console.log("ind com", d)};
        <Card
          description={d.description}
          onClick={function noRefCheck() {}}
          setIsSelected={function noRefCheck() {}}
          title={d.title}
          tooltipText={d.isGated? "Buy NFT to gain access" : "Free"}
          
        >
          <Avatar
            image={d.coverURI}
            theme="image"
            size="230"
          />
        </Card>
      </div>
    ))}
    </div>
  );
}

export default MediaItems;
