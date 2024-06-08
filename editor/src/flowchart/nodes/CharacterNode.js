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
import DialogBubble from "../../assets/dialog_bubble.svg";
import { DescriptionSharp } from "@mui/icons-material";

export default function CharacterNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const endNodes =
    props.data.dialog.nodes.filter((nodes) => nodes.type == "endDialogNode") ??
    [];
  const backgroundFileInfo = props.data?.background ?? "";

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
          src={DialogBubble}
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
            bottom: 5,
            right: 20,
          }}
        >
          {"landscape"}
        </Icon>
        <PlayerTextFinalDisplay
          text={title}
          messageType={"Diálogo"}
          style={{ mb: 2 }}
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
            minHeight: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: primaryColor,
            }}
          >
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 18, color: textColor, fontWeight: 500 }}
            >
              Fins possíveis
            </Typography>
          </Box>
          {endNodes.map((node, index) => {
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <PlayerTextFinalDisplay style={{ mb: 2 }} text={node.data.id} />
                <Handle
                  type="source"
                  position={Position.Right}
                  style={{
                    position: "absolute",
                    ...rightNodeHandleStyle,
                    right: -5,
                    top: 25,
                  }}
                  id={node.data.id}
                />
              </div>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
