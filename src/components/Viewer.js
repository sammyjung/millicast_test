import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RTCVideo from './RTCVideo';
import { Director, View } from '@millicast/sdk';

const Viewer = () => {
  const [stream, setStream] = useState();

  async function startUserBroad() {
    const streamName = 'ku6o96yu';
    const accountId = 'CEANfN';

    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountId,
      });

    const millicastView = new View(streamName, tokenGenerator, null, true);

    millicastView.on('track', event => {
      // setStream(event.streams[0]);
      console.log('stream added');
      setStream(event.streams[0]);
    });
    console.log('stream', stream);

    try {
      console.log('connect view');
      await millicastView.connect({
        events: ['track'],
      });
    } catch (e) {
      console.log('Connection failed, handle error', e);
      // setTimeout(startUserBroad(), 10000);
    }
  }

  useEffect(() => {
    startUserBroad();
  }, []);

  return (
    <PlayerContainer>
      <RTCVideo mediaStream={stream} />
    </PlayerContainer>
  );
};

export default Viewer;

const PlayerContainer = styled.div`
  width: 100%;
  height: 600px;
`;

const Player = styled.video`
  width: 600px;
  height: 400px;
`;
