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
      renderer="antialias: true; alpha: true; precision: medium;"
      embedded
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
    >
      <a-assets>
        <img id="image" src={src} preload="auto" crossOrigin="anonymous" />
      </a-assets>
      <a-nft
        type="nft"
        url={
          "https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/trex-image/trex"
        }
        smooth="true"
        smoothCount="10"
        smoothTolerance=".01"
        smoothThreshold="5"
      >
        <a-image
          src="#image"
          position={position.x + " " + position.y + " " + position.z}
          rotation={rotation.x + " " + rotation.y + " " + rotation.z}
          scale={scale.x + " " + scale.y + " " + scale.z}
          width="300"
          height="175"
        ></a-image>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
