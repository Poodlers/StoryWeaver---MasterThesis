import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import ReactPlayer from "react-player";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { DescriptionSharp } from "@mui/icons-material";
import { narrator } from "../../data/narrator";
import CharacterIconDisplay from "./util/CharacterIconDisplay";

export default function VideoNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const isAR = props.data?.ar ?? false;

  const backgroundFileInfo = props.data?.background ?? "";
  const fileInfo = props.data?.file ?? "";
  const [error, setError] = React.useState(false);

  const [url, setUrl] = React.useState("");

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const reactflow = useReactFlow();

  const sceneName = props.data?.sceneName ?? "Imagem";
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

  const character = props.data?.character ?? narrator;
  const [characterFilepath, setCharacterFilepath] = React.useState("");
  useEffect(() => {
    if (character && character.image.inputType === "file") {
      repo
        .getFilePath(character.image.filename)
        .then((filepath) => {
          console.log(filepath);
          setCharacterFilepath(filepath);
        })
        .catch(() => {
          console.log("Error loading character image");
          setCharacterFilepath("../assets/character_dialogue_node.png");
        });
    } else {
      setCharacterFilepath(character.image.filename);
    }
  }, [character]);

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

  const [backgroundColor, setBackgroundColor] = React.useState("#A9B388");
  useEffect(() => {
    if (backgroundFileInfo.inputType == "color") {
      setBackgroundURL("");
      setBackgroundColor(backgroundFileInfo.color);
      return;
    }
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
    <div>
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
          src={"./assets/video_node.png"}
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
          background: isAR
            ? `url(${"../assets/night_sky.jpg"}) no-repeat center center fixed`
            : backgroundURL == ""
            ? backgroundColor
            : `${backgroundColor} url(${backgroundURL}) no-repeat center center  fixed`,
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
            zIndex: 99,
            bottom: 5,
            right: 20,
          }}
        >
          {isAR ? "view_in_ar" : "landscape"}
        </Icon>
        {title == "" ? null : (
          <CharacterIconDisplay
            characterName={character.name}
            characterFilepath={characterFilepath}
          />
        )}
        <PlayerTextFinalDisplay
          text={title}
          messageType={"Mensagem"}
          titleIcon={
            <DescriptionSharp
              sx={{ color: textColor, fontSize: "40px !important" }}
            ></DescriptionSharp>
          }
        />
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
          {fileInfo.filename == "" ? (
            <Typography
              variant="h6"
              sx={{
                px: 3,
                fontSize: 18,
                color: textColor,
                fontWeight: 500,
                textAlign: "center",
                m: "0 auto",
                mt: 5,
              }}
            >
              Por favor insira um video no Inspetor!
            </Typography>
          ) : error ? (
            <Typography
              variant="h6"
              sx={{
                px: 3,
                fontSize: 15,
                color: textColor,
                fontWeight: 500,
                textAlign: "center",
                m: "0 auto",
              }}
            >
              Erro ao carregar o vídeo!
            </Typography>
          ) : null}
          <div style={{ position: "relative" }}>
            <ReactPlayer
              style={{
                display: error ? "none" : "block",
                width: "375px",
              }}
              onReady={() => setError(false)}
              onError={(e) => {}}
              url={url}
              width={"100%"}
              controls={true}
              playing={false}
              muted={false}
            />

            <Icon
              sx={{
                color: textColor,
                fontSize: "50px !important",
                position: "absolute",
                top: 20,
                right: 0,
              }}
            >
              videocam
            </Icon>
          </div>
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
    </div>
  );
}
