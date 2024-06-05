import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import React, { useEffect } from "react";

export default function PathNode(props) {
  const repo = ApiDataRepository.getInstance();
  const pathName = props.data?.name ?? "";

  const maps = localStorage.getItem("maps")
    ? JSON.parse(localStorage.getItem("maps"))
    : [];

  const backgroundFileInfo = props.data?.background ?? "";
  const [backgroundURL, setBackgroundURL] = React.useState("");
  const end = props.data?.destination ?? "";
  const mapEnd = maps.find((map) => map.name == end.map);
  const placeEnd = mapEnd
    ? mapEnd.anchors.find((place) => place.name == end.place)
    : null;

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
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={leftNodeHandleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
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
          src={"./assets/path_node.png"}
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
          style={{ width: "90%" }}
          text={pathName}
          messageType={"Texto auxiliar"}
        />

        <PlayerTextFinalDisplay
          text={
            end.trigger_mode === "GPS Coords"
              ? end.place
              : end.trigger_mode === "QR Code"
              ? end.qr_code
              : end.image.filename
              ? end.image.filename
              : " "
          }
          messageType={"Destino"}
          icon={
            end.trigger_mode === "GPS Coords" ? (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                {placeEnd ? placeEnd.icon : "place"}
              </Icon>
            ) : end.trigger_mode === "QR Code" ? (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                qr_code
              </Icon>
            ) : (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                image
              </Icon>
            )
          }
          style={{ mt: 2, width: "90%" }}
        />
      </Box>
    </>
  );
}
