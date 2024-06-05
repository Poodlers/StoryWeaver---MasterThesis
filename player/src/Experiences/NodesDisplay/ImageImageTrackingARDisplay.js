import React from "react";

export default function ImageImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;

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
        <a-box src="#imageToLoad" scale="200 1 200" position="0 10 0"></a-box>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
