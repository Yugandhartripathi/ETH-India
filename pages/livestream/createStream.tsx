import { FormEvent, useState } from 'react'
import Router, { useRouter } from 'next/router';
import ReactPlayer from "react-player";
import { red } from 'bn.js';



export default function CreateStream() {

  const router = useRouter();
  const [ streamName, setStreamName ] = useState<string>( '' );
  const profiles = [
    {
      name: '720p',
      bitrate: 2000000,
      fps: 30,
      width: 1280,
      height: 720,
    },
    {
      name: '480p',
      bitrate: 1000000,
      fps: 30,
      width: 854,
      height: 480,
    },
    {
      name: '360p',
      bitrate: 500000,
      fps: 30,
      width: 640,
      height: 360,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [streamData, setStreamData] = useState(null);

  async function createNewStream( e: FormEvent ) {
    setIsLoading(true);
    e.preventDefault();
  try {
    const response = await fetch('/api/createStream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: streamName,
        profiles,
      }),
    }); 
    
    setStreamName( '' );
    const data = await response.json();
    console.log(data)
    setStreamData(data)
  } catch (error) {
    // console.log(error);
  }
  finally {
    setIsLoading(false);
  }
}
//Live rtmp://rtmp.livepeer.com/live/

  return (
    <div style={{
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '90vh'
    }}>
      <h1 style= {{
        color:'white',
        alignSelf: 'center'
      }}>Create a New Stream</h1>
      <form style={{
        color: 'white'
      }}onSubmit={createNewStream} method='POST' >
        <label htmlFor='stream'>Stream Name: </label>
        <input
          className='border rounded-md text-base mx-2'
          type='text'
          value={streamName}
          name='name'
          required
          onChange={(e) => setStreamName(e.target.value)}
        />
        <br />
        <button type='submit' 
        style={{
        margin: '20px',
        position: 'relative',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#00b3b3',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>Create Stream</button>
      </form>
      {isLoading && <p style= {{color:'white'}}>Loading...</p>}
      {streamData!=null && <div style= {{ display: 'flex', flexDirection: 'row', alignItems: 'self-end'}}><div  style= {{ display: 'flex', flexDirection: 'column' }}>
        <p style= {{color:'white'}}>Here is your streamKey: {streamData.streamKey}</p>
        <p style= {{color:'white'}}>Server URL: rtmp://rtmp.livepeer.com/live/</p>
        <p style= {{color:'white'}}>Your streamlink </p>
        <p></p>
        <ReactPlayer url={`https://cdn.livepeer.com/hls/${streamData.playbackId}/index.m3u8`} />
        </div></div>}
        // live stream
    </div>
  );
}