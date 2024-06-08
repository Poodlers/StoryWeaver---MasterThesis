import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, secondaryColor, textColor } from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ComponentState } from "../../models/ComponentState";
import {
  BlobReader,
  BlobWriter,
  fs,
  TextReader,
  ZipReader,
} from "@zip.js/zip.js";
import Frame from "react-frame-component";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
const { FS } = fs;

export default function ThreeDModelDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const threeDNode = props.node;
  const file = threeDNode.data.file;
  const position = threeDNode.data.position;
  const scale = threeDNode.data.scale;
  const rotation = threeDNode.data.rotation;
  const name = threeDNode.data.name;
  const isAR = threeDNode.data.ar;
  const modelType = file.modelType;
  const ARTypeInfo = threeDNode.data.ar_type;
  const possibleNextNodes = props.possibleNextNodes;
  const [fileURL, setFileURL] = React.useState("");

  const backgroundFileInfo = threeDNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const [backgroundColor, setBackgroundColor] = React.useState("#A9B388");

  useEffect(() => {
    if (backgroundFileInfo.inputType == "color") {
      setBackgroundColor(backgroundFileInfo.color);
      setBackgroundURL("");
      return;
    }
    if (backgroundFileInfo.filename == "") {
      setBackgroundURL("");
      return;
    }
    if (backgroundFileInfo.inputType == "url") {
      setBackgroundURL(backgroundFileInfo.filename);
    } else {
      repo
        .getFilePath(backgroundFileInfo.filename)
        .then((url) => {
          setBackgroundURL(url);
        })
        .catch(() => {
          setBackgroundURL("");
        });
    }
  }, [backgroundFileInfo]);
  useEffect(() => {
    if (file.inputType === "url") {
      setFileURL(file.filename);
      setComponentState(ComponentState.LOADED);
      return;
    }
    repo.getThreeDModelPath(file.filename, modelType).then((path) => {
      setFileURL(path);
      setComponentState(ComponentState.LOADED);
    });
  }, []);

  const setNextNode = props.setNextNode;

  return (
    <Box
      sx={{
        width: "100%",
        height: isAR ? "100%" : "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          backgroundURL == ""
            ? backgroundColor
            : `${backgroundColor} url(${backgroundURL}) no-repeat center center  fixed`,
        backgroundSize: "cover",
      }}
    >
      {componentState === ComponentState.LOADING ? (
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Loading...
        </Typography>
      ) : componentState === ComponentState.ERROR ? (
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          Error loading
        </Typography>
      ) : isAR ? (
        ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
          <LocationBasedARDisplay
            name={name}
            src={fileURL}
            map={ARTypeInfo.map}
            place={ARTypeInfo.place}
            tolerance={ARTypeInfo.tolerance}
            position={position}
            scale={scale}
            entityType={AREntityTypes.ThreeDModel}
            threeDModelType={modelType}
          />
        ) : (
          <ImageTrackingBasedARDisplay
            name={name}
            markerSrc={ARTypeInfo.image}
            src={fileURL}
            position={position}
            scale={scale}
            entityType={AREntityTypes.ThreeDModel}
            threeDModelType={modelType}
          />
        )
      ) : (
        <Frame
          style={{
            width: "100%",
            height: "100%",
          }}
          initialContent='<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1.3.0/dist/aframe-master.min.js"></script>
      </head><body><div></div></body></html>'
        >
          <a-scene>
            {modelType == ThreeDModelTypes.gltf ? (
              <a-entity
                gltf-model={fileURL}
                scale={scale.x + " " + scale.y + " " + scale.z}
                position={position.x + " " + position.y + " " + position.z}
                rotation={rotation.x + " " + rotation.y + " " + rotation.z}
              ></a-entity>
            ) : (
              <a-entity
                obj-model={
                  "obj: " +
                  fileURL +
                  "; " +
                  "mtl: " +
                  fileURL.replace(".obj", ".mtl") +
                  ";"
                }
                scale={scale.x + " " + scale.y + " " + scale.z}
                position={position.x + " " + position.y + " " + position.z}
              ></a-entity>
            )}
          </a-scene>
        </Frame>
      )}
      <ButtonBase
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          position: "absolute",
          bottom: "10vh",
          right: 10,
        }}
        onClick={() => {
          setNextNode(possibleNextNodes[0]);
        }}
      >
        <Typography variant="h4">Avançar</Typography>
      </ButtonBase>
    </Box>
  );
}
