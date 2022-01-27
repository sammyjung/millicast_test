import { useEffect, useRef } from 'react';
const RTCVideo = ({ mediaStream }) => {
  const videoRef = useRef();
  useEffect(() => {
    if (!videoRef.current || !mediaStream) return;
    videoRef.current.id = mediaStream.id;
    videoRef.current.srcObject = mediaStream ? mediaStream : null;
  }, [mediaStream]);

  return <video ref={videoRef} autoPlay controls muted />;
};

export default RTCVideo;
