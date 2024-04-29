import { Box, Icon, Typography } from "@mui/material";
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
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    setError(false);
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
        {character ? (
          <img
            style={{
              width: "auto",
              height: 70,
              textAlign: "end",
              justifyContent: "end",
            }}
            onError={(e) => {
              if (character.image.inputType == "file") {
                repo.getFile(character.image.filename).then((blob) => {
                  e.target.src = URL.createObjectURL(blob);
                });
              } else {
                setError(true);
              }
            }}
            src={
              error
                ? "../assets/character_dialogue_node.png"
                : character.image.inputType === "file"
                ? character.image.blob
                : character.image.filename
            }
            alt="character"
          />
        ) : null}

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
