import Head from 'next/head';
import Link from 'next/link';
import { Button } from 'web3uikit';
import React from 'react';


export default function Home() {
  return (
    <a href='livestream/createStream'>
<button
      style={{
        position: 'absolute',
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#00b3b3',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    > GO LIVE! </button>
    </a>
  );
  
}

