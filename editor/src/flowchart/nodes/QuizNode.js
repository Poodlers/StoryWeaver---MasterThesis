import { Box, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
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

export default function QuizNode(props) {
  const repo = ApiDataRepository.getInstance();
  const question = props.data?.question ?? "";
  const answers = props.data?.answers ?? ["Empty"];
  const backgroundFileInfo = props.data?.background ?? "";

  const [backgroundURL, setBackgroundURL] = React.useState("");

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
      <Box
        sx={{
          backgroundColor: primaryColor,
          borderColor: tertiaryColor,
          justifyContent: "start",
          borderWidth: 2,
          borderStyle: "solid",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            px: 2,
            fontSize: 20,
            color: textColor,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Quiz
        </Typography>
      </Box>
      <Box
        sx={{
          background:
            backgroundURL == ""
              ? secondaryColor
              : `${secondaryColor} url(${backgroundURL}) no-repeat center center  fixed`,
          backgroundSize: "cover",
          borderColor: tertiaryColor,
          borderWidth: 2,
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
          text={question}
          messageType="Pergunta"
          style={{ mb: 2 }}
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
              fontSize: 15,
              color: textColor,
              fontWeight: 400,
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
            <div key={index}>
              <PlayerTextFinalDisplay style={{ mb: 2 }} text={answer} />

              <Handle
                type="source"
                position={Position.Right}
                style={{
                  marginTop: 70 * index,
                  ...rightNodeHandleStyle,
                }}
                id={answer}
              />
            </div>
          ))}
        </Box>
      </Box>
    </>
  );
}
