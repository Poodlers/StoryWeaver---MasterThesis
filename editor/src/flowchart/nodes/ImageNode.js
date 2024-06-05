import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
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
import {
  DescriptionOutlined,
  DescriptionSharp,
  MenuBookOutlined,
  MenuOpenOutlined,
} from "@mui/icons-material";

export default function ImageNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const sceneName = props.data?.sceneName ?? "";
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

  const isAR = props.data?.ar ?? false;

  const backgroundFileInfo = props.data?.background ?? "";

  const fileInfo = props.data?.file ?? "";
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(
    "Insira uma imagem no editor!"
  );

  const [url, setUrl] = React.useState("");

  const [backgroundURL, setBackgroundURL] = React.useState("");

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
          src="../assets/image_node.png"
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
          id="delete-button"
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
          background: isAR
            ? `url(${"../assets/night_sky.jpg"}) no-repeat center center fixed`
            : backgroundURL == ""
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
        <Icon
          sx={{
            color: textColor,
            fontSize: "50px !important",
            position: "absolute",
            bottom: 5,
            right: 20,
          }}
        >
          {isAR ? "view_in_ar" : "landscape"}
        </Icon>
        <PlayerTextFinalDisplay
          text={title}
          messageType={"Mensagem"}
          titleIcon={
            <Icon sx={{ color: textColor, fontSize: "40px !important" }}>
              description
            </Icon>
          }
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
              {errorMsg}
            </Typography>
          ) : null}
          <div
            style={{
              position: "relative",
            }}
          >
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
                      setErrorMsg("Erro ao carregar a imagem!");
                    });
                } else {
                  setError(true);
                  setErrorMsg("Insira uma imagem no editor!");
                }
              }}
              src={url}
              style={{
                width: "auto",
                height: "200px",
                padding: 10,
                display: error ? "none" : "block",
              }}
            />
            <Icon
              sx={{
                color: textColor,
                fontSize: "50px !important",
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
            >
              add_photo_alternate
            </Icon>
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
