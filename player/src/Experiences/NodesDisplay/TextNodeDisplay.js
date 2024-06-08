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
  const textNode = props.node;
  const text = textNode.data.text;

  const character = textNode.data.character;
  const possibleNextNodes = props.possibleNextNodes;

  const setNextNode = props.setNextNode;

  const ARTypeInfo = textNode.data.ar_type;
  const isAR = textNode.data.ar;
  const position = textNode.data.position;
  const scale = textNode.data.scale;

  const backgroundFileInfo = textNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
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
            name={text}
            map={ARTypeInfo.map}
            place={ARTypeInfo.place}
            tolerance={ARTypeInfo.tolerance}
            position={position}
            scale={scale}
            entityType={AREntityTypes.Text}
          />
        ) : (
          <ImageTrackingBasedARDisplay
            name={text}
            markerSrc={
              ARTypeInfo.trigger_mode == ARTriggerMode.QRCode
                ? ARTypeInfo.qr_code
                : ARTypeInfo.image.filename
            }
            position={position}
            scale={scale}
            entityType={AREntityTypes.Text}
          />
        )
      ) : (
        <PlayerTextFinalDisplay text={text} />
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
