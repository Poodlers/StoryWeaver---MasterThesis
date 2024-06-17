import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import Frame from "react-frame-component";
import TextLocationBasedDisplay from "./TextLocationBasedDisplay";
import ImageLocationBasedDisplay from "./ImageLocationBasedARDisplay";
import ThreeDLocationBasedDisplay from "./ThreeDLocationBasedDisplay";
import VideoLocationBasedDisplay from "./VideoLocationBasedARDisplay";

export default function LocationBasedARDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const map = props.map;
  const name = props.name;
  const place = props.place;
  const position = props.position || { x: 0, y: 0, z: 0 };
  const rotation = props.rotation || { x: 0, y: 0, z: 0 };
  const scale = props.scale || { x: 1, y: 1, z: 1 };
  const src = props.src;
  const autoplay = props.autoplay;
  const color = props.color;

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
  const entityType = props.entityType;
  const threeDModelType = props.threeDModelType;

  const [coords, setCoords] = React.useState({ lat: 0, lng: 0 });

  useEffect(() => {
    repo
      .getMapPlaceCoords(map, place)
      .then((coords) => {
        setCoords(coords);
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  }, []);

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
      {componentState === ComponentState.LOADING ? (
        <div>Loading...</div>
      ) : componentState === ComponentState.ERROR ? (
        <div>Error loading map</div>
      ) : (
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

          {entityType === AREntityTypes.Text ? (
            <TextLocationBasedDisplay
              position={position}
              scale={scale}
              rotation={rotation}
              coords={coords}
              text={name}
              textColor={color}
            ></TextLocationBasedDisplay>
          ) : entityType === AREntityTypes.Image ? (
            <ImageLocationBasedDisplay
              position={position}
              scale={scale}
              rotation={rotation}
              coords={coords}
              src={src}
            ></ImageLocationBasedDisplay>
          ) : entityType === AREntityTypes.ThreeDModel ? (
            <ThreeDLocationBasedDisplay
              position={position}
              scale={scale}
              rotation={rotation}
              coords={coords}
              src={src}
              threeDModelType={threeDModelType}
              autoplay={autoplay}
            ></ThreeDLocationBasedDisplay>
          ) : entityType === AREntityTypes.Video ? (
            <VideoLocationBasedDisplay
              position={position}
              scale={scale}
              rotation={rotation}
              coords={coords}
              src={src}
            ></VideoLocationBasedDisplay>
          ) : null}
        </Frame>
      )}
    </Box>
  );
}
