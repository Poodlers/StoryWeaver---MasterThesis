import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  backgroundColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ComponentState } from "../../models/ComponentState";
import AudioPlayer from "mui-audio-player-plus";

export default function AudioNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const audioNode = props.node;
  const name = audioNode.data.name;
  const fileInfo = audioNode.data.file;
  const color = audioNode.data.color;

  const possibleNextNodes = props.possibleNextNodes;

  const backgroundFileInfo = audioNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const setNextNode = props.setNextNode;

  useEffect(() => {
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          backgroundURL == ""
            ? secondaryColor
            : `${secondaryColor} url(${backgroundURL}) no-repeat center center  fixed`,
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
        <>
          <PlayerTextFinalDisplay
            text={name}
            messageType={"Áudio"}
          ></PlayerTextFinalDisplay>

          <AudioPlayer
            src={url}
            id="inline-timeline"
            display="timeline"
            containerWidth={"90%"}
            containerHeight={"30vh"}
            inline
            size="medium"
            playPauseIconButtonProps={{
              TouchRippleProps: { style: { color: "transparent" } },
              sx: {
                color: textColor,
                ".MuiSvgIcon-root": { fontSize: "3.5rem" },
                "&:hover": { color: tertiaryColor },
                "&:focused": {
                  backgroundColor: "transparent",
                },
                "&:active": {
                  backgroundColor: "transparent",
                },
              },
            }}
            containerSx={{
              display: url == "" ? "none" : "block",
              textAlign: "center",
              backgroundColor: color,
              p: 1,
              "& .MuiSlider-root": { color: "#fff" },
              "& .MuiIconButton-root": { color: "#fff" },
            }}
          />
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
        </>
      )}
    </Box>
  );
}
