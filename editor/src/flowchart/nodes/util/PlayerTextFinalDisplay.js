import React, { useEffect } from "react";
import { primaryColor, textColor } from "../../../themes";
import { Box, Typography } from "@mui/material";

export default function PlayerTextFinalDisplay(props) {
  const text = props.text;
  const messageType = props.messageType;
  const style = props.style;
  const icon = props.icon;
  const titleIcon = props.titleIcon;
  return (
    <Box
      sx={{
        display: text == "" ? "none" : "block",
        ...style,
      }}
    >
      <Box
        sx={{
          display: messageType ? "flex" : "none",
          backgroundColor: primaryColor,
          border: "2px solid black",
          borderRadius: "5px",
          mr: 5,
          p: 0,

          textAlign: "start",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          mb: 0,
        }}
      >
        {titleIcon}
        <Typography
          variant="h6"
          sx={{
            fontSize: 16,
            px: 2,
            color: textColor,
            fontWeight: 500,
            textAlign: "center",
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
