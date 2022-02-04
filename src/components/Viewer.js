import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RTCVideo from './RTCVideo';
import { Director, View } from '@millicast/sdk';

const Viewer = () => {
  const [stream, setStream] = useState();

  async function startUserBroad() {
    const streamName = 'workshop-stream-45';
    const accountId = 'CEANfN';

    const tokenGenerator = () =>
      Director.getSubscriber({
        streamName: streamName,
        streamAccountId: accountId,
        subscriberToken:
          '7261cc27294d128e19ecdc9f631b38af48f989cbaff445318adf41d9b12382f7',
      });

    const millicastView = new View(streamName, tokenGenerator, null, true);

    millicastView.on('track', event => {
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
