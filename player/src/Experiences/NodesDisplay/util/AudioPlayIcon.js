import { IconButton, Icon } from "@mui/material";

import React from "react";

import { primaryColor, secondaryColor } from "../../../themes";

export default function AudioPlayIcon(props) {
  const isPlaying = props.isPlaying;
  const setPlaying = props.setIsPlaying;

  return (
    <IconButton
      sx={{
        backgroundColor: secondaryColor,
        borderColor: primaryColor,
        borderWidth: 2,
        borderStyle: "solid",
        position: "fixed",
        bottom: 75,
        left: "15px",
        "&:hover": {
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
          color: secondaryColor + " !important",
          borderWidth: 2,
          borderStyle: "solid",
        },
      }}
      onClick={() => {
        setPlaying(!isPlaying);
      }}
    >
      <Icon
        color="inherit"
        sx={{
          fontSize: "40px !important",
        }}
      >
        {isPlaying ? "pause" : "play_arrow"}
      </Icon>
    </IconButton>
  );
}
