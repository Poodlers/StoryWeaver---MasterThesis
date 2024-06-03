import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

export default function LocationBasedARDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const map = props.map;
  const name = props.name;
  const place = props.place;
  const position = props.position;
  const scale = props.scale;
  const src = props.src;

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
        <div>
          <a-scene
            vr-mode-ui="enabled: false"
            arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
            renderer="antialias: true; alpha: true"
          >
            <a-camera
              gps-camera
              rotation-reader
              gps-new-camera={
                "gpsMinDistance: 0.5; simulateLatitude:" +
                coords.lat +
                "; simulateLongitude: " +
                coords.lng
              }
            ></a-camera>
            <Typography
              variant="h4"
              sx={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: "1",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "5px",
              }}
            >
              {name}
            </Typography>
            {entityType === AREntityTypes.Text ? (
              <a-text
                value={name}
                look-at="[gps-camera]"
                scale={scale.x + " " + scale.y + " " + scale.z}
                gps-new-entity-place={
                  "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                }
              ></a-text>
            ) : entityType === AREntityTypes.Image ? (
              <>
                <a-assets>
                  <img id="transpImage" src={src}></img>
                </a-assets>
                <a-image
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  width="1"
                  height="1"
                  src="#transpImage"
                ></a-image>
              </>
            ) : entityType === AREntityTypes.ThreeDModel ? (
              threeDModelType === ThreeDModelTypes.gltf ? (
                <a-entity
                  gltf-model-next={"src: url(" + src + ");"}
                  animation-mixer
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale={scale.x + " " + scale.y + " " + scale.z}
                  position={position.x + " " + position.y + " " + position.z}
                ></a-entity>
              ) : threeDModelType === ThreeDModelTypes.obj ? (
                <a-entity
                  obj-model={
                    "obj: " +
                    src +
                    "; " +
                    "mtl: " +
                    src.replace(".obj", ".mtl") +
                    ";"
                  }
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale={scale.x + " " + scale.y + " " + scale.z}
                  position={position.x + " " + position.y + " " + position.z}
                ></a-entity>
              ) : threeDModelType === ThreeDModelTypes.fbx ? (
                <a-entity
                  fbx-model={"src: " + src}
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale={scale.x + " " + scale.y + " " + scale.z}
                  position={position.x + " " + position.y + " " + position.z}
                ></a-entity>
              ) : null
            ) : entityType === AREntityTypes.Video ? (
              <>
                <a-assets>
                  <video
                    id="waterVideo"
                    loop="false"
                    autoplay="false"
                    src={src}
                    preload="auto"
                  ></video>
                </a-assets>
                <a-video
                  look-at="[gps-camera]"
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  id="water"
                  src="#waterVideo"
                  height="2"
                  width="1"
                  position="0 1 0"
                  autoplay="false"
                ></a-video>
              </>
            ) : null}
          </a-scene>
        </div>
      )}
    </Box>
  );
}
