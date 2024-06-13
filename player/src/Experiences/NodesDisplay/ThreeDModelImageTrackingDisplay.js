import { Box, Typography } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect } from "react";

export default function ThreeDModelImageTrackingDisplay(props) {
  const position = props.position || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const src = props.src;
  const markerSrc = props.markerSrc;
  console.log("markerSrc", markerSrc);
  return (
    <div>
      <div className="arjs-loader">
        <div>Loading, please wait...</div>
      </div>
      <a-scene
        vr-mode-ui="enabled: false;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true; precision: medium;"
      >
        <a-text
          value="Hello, AR.js!"
          position="3 5 -10"
          scale="2 2 2"
          rotation="0 0 0"
        ></a-text>

        <a-nft
          videohandler
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
          <a-entity
            gltf-model={src}
            scale={`${scale.x} ${scale.y} ${scale.z}`}
            position={`${position.x} ${position.y} ${position.z}`}
            rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          ></a-entity>
        </a-nft>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
}
