import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import VideoImageTrackingARDisplay from "./VideoImageTrackingARDisplay";
import ImageImageTrackingARDisplay from "./ImageImageTrackingARDisplay";
import ThreeDModelImageTrackingDisplay from "./ThreeDModelImageTrackingDisplay";
import Frame from "react-frame-component";
import TextImageTrackingARDisplay from "./TextImageTrackingARDisplay";

export default function ImageTrackingBasedARDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const markerSrc = props.markerSrc;
  const name = props.name;
  const position = props.position;
  const rotation = props.rotation;
  const scale = props.scale;
  const src = props.src;

  const entityType = props.entityType;
  const threeDModelType = props.threeDModelType;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Frame
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        initialContent='<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1.3.0/dist/aframe-master.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>
        <script
          type="text/javascript"
          src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"
        ></script>
        <script src="https://rawgit.com/donmccurdy/aframe-extras/master/dist/aframe-extras.loaders.min.js"></script>
        </head><body><div></div></body></html>'
      >
        {entityType == AREntityTypes.Video ? (
          <VideoImageTrackingARDisplay
            src={src}
            markerSrc={markerSrc}
            position={position}
            rotation={rotation}
            scale={scale}
          ></VideoImageTrackingARDisplay>
        ) : entityType == AREntityTypes.Image ? (
          <ImageImageTrackingARDisplay
            src={src}
            markerSrc={markerSrc}
            position={position}
            rotation={rotation}
            scale={scale}
          ></ImageImageTrackingARDisplay>
        ) : entityType == AREntityTypes.ThreeDModel ? (
          <ThreeDModelImageTrackingDisplay
            src={src}
            markerSrc={markerSrc}
            position={position}
            rotation={rotation}
            scale={scale}
          ></ThreeDModelImageTrackingDisplay>
        ) : entityType == AREntityTypes.Text ? (
          <TextImageTrackingARDisplay
            text={name}
            markerSrc={markerSrc}
            position={position}
            rotation={rotation}
            scale={scale}
          ></TextImageTrackingARDisplay>
        ) : (
          <div>Not supported</div>
        )}
      </Frame>
    </Box>
  );
}
