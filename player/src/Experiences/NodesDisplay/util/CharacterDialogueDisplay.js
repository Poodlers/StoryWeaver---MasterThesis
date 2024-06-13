import {
  Box,
  ButtonBase,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../../api/ApiDataRepository";
import Typewriter from "./TypeWriter";
import { primaryColor, secondaryColor, tertiaryColor } from "../../../themes";
import AudioPlayIcon from "./AudioPlayIcon";

export default function CharacterDialogueDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const character = props.character;
  const dialogue = props.dialogue;

  const audio = props.audioSrc;
  const setNextDialogueNode = props.setNextDialogueNode;
  const [characterImg, setCharacterImg] = React.useState("");
  const [skipToEnd, setSkipToEnd] = React.useState(false);

  const [audioSrc, setAudioSrc] = React.useState(undefined);
  const [audioPlaying, setAudioPlaying] = React.useState(true);

  React.useEffect(() => {
    if (audioSrc) {
      audioSrc.play();
      audioSrc.addEventListener("ended", () => {
        setAudioPlaying(false);
        if (skipToEnd) {
          //if typewrite is skipped, go to next dialogue node
          setNextDialogueNode();
        }
      });
    }
    return () => {
      if (audioSrc) {
        audioSrc.removeEventListener("ended", () => {
          setAudioPlaying(false);
        });
      }
    };
  }, [audioSrc]);

  React.useEffect(() => {
    if (!audioSrc) return;
    if (audioPlaying) {
      audioSrc.play();
    } else {
      audioSrc.pause();
    }
  }, [audioPlaying]);

  useEffect(() => {
    if (audio.filename == "") {
      return;
    }
    if (audio.inputType == "url") {
      setAudioSrc(new Audio(audio.filename));
    } else {
      repo
        .getFilePath(audio.filename)
        .then((url) => {
          setAudioSrc(new Audio(url));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [audio]);

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

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "91vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <IconButton
        sx={{
          position: "fixed",
          bottom: 75,
          right: "15px",
          backgroundColor: secondaryColor,
          borderColor: primaryColor,
          borderWidth: 2,
          borderStyle: "solid",

          "&:hover": {
            backgroundColor: primaryColor,
            borderColor: secondaryColor,
            color: secondaryColor + " !important",
            borderWidth: 2,
            borderStyle: "solid",
          },
        }}
        onClick={() => {
          if (skipToEnd) {
            if (audioSrc) {
              audioSrc.pause();
            }
            setNextDialogueNode();
          }
          setSkipToEnd(true);
        }}
      >
        <Icon color="inherit" sx={{ fontSize: "40px !important" }}>
          skip_next
        </Icon>
      </IconButton>
      {audioSrc && (
        <AudioPlayIcon
          isPlaying={audioPlaying}
          setIsPlaying={setAudioPlaying}
        />
      )}

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
          <Typewriter
            text={dialogue}
            delay={100}
            skipToEnd={skipToEnd}
            onComplete={() => {
              setSkipToEnd(true);
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}
