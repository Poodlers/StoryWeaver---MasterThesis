import { Box, Icon, IconButton, TextField, Typography } from "@mui/material";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { DescriptionSharp } from "@mui/icons-material";
import CharacterIconDisplay from "./util/CharacterIconDisplay";
import { narrator } from "../../data/narrator";

export default function QuizNode(props) {
  const repo = ApiDataRepository.getInstance();
  const question = props.data?.question ?? "";
  const answers = props.data?.answers ?? ["Empty"];
  const backgroundFileInfo = props.data?.background ?? "";

  const [backgroundURL, setBackgroundURL] = React.useState("");
  const isSelectedForCopy = props.data?.isSelectedForCopy ?? false;
  const reactflow = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const sceneName = props.data?.sceneName ?? "Imagem";
  const nodeId = props.id;

  useEffect(() => {
    console.log("Updating node internals");
    updateNodeInternals(nodeId);
  }, [answers]);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <img
          src={"./assets/quiz_node.png"}
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
          {question == "" ? null : (
            <CharacterIconDisplay
              characterName={character.name}
              characterFilepath={characterFilepath}
            />
          )}
          <PlayerTextFinalDisplay
            text={question}
            messageType="Pergunta"
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
              backgroundColor: primaryColor,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                px: 3,
                fontSize: 22,
                color: textColor,
                fontWeight: 600,
              }}
            >
              Respostas
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            {answers.map((answer, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                }}
              >
                <PlayerTextFinalDisplay style={{ mb: 2 }} text={answer} />

                <Handle
                  type="source"
                  position={Position.Right}
                  style={{
                    position: "absolute",
                    ...rightNodeHandleStyle,
                    right: -5,
                  }}
                  id={`${index}`}
                />
              </div>
            ))}
          </Box>
        </Box>
      </div>
    </>
  );
}
