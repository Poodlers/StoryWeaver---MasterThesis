import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
import AudioPlayer from "mui-audio-player-plus";
import React, { useEffect } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";

var BASE64_MARKER = ";base64,";

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export default function AudioNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const fileInfo = props.data?.file ?? "";
  const audioColor = props.data?.color ?? "#000000";
  const backgroundFileInfo = props.data?.background ?? "";

  const [error, setError] = React.useState(false);
  const [url, setUrl] = React.useState("");

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const sceneName = props.data?.sceneName ?? "Imagem";
  const reactflow = useReactFlow();
  const nodeId = props.id;
  const setSceneName = (sceneName) => {
    const newNodes = reactflow.getNodes().map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, sceneName: sceneName } };
      }
      return node;
    });
    reactflow.setNodes(newNodes);
    localStorage.setItem("nodes", JSON.stringify(newNodes));
  };

  const deleteNode = () => {
    const newNodes = reactflow.getNodes().filter((node) => node.id !== nodeId);
    const newEdges = reactflow
      .getEdges()
      .filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
    reactflow.setNodes(newNodes);
    reactflow.setEdges(newEdges);
    localStorage.setItem("nodes", JSON.stringify(newNodes));
    localStorage.setItem("edges", JSON.stringify(newEdges));
  };

  useEffect(() => {
    if (backgroundFileInfo.filename == "") {
      setBackgroundURL("");
      return;
    }
    if (backgroundFileInfo.inputType == "url") {
      setBackgroundURL(backgroundFileInfo.filename);
    } else {
      repo
        .getFilePath(backgroundFileInfo.filename)
        .then((url) => {
          setBackgroundURL(url);
        })
        .catch(() => {
          setBackgroundURL("");
        });
    }
  }, [backgroundFileInfo]);

  useEffect(() => {
    if (fileInfo.filename == "") {
      setUrl("");
      return;
    }
    if (fileInfo.inputType == "url") {
      setUrl(fileInfo.filename);
    } else {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setUrl(path);
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, [fileInfo]);
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={leftNodeHandleStyle}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <img
          src={"./assets/audio_node.png"}
          style={{
            width: "50px",
            height: "50px",
          }}
        ></img>

        <TextField
          id="scene-name"
          variant="outlined"
          value={sceneName}
          onChange={(e) => {
            setSceneName(e.target.value);
          }}
          inputProps={{
            style: {
              borderRadius: 0,
              color: "black",
              height: 40,
              padding: "0 10px",
              margin: 0,
              borderColor: "transparent",
              borderWidth: 0,
              fontSize: 20,
              fontWeight: 500,
              borderRadius: 10,
            },
          }}
          sx={{
            flexGrow: 1,
            py: 0,
            px: 2,
            color: textColor,

            borderRadius: 0,
            ".MuiInputBase-root": {
              borderRadius: 2,
            },
          }}
        />

        <IconButton
          sx={{ color: tertiaryColor }}
          onClick={() => {
            deleteNode();
          }}
        >
          <Icon id="deleteButton" sx={{ fontSize: "40px !important" }}>
            delete
          </Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          background:
            backgroundURL == ""
              ? secondaryColor
              : `${secondaryColor} url(${backgroundURL}) no-repeat center center  fixed`,
          backgroundSize: "cover",
          borderColor: "black",
          borderWidth: 2,
          borderRadius: 4,
          borderStyle: "solid",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "375px",
          minHeight: "677px",
        }}
      >
        <PlayerTextFinalDisplay
          text={title}
          messageType="Texto"
          style={{ mb: 2 }}
        />

        <Box
          sx={{
            width: "100%",
            height: "100%",

            minHeight: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {error || fileInfo.filename == "" ? (
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 500 }}
            >
              Insira um audio no inspetor!
            </Typography>
          ) : null}
          <div className="audio-player-container">
            <AudioPlayer
              src={url}
              id="inline-timeline"
              display="timeline"
              containerWidth={300}
              inline
              size="medium"
              playPauseIconButtonProps={{
                TouchRippleProps: { style: { color: "transparent" } },
                sx: {
                  color: textColor,
                  ".MuiSvgIcon-root": { fontSize: "3.5rem" },
                  "&:hover": { color: tertiaryColor },
                  "&:focused": {
                    backgroundColor: "transparent",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              containerSx={{
                display: error || fileInfo.filename == "" ? "none" : "block",
                textAlign: "center",
                backgroundColor: audioColor,
                p: 1,
                "& .MuiSlider-root": { color: "#fff" },
                "& .MuiIconButton-root": { color: "#fff" },
              }}
            />
          </div>
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
    </>
  );
}
