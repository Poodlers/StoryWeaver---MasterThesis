import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";

export default function EndNodeDisplay(props) {
  const endNode = props.node;

  const endName = endNode.data.id;
  const setNextNode = props.setNextNode;
  const experienceName = props.experienceName;
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
      <Typography variant="h4">Obrigado por ter experienciado,</Typography>
      <Typography variant="h4">{experienceName}</Typography>
      <Typography variant="h4">Você obteve o fim {endName}</Typography>

      <ButtonBase
        sx={{
          mt: 2,
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        onClick={() => {
          setNextNode(undefined);
        }}
      >
        <Typography variant="h4">Terminar</Typography>
      </ButtonBase>
    </Box>
  );
}
