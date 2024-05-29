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

  return componentState === ComponentState.LOADING ? (
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
  ) : componentState === ComponentState.ERROR ? (
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
      key={currentNode.id}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentNode.type == NodeType.beginNode ? (
        <BeginNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
          experienceName={projectInfo.title}
        ></BeginNodeDisplay>
      ) : currentNode.type == NodeType.endNode ? (
        <EndNodeDisplay
          node={currentNode}
          setNextNode={setExperience}
          experienceName={projectInfo.title}
        ></EndNodeDisplay>
      ) : currentNode.type == NodeType.videoNode ? (
        <VideoNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
          experienceName={projectInfo.title}
        ></VideoNodeDisplay>
      ) : currentNode.type == NodeType.imageNode ? (
        <ImageNodeDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></ImageNodeDisplay>
      ) : currentNode.type == NodeType.quizNode ? (
        <QuizNodeDisplay
          node={currentNode}
          outGoingEdges={projectInfo.edges.filter(
            (edge) => edge.source == currentNode.id
          )}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></QuizNodeDisplay>
      ) : currentNode.type == NodeType.threeDModelNode ? (
        <ThreeDModelDisplay
          node={currentNode}
          possibleNextNodes={nextNodes}
          setNextNode={setCurrentNode}
        ></ThreeDModelDisplay>
      ) : (
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
      )}
    </Box>
  );
}
