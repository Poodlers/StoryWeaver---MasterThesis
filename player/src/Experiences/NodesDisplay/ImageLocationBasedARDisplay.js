import React, { useEffect } from "react";

export default function ImageLocationBasedDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const coords = props.coords;
  const src = props.src;

  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(600);

  const getMeta = (url, cb) => {
    const img = new Image();
    img.onload = () => cb(null, img);
    img.onerror = (err) => cb(err);
    img.src = url;
  };

  useEffect(() => {
    getMeta(src, (err, img) => {
      if (err) {
        console.error(err);
        return;
      }
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    });
  }, [src]);
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
          <img
            id="imageToLoad"
            src={src}
            preload="auto"
            crossOrigin="anonymous"
          />
        </a-assets>
        <a-box
          src="#imageToLoad"
          scale={`${scale.x * width} ${scale.y} ${scale.z * height}`}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          position={`${position.x} ${position.y} ${position.z}`}
          gps-new-entity-place={`latitude: ${coords.lat}; longitude: ${coords.lng}`}
        ></a-box>
      </a-scene>
    </>
  );
}
