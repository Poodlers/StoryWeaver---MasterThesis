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
import Frame from "react-frame-component";
import React, { useEffect } from "react";
import {
  BlobReader,
  BlobWriter,
  fs,
  TextReader,
  ZipReader,
} from "@zip.js/zip.js";

import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import { DescriptionSharp } from "@mui/icons-material";

const { FS } = fs;

export default function ThreeDModelNode(props) {
  const repo = ApiDataRepository.getInstance();
  const name = props.data?.name ?? "";

  const fileInfo = props.data?.file ?? "";
  const modelType = fileInfo.modelType;
  const isAR = props.data?.ar ?? false;
  const scale = props.data?.scale ?? { x: 1, y: 1, z: 1 };
  const position = props.data?.position ?? { x: 0, y: 0, z: 0 };
  const rotation = props.data?.rotation ?? { x: 0, y: 0, z: 0 };
  const backgroundFileInfo = props.data?.background ?? "";
  const [fileURL, setFileURL] = React.useState("");

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

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

  const [backgroundURL, setBackgroundURL] = React.useState("");
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
      setFileURL("");
      setComponentState(ComponentState.LOADED);
      return;
    }
    if (fileInfo.inputType === "url") {
      setFileURL(fileInfo.filename);
      setComponentState(ComponentState.LOADED);
      return;
    }
    repo.getThreeDModelPath(fileInfo.filename, modelType).then((url) => {
      setFileURL(url);
      setComponentState(ComponentState.LOADED);
    });
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
          src={"./assets/three_d_model_node.png"}
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
          justifyContent: "space-between",
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
          text={name}
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
            position: "relative",
          }}
        >
          <Icon
            sx={{
              color: textColor,
              fontSize: "50px !important",
              position: "absolute",
              zIndex: "1000",
              top: 0,
              right: 0,
            }}
          >
            view_in_ar
          </Icon>
          {fileURL == "" ? (
            <PlayerTextFinalDisplay
              text={"Nenhum modelo 3D selecionado."}
              style={{ mt: 2, px: 2 }}
            />
          ) : (
            <Frame
              style={{
                width: "365px",
                minHeight: "600px",
                borderRadius: 4,
                borderColor: "black",
                borderWidth: 2,
                zIndex: 1000,
              }}
              initialContent='<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/gh/aframevr/aframe@1.3.0/dist/aframe-master.min.js"></script>
        </head><body><div></div></body></html>'
            >
              <a-scene>
                {modelType == ThreeDModelTypes.gltf ? (
                  <a-entity
                    gltf-model={fileURL}
                    scale={scale.x + " " + scale.y + " " + scale.z}
                    position={position.x + " " + position.y + " " + position.z}
                    rotation={rotation.x + " " + rotation.y + " " + rotation.z}
                  ></a-entity>
                ) : (
                  <a-entity
                    obj-model={
                      "obj: " +
                      fileURL +
                      "; " +
                      "mtl: " +
                      fileURL.replace(".obj", ".mtl") +
                      ";"
                    }
                    scale={scale.x + " " + scale.y + " " + scale.z}
                    position={position.x + " " + position.y + " " + position.z}
                  ></a-entity>
                )}
              </a-scene>
            </Frame>
          )}
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
