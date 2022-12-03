import React from "react";
import { Card, Avatar, Button } from "@web3uikit/core";
import Link from "next/link";

function MediaItems(props) {
  // console.log("ind com",props)
  return (
    <div className="home2">
      {props.mediaItems.map((d, index) => (
        <div
          style={{
            width: "250px",
            padding: "20px",
          }}
        >
          {console.log(index, d)}
          <Link href={`/mediaItems/${d.mediaId}`}>
            <Card
              onClick={function noRefCheck() {}}
              tooltipText={d.isGated ? "Buy NFT to gain access" : "Free"}
            >
              <div>
                <Avatar image={d.coverURI} theme="image" size="230" isRounded />

                <br />

                <div
                  style={{
                    alignItems: "center",
                    color: "#0B0B45",
                    fontWeight: 600,
                    fontSize: "1.3rem",
                    display: "flex",
                  }}
                >
                  {d.title}
                </div>

                <div
                  style={{
                    alignItems: "center",
                    color: "#68738D",
                    display: "flex",
                    maxWidth: "220px",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  @{d.creator}
                </div>
                <div
                  style={{
                    alignItems: "center",
                    color: "#68738D",
                    color: "#041836",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    display: "flex",
                  }}
                >
                  Availability {d.availableCount}/{d.tokenCount}
                </div>
                <div
                  style={{
                    alignItems: "center",
                    color: "#041836",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    display: "flex",
                  }}
                >
                  Media Type : {d.mediaType}
                </div>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MediaItems;
