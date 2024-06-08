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
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";

export default function QuizNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const quizNode = props.node;
  const question = quizNode.data.question;
  const answers = quizNode.data.answers;
  const outGoingEdges = props.outGoingEdges;

  const possibleNextNodes = props.possibleNextNodes;

  const backgroundFileInfo = quizNode.data.background;

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const setNextNode = props.setNextNode;
  const experienceName = props.experienceName;

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

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
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
      <PlayerTextFinalDisplay
        text={question}
        messageType={"Pergunta"}
        style={{ width: "90%" }}
      ></PlayerTextFinalDisplay>
      {answers.map((answer, index) => (
        <ButtonBase
          key={index}
          sx={{
            mt: 1,
            width: "90%",
            color: textColor,
          }}
          onClick={() => {
            console.log(possibleNextNodes);
            setNextNode(
              possibleNextNodes.find(
                (node) =>
                  node.id ==
                  outGoingEdges.find((edge) => edge.sourceHandle == answer)
                    .target
              )
            );
          }}
        >
          <PlayerTextFinalDisplay
            text={answer}
            messageType={"Opção " + (index + 1)}
            style={{ width: "90%" }}
          ></PlayerTextFinalDisplay>
        </ButtonBase>
      ))}
    </Box>
  );
}
