import React from "react";
import Link from "next/link";
import { Card, Illustration } from '@web3uikit/core';
import { useEffect, useState } from "react";

export default function Home() {
  const [loadingState, setLoadingState] = useState(true);
  const names = ['James', 'Paul', 'John', 'George', 'Ringo', 'James', 'Paul', 'John', 'George', 'Ringo', 'James', 'Paul', 'John', 'George', 'Ringo', 'James', 'Paul', 'John', 'George', 'Ringo', 'James', 'Paul', 'John', 'George', 'Ringo'];
  return (
    <div>
      <div className="home2">
        {names.map(name => (
          <div
            style={{
              width: '250px',
              padding: '20px'
            }}
          >
            <Card
              description="Create your own NFT Marketplace"
              onClick={function noRefCheck() { }}
              setIsSelected={function noRefCheck() { }}
              title={name}
              tooltipText="Create and earn money from your own NFT Marketplace"
            >
              <div>
                <Illustration
                  height="180px"
                  logo="marketplace"
                  width="100%"
                />
              </div>
            </Card>
          </div>))}
      </div>
    </div>
  )
}
