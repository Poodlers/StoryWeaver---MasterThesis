import React, { useEffect } from "react";
import { primaryColor, textColor } from "../../../themes";
import { Box, Typography } from "@mui/material";

export default function PlayerTextFinalDisplay(props) {
  const text = props.text;
  const messageType = props.messageType;
  const style = props.style;
  const icon = props.icon;
  return (
    <Box
      sx={{
        display: text == "" ? "none" : "block",
        ...style,
      }}
    >
      <Box
        sx={{
          display: messageType ? "block" : "none",
          backgroundColor: primaryColor,
          border: "2px solid black",
          borderRadius: "5px",
          m: 1,
          width: "60%",
          textAlign: "center",
          mb: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: 14,
            color: textColor,
            fontWeight: 500,
          }}
        >
          {messageType}
        </Typography>
      </Box>
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
        {icon}
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
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
