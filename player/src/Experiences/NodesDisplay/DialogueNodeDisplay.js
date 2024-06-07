import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, secondaryColor, textColor } from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { DialogNodeType } from "../../models/DialogNodeTypes";
import Typewriter from "./util/TypeWriter";
import CharacterDialogueDisplay from "./util/CharacterDialogueDisplay";
import { ComponentState } from "../../models/ComponentState";
import ChoiceDialogueDisplay from "./util/ChoiceDialogueDisplay";

export default function DialogueNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const dialogueNode = props.node;
  const possibleNextNodes = props.possibleNextNodes;
  const outGoingEdges = props.outGoingEdges;

  const backgroundFileInfo = dialogueNode.data.background;
  const dialogTree = dialogueNode.data.dialog;
  const dialogNodes = dialogTree.nodes;
  const dialogEdges = dialogTree.edges;
  console.log(dialogNodes);
  console.log(dialogEdges);

  const setNextNode = props.setNextNode;

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [currentDialogNode, setCurrentDialogNode] = React.useState(undefined);

  console.log(currentDialogNode);
  const findNextDialogueNode = (dialogNode, choice) => {
    const edgesFromCurrentNode = dialogEdges.find((edge) => {
      if (choice) {
        return (
          edge.source == dialogNode.id && edge.sourceHandle == parseInt(choice)
        );
      } else {
        return edge.source == dialogNode.id;
      }
    });
    if (edgesFromCurrentNode.length == 0) {
      return undefined;
    }
    const nextNode = dialogNodes.find(
      (node) => node.id == edgesFromCurrentNode.target
    );
    return nextNode;
  };

  useEffect(() => {
    setCurrentDialogNode(
      dialogNodes.find((node) => node.type == DialogNodeType.beginDialogNode)
    );
    setComponentState(ComponentState.LOADED);
  }, [dialogTree]);

  const [backgroundColor, setBackgroundColor] = React.useState("#000000");

  useEffect(() => {
    if (backgroundFileInfo.inputType == "color") {
      setBackgroundColor(backgroundFileInfo.color);
      setBackgroundURL("");
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

  return componentState == ComponentState.LOADING ? (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Carregando...</Typography>
    </Box>
  ) : componentState == ComponentState.ERROR ? (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Erro ao carregar</Typography>
    </Box>
  ) : (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          backgroundURL == ""
            ? backgroundColor
            : `${backgroundColor} url(${backgroundURL}) no-repeat center center  fixed`,
        backgroundSize: "cover",
      }}
    >
      {currentDialogNode.type == DialogNodeType.beginDialogNode ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: textColor,
              backgroundColor: backgroundColor,
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {"Diálogo"}
          </Typography>

          <ButtonBase
            sx={{
              width: "50%",
              backgroundColor: backgroundColor,
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
            onClick={() => {
              const nextNode = findNextDialogueNode(currentDialogNode);
              setCurrentDialogNode(nextNode);
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: textColor,
              }}
            >
              Avançar
            </Typography>
          </ButtonBase>
        </Box>
      ) : currentDialogNode.type == DialogNodeType.dialogNode ? (
        <CharacterDialogueDisplay
          character={currentDialogNode.data.character}
          dialogue={currentDialogNode.data.text}
          setNextDialogueNode={() => {
            const nextNode = findNextDialogueNode(currentDialogNode);
            setCurrentDialogNode(nextNode);
          }}
        ></CharacterDialogueDisplay>
      ) : currentDialogNode.type == DialogNodeType.dialogChoiceNode ? (
        <ChoiceDialogueDisplay
          character={currentDialogNode.data.character}
          prompt={currentDialogNode.data.prompt}
          answers={currentDialogNode.data.answers}
          setNextDialogueNode={(choice) => {
            const nextNode = findNextDialogueNode(currentDialogNode, choice);
            setCurrentDialogNode(nextNode);
          }}
        ></ChoiceDialogueDisplay>
      ) : currentDialogNode.type == DialogNodeType.endDialogNode ? (
        setNextNode(
          possibleNextNodes.find(
            (node) =>
              node.id ==
              outGoingEdges.find(
                (edge) => edge.sourceHandle == currentDialogNode.data.id
              ).target
          )
        )
      ) : null}
    </Box>
  );
}
