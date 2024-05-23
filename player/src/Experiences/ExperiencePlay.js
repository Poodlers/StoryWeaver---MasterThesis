import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { ComponentState } from "../models/ComponentState";
import { NodeType } from "../models/NodeTypes";
import EndNodeDisplay from "./NodesDisplay/EndNodeDisplay";
import BeginNodeDisplay from "./NodesDisplay/BeginNodeDisplay";
import QuizNodeDisplay from "./NodesDisplay/QuizNodeDisplay";
import VideoNodeDisplay from "./NodesDisplay/VideoNodeDisplay";
import ImageNodeDisplay from "./NodesDisplay/ImageNodeDisplay";
import ThreeDModelDisplay from "./NodesDisplay/ThreeDModelDisplay";

export default function ExperiencePlay(props) {
  const repo = ApiDataRepository.getInstance();
  const projectId = props.projectId;

  const setExperience = props.setExperience;
  const [currentNode, setCurrentNode] = React.useState(undefined);
  const [nextNodes, setNextNodes] = React.useState([]);
  const [projectInfo, setProjectInfo] = React.useState(undefined);

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  useEffect(() => {
    repo
      .getProject(projectId)
      .then((project) => {
        setProjectInfo(project);

        setCurrentNode(
          project.nodes.find((node) => node.type == NodeType.beginNode)
        );

        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        setComponentState(ComponentState.ERROR);
      });
  }, []);

  useEffect(() => {
    if (currentNode === undefined) {
      return;
    }
    console.log(currentNode.type);
    setNextNode(currentNode);
  }, [currentNode]);
  const setNextNode = (node) => {
    const edgesFromCurrentNode = projectInfo.edges.filter(
      (edge) => edge.source == currentNode.id
    );
    setNextNodes(
      projectInfo.nodes.filter((node) =>
        edgesFromCurrentNode.find((edge) => edge.target == node.id)
      )
    );
    setCurrentNode(node);
  };

  if (componentState === ComponentState.LOADING) {
    return (
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
    );
  }

  switch (currentNode.type) {
    case NodeType.beginNode:
      return (
        <BeginNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
          experienceName={projectInfo.title}
        ></BeginNodeDisplay>
      );
    case NodeType.endNode:
      return (
        <EndNodeDisplay
          node={currentNode}
          setNextNode={setExperience}
          experienceName={projectInfo.title}
        ></EndNodeDisplay>
      );
    case NodeType.videoNode:
      return (
        <VideoNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
          experienceName={projectInfo.title}
        ></VideoNodeDisplay>
      );
    case NodeType.imageNode:
      return (
        <ImageNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></ImageNodeDisplay>
      );

    case NodeType.quizNode:
      return (
        <QuizNodeDisplay
          node={currentNode}
          outGoingEdges={projectInfo.edges.filter(
            (edge) => edge.source == currentNode.id
          )}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></QuizNodeDisplay>
      );
    case NodeType.threeDModelNode:
      return (
        <ThreeDModelDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></ThreeDModelDisplay>
      );
    default:
      return (
        <Box>
          <p>Node type not supported</p>
          <ButtonBase
            onClick={() => {
              setCurrentNode(
                projectInfo.nodes.find(
                  (node) => node.type == NodeType.beginNode
                )
              );
            }}
          >
            <Typography variant="h4">Voltar ao inicio</Typography>
          </ButtonBase>
        </Box>
      );
  }
}
