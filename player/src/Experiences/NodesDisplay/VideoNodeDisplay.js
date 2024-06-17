import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, secondaryColor, textColor } from "../../themes";
import ReactPlayer from "react-player";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import GoToNextSlideButton from "./util/GoToNextSlideButton";
import Typewriter from "./util/TypeWriter";

export default function VideoNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const videoNode = props.node;
  const title = videoNode.data.name;
  const fileInfo = videoNode.data.file;
  const possibleNextNodes = props.possibleNextNodes;
  const [url, setUrl] = React.useState("");
  const setNextNode = props.setNextNode;
  const experienceName = props.experienceName;
  const ARTypeInfo = videoNode.data.ar_type;
  const isAR = videoNode.data.ar;
  const position = videoNode.data.position;
  const scale = videoNode.data.scale;
  const character = videoNode.data.character;
  const backgroundFileInfo = videoNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const [markerSrc, setMarkerSrc] = React.useState("");

  const [backgroundColor, setBackgroundColor] = React.useState("#A9B388");

  const [characterImg, setCharacterImg] = React.useState("");

  useEffect(() => {
    if (!isAR) return;
    if (ARTypeInfo.trigger_mode == ARTriggerMode.QRCode) {
      repo.getFilePath(ARTypeInfo.qr_code).then((url) => {
        setMarkerSrc(url);
      });
    } else {
      if (ARTypeInfo.image.inputType == "url") {
        setMarkerSrc(ARTypeInfo.image.filename);
      } else {
        repo
          .getFilePath(ARTypeInfo.image.filename.split(".")[0])
          .then((url) => {
            setMarkerSrc(url);
          });
      }
    }
  }, [ARTypeInfo]);

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
    if (fileInfo.inputType == "file") {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setUrl(path);
          console.log("Video URL: " + path);
          setComponentState(ComponentState.LOADED);
        })
        .catch((error) => {
          setComponentState(ComponentState.ERROR);
        });
    } else {
      setUrl(fileInfo.filename);
    }
  }, []);

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
        <style>
          {`
          video {
            max-height: 80%;
          }

          `}
        </style>
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
              minHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: isAR ? "start" : "center",
              alignItems: "center",
            }}
          >
            {title == "" ? null : (
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
                    <Typewriter text={title} delay={100} />
                  </Typography>
                </Box>
              </>
            )}
            {isAR ? (
              ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
                <LocationBasedARDisplay
                  name={title}
                  src={url}
                  map={ARTypeInfo.map}
                  place={ARTypeInfo.place}
                  tolerance={ARTypeInfo.tolerance}
                  position={position}
                  scale={scale}
                  entityType={AREntityTypes.Video}
                />
              ) : (
                <ImageTrackingBasedARDisplay
                  name={title}
                  markerSrc={markerSrc}
                  src={url}
                  position={position}
                  scale={scale}
                  entityType={AREntityTypes.Video}
                />
              )
            ) : (
              <>
                <ReactPlayer
                  style={{
                    marginTop: "10px",
                    maxHeight: "75%",
                  }}
                  onError={(e) => {
                    if (fileInfo.inputType == "file") {
                      repo.getFile(fileInfo.filename).then((blob) => {
                        setUrl(URL.createObjectURL(blob));
                      });
                    } else {
                      setComponentState(ComponentState.ERROR);
                    }
                  }}
                  url={url}
                  width={"90%"}
                  maxWidth={"90%"}
                  maxHeight={"60vh"}
                  height={"auto"}
                  controls={true}
                  playing={false}
                  muted={false}
                />
              </>
            )}
            <GoToNextSlideButton
              setNextNode={setNextNode}
              possibleNextNodes={possibleNextNodes}
            ></GoToNextSlideButton>
          </Box>
        )}
      </Box>
    </>
  );
}
