import { Box, Icon, IconButton, Typography } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import { ApiDataRepository } from "../api/ApiDataRepository";

export default function DialogChoiceNode(props) {
  const repo = ApiDataRepository.getInstance();
  const character = props.data?.character ?? undefined;
  const question = props.data?.prompt ?? "";
  const answers = props.data?.answers ?? ["Empty"];
  const audio = props.data?.audio ?? "";
  const [filepath, setFilepath] = React.useState("");

  const [audioSrc, setAudioSrc] = React.useState(undefined);

  React.useEffect(() => {
    if (audio.filename == "") {
      setAudioSrc(undefined);
      return;
    }
    if (audio.inputType === "file") {
      repo
        .getFilePath(audio.filename)
        .then((filepath) => {
          setAudioSrc(new Audio(filepath));
        })
        .catch(() => console.log("Error loading audio"));
    } else {
      setAudioSrc(new Audio(audio.filename));
    }
  }, [audio]);

  React.useEffect(() => {
    if (character && character.image.inputType === "file") {
      repo
        .getFilePath(character.image.filename)
        .then((filepath) => {
          setFilepath(filepath);
        })
        .catch(() => setFilepath("../assets/character_dialogue_node.png"));
    } else {
      setFilepath(character.image.filename);
    }
  }, [character]);
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={leftNodeHandleStyle}
      />
      <Box
        sx={{
          backgroundColor: textColor,
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          {character ? (
            <img
              style={{
                width: "auto",
                height: 70,
                textAlign: "end",
                justifyContent: "end",
              }}
              onError={(e) => {}}
              src={filepath}
              alt="character"
            />
          ) : null}
          <IconButton
            sx={{ display: audioSrc ? "block" : "none" }}
            onClick={() => {
              if (audioSrc) {
                if (audioSrc.paused) {
                  audioSrc.play();
                } else {
                  audioSrc.pause();
                }
              }
            }}
          >
            <Icon
              sx={{
                fontSize: "35px !important",
              }}
            >
              volume_up
            </Icon>
          </IconButton>
        </Box>
        <Box
          sx={{
            backgroundColor: primaryColor,
            borderColor: tertiaryColor,
            justifyContent: "start",
            borderWidth: 2,
            borderStyle: "solid",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              px: 2,
              fontSize: 25,
              color: textColor,
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Pergunta
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: secondaryColor,
            borderColor: tertiaryColor,
            borderWidth: 2,
            borderStyle: "solid",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: secondaryColor,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                px: 3,
                py: 3,
                fontSize: 20,
                color: textColor,
                fontWeight: 200,
              }}
            >
              {question}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: primaryColor,
            }}
          >
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 22, color: textColor, fontWeight: 400 }}
            >
              Opções
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: secondaryColor,
            }}
          >
            {answers.map((answer, index) => (
              <div key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    px: 3,
                    py: 0.6,
                    fontSize: 20,
                    color: textColor,
                    fontWeight: 200,
                  }}
                >
                  {answer == "" ? "Empty" : answer}
                </Typography>
                <Handle
                  type="source"
                  position={Position.Right}
                  style={{
                    marginTop: 40 * index + (1 / answers.length) * 220 + "px",
                    ...rightNodeHandleStyle,
                    right: "-6px",
                  }}
                  id={index.toString()}
                />
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
