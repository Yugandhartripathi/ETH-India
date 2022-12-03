import React, { useRef } from 'react'
import HLS from 'react-hls';

function Live() {
    const playerRef = useRef(null);
    return (
        <HLS
            ref={playerRef}
            url="https://cdn.livepeer.com/hls/0efey7a5s67ha39v/index.m3u8"
            autoPlay
        />
    )
}

export default Live
