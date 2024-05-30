import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";

export default function ImageNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";

  const isAR = props.data?.ar ?? false;

  const backgroundFileInfo = props.data?.background ?? "";

  const fileInfo = props.data?.file ?? "";
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(
    "Insira uma imagem no editor!"
  );

  const [url, setUrl] = React.useState("");

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

  useEffect(() => {
    if (fileInfo.filename == "") {
      setUrl("");
      return;
    }
    if (fileInfo.inputType == "url") {
      setUrl(fileInfo.filename);
    } else {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setUrl(path);
        })
        .catch((err) => {
          setError(true);
        });
    }
  }, [fileInfo]);
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
          borderWidth: 2,
          borderStyle: "solid",
        }}
      >
        <Typography
          variant="h6"
          sx={{ px: 2, fontSize: 20, color: textColor, fontWeight: 500 }}
        >
          Imagem
        </Typography>
      </Box>
      <Box
        sx={{
          background: isAR
            ? `url(${"../assets/night_sky.jpg"}) no-repeat center center fixed`
            : backgroundURL == ""
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
        <PlayerTextFinalDisplay text={title} messageType={"Mensagem"} />

        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {error || fileInfo.filename == "" ? (
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 500 }}
            >
              {errorMsg}
            </Typography>
          ) : null}

          <img
            onLoad={() => {
              setError(false);
            }}
            onError={(e) => {
              // if blob is not valid, fetch the image from the server
              if (fileInfo.inputType == "file") {
                repo
                  .getFile(fileInfo.filename)
                  .then((blob) => {
                    e.target.src = URL.createObjectURL(blob);
                  })
                  .catch((e) => {
                    setError(true);
                    setErrorMsg("Erro ao carregar a imagem!");
                  });
              } else {
                setError(true);
                setErrorMsg("Insira uma imagem no editor!");
              }
            }}
            src={url}
            style={{
              width: "auto",
              height: "200px",
              padding: 10,
              display: error ? "none" : "block",
            }}
          />
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
    </>
  );
}
