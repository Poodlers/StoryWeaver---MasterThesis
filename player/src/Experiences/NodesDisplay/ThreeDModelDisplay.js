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
import GoToNextSlideButton from "./util/GoToNextSlideButton";
import Typewriter from "./util/TypeWriter";
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

  const character = threeDNode.data.character;
  const possibleNextNodes = props.possibleNextNodes;
  const [fileURL, setFileURL] = React.useState("");

  const backgroundFileInfo = threeDNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const [backgroundColor, setBackgroundColor] = React.useState("#A9B388");

  const [characterImg, setCharacterImg] = React.useState("");

  useEffect(() => {
    if (character.image.filename == "") {
      return;
    }
    if (character.image.inputType == "url") {
      setCharacterImg(character.image.filename);
    } else {
      repo.getFilePath(character.image.filename).then((url) => {
        setCharacterImg(url);
      });
    }
  }, [character]);

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
    <>
      <style>
        {`
       body{
        overflow: hidden;
       }
    `}
      </style>
      <Box
        sx={{
          width: "100%",
          height: isAR ? "100%" : "91vh",
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
        ) : (
          <Box
            sx={{
              width: "100%",
              zIndex: 0,
              backgroundColor: "transparent",
              minHeight: "95vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {name == "" ? null : (
              <>
                <img
                  src={characterImg}
                  alt={character.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "2px solid black",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    border: "2px solid black",
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: 20,
                      color: "black",
                      fontWeight: 200,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Typewriter text={name} delay={100} />
                  </Typography>
                </Box>
              </>
            )}
            {isAR ? (
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
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
                initialContent='<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1.3.0/dist/aframe-master.min.js"></script>
      </head><body><div></div></body></html>'
              >
                <a-scene>
                  {modelType == ThreeDModelTypes.gltf ? (
                    <a-entity
                      gltf-model={fileURL}
                      scale={scale.x + " " + scale.y + " " + scale.z}
                      position={
                        position.x + " " + position.y + " " + position.z
                      }
                      rotation={
                        rotation.x + " " + rotation.y + " " + rotation.z
                      }
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
                      position={
                        position.x + " " + position.y + " " + position.z
                      }
                    ></a-entity>
                  )}
                </a-scene>
              </Frame>
            )}
            <GoToNextSlideButton
              possibleNextNodes={possibleNextNodes}
              setNextNode={setNextNode}
            ></GoToNextSlideButton>
          </Box>
        )}
      </Box>
    </>
  );
}
