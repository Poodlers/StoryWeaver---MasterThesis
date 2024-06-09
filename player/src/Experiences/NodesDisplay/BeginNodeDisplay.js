import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";
import Typewriter from "./util/TypeWriter";

export default function BeginNodeDisplay(props) {
  const beginNode = props.node;

  const possibleNextNodes = props.possibleNextNodes;

  const setNextNode = props.setNextNode;
  const experienceName = props.experienceName;
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
            fontSize: 25,
            color: "black",
            fontWeight: 200,
            whiteSpace: "pre-wrap",
          }}
        >
          <Typewriter text={"Bem-vind@ ao " + experienceName} delay={100} />
        </Typography>
      </Box>

      <ButtonBase
        sx={{
          mt: 2,
          backgroundColor: backgroundColor,
          color: textColor,
          borderRadius: "5px",
          p: 2,
        }}
        onClick={() => {
          setNextNode(possibleNextNodes[0]);
        }}
      >
        <Typography variant="h4">Começar</Typography>
      </ButtonBase>
    </Box>
  );
}
