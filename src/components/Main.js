import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Director, Publish } from '@millicast/sdk';

const Main = () => {
  const [isMuted, setIsMuted] = useState({ video: true, audio: true });
  const [stream, setStream] = useState({});
  const [cameras, setCameras] = useState([]);
  const [mics, setMics] = useState([]);
  const [selectedCam, setSelectedCam] = useState('');

  const videoRef = useRef();

  const streamName = 'ku6o96yu';
  const publishToken =
    '9a50a482ba1d738a620dcdc089c0a18a1dfa605fdedd8daa41e06199c5a53a85';

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter(device => device.kind === 'videoinput');
      setCameras(cameras);
    } catch (e) {
      console.log(e);
    }
  }

  async function getMics() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const mics = devices.filter(device => device.kind === 'audioinput');
      setMics(mics);
    } catch (e) {
      console.log(e);
    }
  }

  // const initialConstraints = { audio: true, video: true };
  // const cameraConstraints = {
  //   audio: true,
  //   video: { deviceId: { exact: selectedCam } },
  // };

  async function startBroadcast(selectedCam) {
    const tokenGenerator = () =>
      Director.getPublisher({
        token: publishToken,
        streamName,
      });
    // const initialConstraints = { audio: true, video: true };
    // const cameraConstraints = {
    //   audio: true,
    //   video: { deviceId: { exact: selectedCam } },
    // };

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
    // 비디오 요소에 src에 스트림 주입!
    videoRef.current.srcObject = mediaStream;
    console.log('미디어 스트림:', mediaStream);

    setStream(mediaStream);
    setIsMuted({ ...isMuted, video: false, audio: false });
  }

  const handleCamClick = () => {
    stream.getVideoTracks().forEach(track => (track.enabled = isMuted.video));
    setIsMuted({ ...isMuted, video: !isMuted.video, audio: isMuted.audio });
  };

  const handleMicClick = () => {
    stream.getAudioTracks().forEach(track => (track.enabled = isMuted.audio));
    setIsMuted({
      ...isMuted,
      video: isMuted.video,
      audio: !isMuted.audio,
    });
  };

  const changeCamera = e => {
    const { value } = e.target;
    console.log('카메라ID:', value);
    changeVideo(value);
  };

  const changeMics = e => {
    const { value } = e.target;
    console.log('카메ID:', value);
    changeSounds(value);
  };

  const changeVideo = selectedCam => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: selectedCam,
        },
      })
      .then(function (stream) {
        videoRef.current.srcObject = stream;
        setStream(stream);
      })
      .catch(function (err) {
        console.error('Error happens:', err);
      });
  };

  const changeSounds = selectedMic => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: selectedMic,
        },
      })
      .then(function (stream) {
        videoRef.current.srcObject = stream;
        setStream(stream);
      })
      .catch(function (err) {
        console.error('Error happens:', err);
      });
  };

  useEffect(() => {
    getCameras();
    getMics();
  }, []);

  return (
    <PlayerContainer>
      <Player ref={videoRef} autoPlay muted></Player>
      {/* todo/ 비디오 위에 버튼을 보이게 하기 */}
      <LiveStartBtn
        onClick={() => {
          startBroadcast();
        }}
      >
        방송시작
      </LiveStartBtn>
      <CamMuteBtn onClick={handleCamClick} isDisable={isMuted.video}>
        카메라
      </CamMuteBtn>
      <MicMuteBtn onClick={handleMicClick} isDisable={isMuted.audio}>
        오디오
      </MicMuteBtn>
      <SelectDevices onChange={e => changeCamera(e)}>
        {cameras.map((camera, id) => {
          return (
            <option key={id} value={camera.deviceId}>
              {camera.label}
            </option>
          );
        })}
      </SelectDevices>
      <SelectDevices onChange={e => changeSounds(e)}>
        {mics.map((mic, id) => {
          return (
            <option key={id} value={mic.deviceId}>
              {mic.label}
            </option>
          );
        })}
      </SelectDevices>
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

const SelectDevices = styled.select``;
