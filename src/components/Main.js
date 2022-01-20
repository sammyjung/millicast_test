import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import MillicastMedia from './MillicastMedia';
import { Director, Publish } from '@millicast/sdk';

const Main = () => {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [stream, setStream] = useState({});
  const videoRef = useRef();

  const streamName = 'ku6o96yu';
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
    setStream(mediaStream);
    // 비디오 요소에 src에 스트림 주입!
    videoRef.current.srcObject = mediaStream;

    setIsVideoMuted(false);
    setIsAudioMuted(false);
  }

  const handleCamClick = () => {
    stream.getVideoTracks().forEach(track => (track.enabled = isVideoMuted));
    setIsVideoMuted(!isVideoMuted);
  };

  const handleMicClick = () => {
    stream.getAudioTracks().forEach(track => (track.enabled = isAudioMuted));
    setIsAudioMuted(!isAudioMuted);
  };

  useEffect(() => {}, []);

  return (
    <PlayerContainer>
      <Player ref={videoRef} autoPlay muted></Player>
      {/* todo/ 비디오 위에 버튼을 보이게 하기 */}
      <LiveStartBtn onClick={startBroadcast}>방송시작</LiveStartBtn>
      <CamMuteBtn onClick={handleCamClick} isDisable={isVideoMuted}>
        카메라
      </CamMuteBtn>
      <MicMuteBtn onClick={handleMicClick} isDisable={isAudioMuted}>
        오디오
      </MicMuteBtn>
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

const CamMuteBtn = styled.button`
  color: ${props => (props.isDisable ? 'red' : 'blue')};
`;

const MicMuteBtn = styled.button`
  color: ${props => (props.isDisable ? 'red' : 'blue')};
`;

const LiveStartBtn = styled.button``;
