import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../../api/ApiDataRepository";
import Typewriter from "./TypeWriter";

export default function CharacterDialogueDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const character = props.character;
  const dialogue = props.dialogue;
  const setNextDialogueNode = props.setNextDialogueNode;
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

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={character.image.filename}
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
            delay={200}
            onComplete={() => {
              setTimeout(() => {
                setNextDialogueNode();
              }, 1000);
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}
