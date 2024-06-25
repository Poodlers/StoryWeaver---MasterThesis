import React from "react";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import { useFrame } from "react-frame-component";

export default function VideoLocationBasedDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const coords = props.coords;
  const src = props.src;
  const [width, setVideoWidth] = React.useState(600);
  const [height, setVideoHeight] = React.useState(600);
  const { document, window } = useFrame();

  React.useEffect(() => {
    var v = document.getElementById("vid");
    v.addEventListener(
      "loadedmetadata",
      function (e) {
        setVideoWidth(this.videoWidth);
        setVideoHeight(this.videoHeight);
      },
      false
    );
  }, []);
  return (
    <>
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true"
      >
        <a-camera
          gps-new-camera="gpsMinDistance: 0.3"
          fov="80"
          position="0 0 0"
        ></a-camera>
        <a-assets>
          <video
            src={src}
            preload="auto"
            response-type="arraybuffer"
            id="vid"
            loop
            crossOrigin="anonymous"
            webkit-playsinline="true"
            muted={false}
            playsInline
            autoPlay
          ></video>
        </a-assets>
        <a-video
          look-at="[gps-new-camera]"
          gps-new-entity-place={`latitude: ${coords.lat}; longitude: ${coords.lng}`}
          src="#vid"
          width={width * scale.x}
          height={height * scale.z}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          position={`${position.x} ${position.y} ${position.z}`}
        ></a-video>
      </a-scene>
    </>
  );
}
