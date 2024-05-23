import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

export default function LocationBasedARDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const map = props.map;
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
        console.log(coords);
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  });

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
            arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
            renderer="antialias: true; alpha: true"
          >
            <a-camera
              gps-camera
              rotation-reader
              gps-new-camera="gpsMinDistance: 0.5"
            ></a-camera>
            {entityType === AREntityTypes.Text ? (
              <a-text
                value={src}
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
                  gltf-model={"src: " + src}
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale="10 10 10"
                  position={position.x + " " + position.y + " " + position.z}
                ></a-entity>
              ) : threeDModelType === ThreeDModelTypes.obj ? (
                <a-entity
                  obj-model={
                    "obj: " + src + "; " + "mtl: " + src.replace(".obj", ".mtl")
                  }
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale="10 10 10"
                  position={position.x + " " + position.y + " " + position.z}
                ></a-entity>
              ) : threeDModelType === ThreeDModelTypes.fbx ? (
                <a-entity
                  fbx-model={"src: " + src}
                  gps-new-entity-place={
                    "latitude: " + coords.lat + ";" + "longitude: " + coords.lng
                  }
                  scale="10 10 10"
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
