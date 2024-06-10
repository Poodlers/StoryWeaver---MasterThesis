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

  const setNextNode = props.setNextNode;

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [currentDialogNode, setCurrentDialogNode] = React.useState(undefined);

  const findNextDialogueNode = (dialogNode, choice) => {
    console.log(dialogNode);
    const edgesFromCurrentNode = dialogEdges.find((edge) => {
      if (choice) {
        return edge.source == dialogNode.id && edge.sourceHandle == choice;
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
    const beginNode = dialogNodes.find(
      (node) => node.type == DialogNodeType.beginDialogNode
    );
    setCurrentDialogNode(findNextDialogueNode(beginNode));
    setComponentState(ComponentState.LOADED);
  }, [dialogTree]);

  const [backgroundColor, setBackgroundColor] = React.useState("#A9B388");

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
        minHeight: "91vh",
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
      {currentDialogNode.type ==
      DialogNodeType.beginDialogNode ? null : currentDialogNode.type ==
        DialogNodeType.dialogNode ? (
        <CharacterDialogueDisplay
          character={currentDialogNode.data.character}
          dialogue={currentDialogNode.data.text}
          audioSrc={currentDialogNode.data.audio}
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
          audioSrc={currentDialogNode.data.audio}
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
