import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Director, View } from '@millicast/sdk';

const Viewer = () => {
  const videoRef = useRef();

  async function startUserBroad() {
    const streamName = 'ku6o96yu';
    const accountId = 'CEANfN';

    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountId,
      });

    const millicastView = new View(
      streamName,
      tokenGenerator,
      videoRef.current
    );
    // millicastView.on('track', event => {
    //   console.log(event);
    // });

    //Start connection to publisher
    try {
      await millicastView.connect({
        events: ['active', 'inactive'],
      });
    } catch (e) {
      console.log('Connection failed, handle error', e);
    }
  }

  useEffect(() => {
    startUserBroad();
  }, []);

  return (
    <PlayerContainer>
      <Player ref={videoRef} autoPlay />
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
