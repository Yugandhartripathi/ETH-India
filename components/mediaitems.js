import React from "react";
import { Card, Illustration } from "@web3uikit/core";

function MediaItems(props) {
  return (
    <div>
      {props.mediaItems.map((d, index) => (
        <div
        style={{
          width: "250px",
          padding: "20px",
        }}
        >
        <Card
          description={d.description}
          onClick={function noRefCheck() {}}
          setIsSelected={function noRefCheck() {}}
          title={d.title}
          tooltipText={d.isGated? "Buy NFT to gain access" : "Free"}
        >
          <div>
            <Illustration height="180px" logo="marketplace" width="100%" />
          </div>
        </Card>
      </div>
    ))}
    </div>
  );
}

export default MediaItems;
