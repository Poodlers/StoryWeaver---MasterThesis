import React from "react";

export default function TextImageTrackingARDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const markerSrc = props.markerSrc;
  const text = props.text;
  const textColor = props.textColor.color || "#000000";

  return (
    <a-scene
      vr-mode-ui="enabled: false;"
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
      renderer="antialias: true; alpha: true; precision: medium;"
    >
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
        <a-text
          value={text}
          color={textColor}
          position={`${position.x} ${position.y} ${position.z}`}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          scale={`${scale.x} ${scale.y} ${scale.z}`}
          side="double"
        ></a-text>
      </a-nft>
      <a-entity camera></a-entity>
    </a-scene>
  );
}
