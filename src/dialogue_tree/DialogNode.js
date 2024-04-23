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

export default function DialogNode(props) {
  const character = props.data?.character ?? "";
  const text = props.data?.text ?? "";
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    setError(false);
  }, [character]);
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          marginTop: 40 + "px",
          ...leftNodeHandleStyle,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          marginTop: 40 + "px",
          ...rightNodeHandleStyle,
        }}
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
              setError(true);
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
            Texto
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
              px: 3,
              py: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 22, color: textColor, fontWeight: 400 }}
            >
              {text}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
