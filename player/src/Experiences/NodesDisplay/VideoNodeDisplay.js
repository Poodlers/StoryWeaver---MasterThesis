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

  const backgroundFileInfo = videoNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const [backgroundColor, setBackgroundColor] = React.useState("#000000");

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
      ) : isAR ? (
        ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
          <LocationBasedARDisplay
            name={title}
            src={fileInfo.filename}
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
            markerSrc={
              ARTypeInfo.trigger_mode == ARTriggerMode.QRCode
                ? ARTypeInfo.qr_code
                : ARTypeInfo.image.filename
            }
            src={url}
            position={position}
            scale={scale}
            entityType={AREntityTypes.Video}
          />
        )
      ) : (
        <>
          <PlayerTextFinalDisplay
            text={title}
            messageType={"Vídeo"}
            style={{ width: "90%" }}
          />
          <ReactPlayer
            style={{
              marginTop: "10px",
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
            height={"auto"}
            controls={true}
            playing={false}
            muted={false}
          />
        </>
      )}
      <ButtonBase
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          position: "absolute",
          bottom: "11vh",
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
