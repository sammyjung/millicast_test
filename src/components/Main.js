import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
// import MillicastMedia from './MillicastMedia';
import { Director, Publish } from '@millicast/sdk';

const Main = () => {
  const videoRef = useRef();

  const streamName = 'ku6o96yu';
  const accountId = 'CEANfN';
  const publishToken =
    '9a50a482ba1d738a620dcdc089c0a18a1dfa605fdedd8daa41e06199c5a53a85';

  async function startBroadcast() {
    const tokenGenerator = () =>
      Director.getPublisher({
        token: publishToken,
        streamName,
      });

    //Get User camera and microphone
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    //Create a new instance
    const millicastPublish = new Publish(streamName, tokenGenerator);

    //Start broadcast
    try {
      await millicastPublish.connect({ mediaStream });
    } catch (e) {
      console.log('Connection failed, handle error', e);
    }
    videoRef.current.srcObject = mediaStream;
    // console.log('미디어 스트림:', mediaStream);
  }

  useEffect(() => {
    startBroadcast();
  }, []);

  return (
    <PlayerContainer>
      <Player ref={videoRef} autoPlay muted></Player>
    </PlayerContainer>
  );
};
export default Main;

const PlayerContainer = styled.div`
  width: 100%;
  height: 600px;
`;

const Player = styled.video`
  width: 600px;
  height: 400px;
`;
