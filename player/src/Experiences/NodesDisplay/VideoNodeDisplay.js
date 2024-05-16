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

export default function VideoNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const videoNode = props.node;
  const title = videoNode.data.name;
  const fileInfo = videoNode.data.file;
  const [error, setError] = React.useState(false);
  const possibleNextNodes = props.possibleNextNodes;
  const [url, setUrl] = React.useState(
    fileInfo.inputType == "url" ? fileInfo.filename : fileInfo.blob
  );
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
      <Typography variant="h4">{title}</Typography>

      <ReactPlayer
        style={{ padding: 5 }}
        onReady={() => setError(false)}
        onError={(e) => {
          if (fileInfo.inputType == "file") {
            repo.getFile(fileInfo.filename).then((blob) => {
              setUrl(URL.createObjectURL(blob));
            });
          } else {
            setError(true);
          }
        }}
        url={url}
        width={"auto"}
        height={"500px"}
        controls={true}
        playing={false}
        muted={false}
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
