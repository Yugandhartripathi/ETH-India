import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Player } from '@livepeer/react';


export async function getServerSideProps() {
  const res = await fetch(`https://livepeer.studio/api/stream?streamsonly=1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
  } );
  
  const data = await res.json();

  return {
    props: {
      streams: data
    },
  };
}

export default function GetStreams({streams}) {
  
  
  
  return (
    <main >
      <h1 >All Streams</h1>
      
      <ul>
        {console.log(typeof streams, streams)}
        {/* {streams.map((stream) => (
          <div className={styles.card} key={stream.id}>
            <Link href={`/streams/${stream.id}`}>
              <a>
                { stream.isActive ? (
                  <div>
                    <h2 className={ styles.title }> Now Watching: { stream.name } </h2>
                    <Player
                      playbackId={ `${ stream.playbackId }` }
                      className={ styles.videoplayer }
                      autoPlay={ false }
                      loop
                      muted
                    />
                  </div>
                ) : null
                }
                <h2 className={styles.title2}> {stream.name} </h2>
                <p>Stream Status:</p>
                {stream.isActive ? <p className={styles.ready}>Live Now!</p> : <p className={styles.failed}>Not Live</p>}
              </a>
            </Link>
          </div>
        ))} */}
      </ul>
    </main>
  );
}
