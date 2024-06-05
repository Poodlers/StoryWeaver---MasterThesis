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
import React, { useEffect } from "react";
import {
  BlobReader,
  BlobWriter,
  fs,
  TextReader,
  ZipReader,
} from "@zip.js/zip.js";

import "aframe";

import { Entity, Scene } from "aframe-react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

const { FS } = fs;

export default function ThreeDModelNode(props) {
  const repo = ApiDataRepository.getInstance();
  const name = props.data?.name ?? "";

  const fileInfo = props.data?.file ?? "";
  const modelType = fileInfo.modelType;
  const isAR = props.data?.ar ?? false;
  const scale = props.data?.scale ?? { x: 1, y: 1, z: 1 };
  const position = props.data?.position ?? { x: 0, y: 0, z: 0 };

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

  const [canLookAround, setCanLookAround] = React.useState(false);

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

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      setCanLookAround(false);
      console.log("Can't look around");
    }
  };

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
          justifyContent: "space-between",
          width: "375px",
          minHeight: "677px",
        }}
      >
        <PlayerTextFinalDisplay text={name} messageType={"Mensagem"} />

        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {fileURL == "" ? (
            <PlayerTextFinalDisplay
              text={"Nenhum modelo 3D selecionado."}
              style={{ mt: 2, px: 2 }}
            />
          ) : (
            <Scene>
              {document
                .querySelector(".a-enter-vr-button")
                ?.addEventListener("click", () => {
                  setCanLookAround(true);
                  console.log("Can look around");
                })}

              <Entity
                geometry={{ primitive: "box" }}
                material={{ color: "red" }}
                position={{ x: 0, y: 0, z: -5 }}
              />
              {modelType == ThreeDModelTypes.gltf ? (
                <Entity
                  gltf-model={"url(" + fileURL + ")"}
                  position={position}
                  scale={scale}
                />
              ) : (
                <Entity
                  obj-model={
                    "obj: url(" +
                    fileURL +
                    "); mtl: url(" +
                    fileURL.replace(".obj", ".mtl") +
                    ");"
                  }
                  position={position}
                  scale={scale}
                />
              )}

              <Entity text={{ value: "Hello, WebVR!" }} />
              <a-camera
                camera="fov: 80;"
                id="camera"
                position="0 1.6 16"
                look-controls={
                  "enabled:false; reverseMouseDrag:false; touchEnabled: false;"
                }
              ></a-camera>
            </Scene>
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
