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
import GoToNextSlideButton from "./util/GoToNextSlideButton";
import Typewriter from "./util/TypeWriter";

export default function AudioNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const audioNode = props.node;
  const name = audioNode.data.name;
  const fileInfo = audioNode.data.file;
  const color = audioNode.data.color.color;

  const character = audioNode.data.character;

  const possibleNextNodes = props.possibleNextNodes;

  const backgroundFileInfo = audioNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const setNextNode = props.setNextNode;

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
        <>
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
              backgroundColor: color + " !important",
              p: 1,

              "& .MuiSlider-root": { color: "#fff" },
              "& .MuiIconButton-root": { color: "#fff" },
            }}
          />
          <GoToNextSlideButton
            possibleNextNodes={possibleNextNodes}
            setNextNode={setNextNode}
          />
        </>
      )}
    </Box>
  );
}
