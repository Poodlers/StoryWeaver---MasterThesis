import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";

export default function QuizNodeDisplay(props) {
  const quizNode = props.node;
  const question = quizNode.data.question;
  const answers = quizNode.data.answers;
  const outGoingEdges = props.outGoingEdges;

  const possibleNextNodes = props.possibleNextNodes;

  const setNextNode = props.setNextNode;
  const experienceName = props.experienceName;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">{question}</Typography>
      {answers.map((answer, index) => (
        <ButtonBase
          key={index}
          sx={{
            mt: 2,
            backgroundColor: backgroundColor,
            color: textColor,
          }}
          onClick={() => {
            setNextNode(
              possibleNextNodes.find(
                (node) => node.id == outGoingEdges[index].target
              )
            );
          }}
        >
          <Typography variant="h4">{answer}</Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
