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
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";

export default function ImageNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const imageNode = props.node;
  const title = imageNode.data.name;
  const fileInfo = imageNode.data.file;
  const possibleNextNodes = props.possibleNextNodes;
  const ARTypeInfo = imageNode.data.ar_type;
  const isAR = imageNode.data.ar;
  const position = imageNode.data.position;
  const scale = imageNode.data.scale;
  const rotation = imageNode.data.rotation;
  const setNextNode = props.setNextNode;
  const [url, setUrl] = React.useState("");

  const backgroundFileInfo = imageNode.data.background;

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
    if (fileInfo.inputType == "file") {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setUrl(path);
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
            entityType={AREntityTypes.Image}
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
            entityType={AREntityTypes.Image}
          />
        )
      ) : (
        <>
          <PlayerTextFinalDisplay
            text={title}
            messageType="Imagem"
          ></PlayerTextFinalDisplay>

          <img
            src={url}
            style={{
              width: "90%",
              height: "auto",
              padding: 10,
              display: "block",
            }}
          />
        </>
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
