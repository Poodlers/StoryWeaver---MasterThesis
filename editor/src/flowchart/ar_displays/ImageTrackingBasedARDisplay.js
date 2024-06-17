import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { AREntityTypes } from "../../models/AREntityTypes";
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
  const autoplay = props.autoplay;
  const color = props.color;
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
        <>
          <style>
            {`
          .arjs-loader {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
          
          }

          .arjs-loader div {
            text-align: center;
            font-size: 50px !important;
            font-family: 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            color: white;
          }
          `}
          </style>
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
              autoplay={autoplay}
              threeDModelType={threeDModelType}
            ></ThreeDModelImageTrackingDisplay>
          ) : entityType == AREntityTypes.Text ? (
            <TextImageTrackingARDisplay
              text={name}
              markerSrc={markerSrc}
              position={position}
              rotation={rotation}
              scale={scale}
              textColor={color}
            ></TextImageTrackingARDisplay>
          ) : (
            <div>Not supported</div>
          )}
        </>
      </Frame>
    </Box>
  );
}
