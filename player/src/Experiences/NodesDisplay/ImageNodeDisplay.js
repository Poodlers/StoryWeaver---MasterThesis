import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";
import ReactPlayer from "react-player";
import { ApiDataRepository } from "../../api/ApiDataRepository";

export default function ImageNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const imageNode = props.node;
  const title = imageNode.data.name;
  const fileInfo = imageNode.data.file;
  const [error, setError] = React.useState(false);
  const possibleNextNodes = props.possibleNextNodes;

  const setNextNode = props.setNextNode;

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
      <Typography variant="h4">{title}</Typography>

      <img
        onLoad={() => {
          setError(false);
        }}
        onError={(e) => {
          // if blob is not valid, fetch the image from the server
          if (fileInfo.inputType == "file") {
            repo
              .getFile(fileInfo.filename)
              .then((blob) => {
                e.target.src = URL.createObjectURL(blob);
              })
              .catch((e) => {
                setError(true);
              });
          }
        }}
        src={fileInfo.inputType == "file" ? fileInfo.blob : fileInfo.filename}
        style={{
          width: "auto",
          height: "500px",
          padding: 10,
          display: error ? "none" : "block",
        }}
      />

      <ButtonBase
        sx={{
          mt: 2,
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        onClick={() => {
          setNextNode(possibleNextNodes[0]);
        }}
      >
        <Typography variant="h4">Avançar</Typography>
      </ButtonBase>
    </Box>
  );
}
