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
import PlayerTextFinalDisplay from "./PlayerTextFinalDisplay";
import { primaryColor, textColor } from "../../../themes";

export default function ChoiceDialogueDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const character = props.character;
  const prompt = props.prompt;
  const answers = props.answers;
  const setNextDialogueNode = props.setNextDialogueNode;
  const [characterImg, setCharacterImg] = React.useState("");
  const [displayAnswers, setDisplayAnswers] = React.useState(false);
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
          width: "70%",
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
            text={prompt}
            delay={200}
            onComplete={() => setDisplayAnswers(true)}
          />
        </Typography>
      </Box>

      <Box
        sx={{
          display: displayAnswers ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
        }}
      >
        {answers.map((answer, index) => {
          return (
            <ButtonBase
              key={index}
              sx={{
                width: "100%",
                cursor: "pointer",
              }}
              onClick={() => {
                setNextDialogueNode(index);
              }}
            >
              <PlayerTextFinalDisplay
                style={{
                  width: "100%",
                }}
                text={answer}
                messageType={"Resposta"}
              />
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
