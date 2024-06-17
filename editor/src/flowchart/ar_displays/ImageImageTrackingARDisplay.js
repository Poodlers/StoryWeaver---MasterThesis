import React, { useEffect } from "react";

export default function ImageImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;
  const [naturalWidth, setNaturalWidth] = React.useState(0);
  const [naturalHeight, setNaturalHeight] = React.useState(0);
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
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
    });
  }, [src]);
  return (
    <a-scene
      vr-mode-ui="enabled: false;"
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
      renderer="antialias: true; alpha: true; precision: medium;"
    >
      <a-assets>
        <img
          id="imageToLoad"
          src={src}
          preload="auto"
          crossOrigin="anonymous"
        />
      </a-assets>
      <a-nft
        type="nft"
        url={
          markerSrc.includes("http://")
            ? "https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
            : markerSrc
        }
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5"
      >
        <a-box
          src="#imageToLoad"
          scale={`${scale.x * naturalWidth} ${scale.y} ${
            scale.z * naturalHeight
          }`}
          position={`${position.x} ${position.y} ${position.z}`}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
        ></a-box>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
