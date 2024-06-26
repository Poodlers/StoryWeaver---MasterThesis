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
import { DescriptionSharp } from "@mui/icons-material";
import { narrator } from "../../data/narrator";
import CharacterIconDisplay from "./util/CharacterIconDisplay";

export default function PathNode(props) {
  const repo = ApiDataRepository.getInstance();
  const pathName = props.data?.name ?? "";

  const maps = localStorage.getItem("maps")
    ? JSON.parse(localStorage.getItem("maps"))
    : [];
  const isSelectedForCopy = props.data?.isSelectedForCopy ?? false;
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
        style={
          isSelectedForCopy
            ? { ...leftNodeHandleStyle, left: "5px" }
            : leftNodeHandleStyle
        }
      />
      <Handle
        type="source"
        position={Position.Right}
        style={
          isSelectedForCopy
            ? { ...rightNodeHandleStyle, right: "5px" }
            : rightNodeHandleStyle
        }
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

        <IconButton sx={{ color: tertiaryColor }} onClick={() => {}}>
          <Icon id="deleteButton" sx={{ fontSize: "40px !important" }}>
            delete
          </Icon>
        </IconButton>
      </Box>
      <div className={isSelectedForCopy ? "border" : ""}>
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

          {pathName == "" ? null : (
            <CharacterIconDisplay
              characterName={character.name}
              characterFilepath={characterFilepath}
            />
          )}
          <PlayerTextFinalDisplay
            style={{ width: "90%" }}
            text={pathName}
            titleIcon={
              <DescriptionSharp
                sx={{ color: textColor, fontSize: "40px !important" }}
              ></DescriptionSharp>
            }
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
      </div>
    </>
  );
}
