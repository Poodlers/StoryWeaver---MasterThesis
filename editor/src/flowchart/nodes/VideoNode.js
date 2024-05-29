import { Box, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import ReactPlayer from "react-player";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";

export default function VideoNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const isAR = props.data?.ar ?? false;

  const backgroundFileInfo = props.data?.background ?? "";
  const fileInfo = props.data?.file ?? "";
  const [error, setError] = React.useState(false);

  const [url, setUrl] = React.useState(
    fileInfo.inputType == "url" ? fileInfo.filename : fileInfo.blob
  );

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
    <div>
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
          sx={{
            px: 2,
            fontSize: 15,
            color: textColor,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Video
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
        <Box>
          <Box
            sx={{
              backgroundColor: primaryColor,
              border: "2px solid black",
              borderRadius: "5px",
              m: 1,
              width: "50%",
              textAlign: "center",
              mb: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: 14,
                color: textColor,
                fontWeight: 500,
              }}
            >
              {"Mensagem"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              backgroundColor: "white",
              border: "2px solid black",
              borderRadius: "5px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                px: 3,
                py: 1,
                fontSize: 20,
                color: "black",
                fontWeight: 200,
                whiteSpace: "pre-wrap",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
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
          {fileInfo.filename == "" ? (
            <Typography
              variant="h6"
              sx={{
                px: 3,
                fontSize: 18,
                color: textColor,
                fontWeight: 500,
                textAlign: "center",
                m: "0 auto",
                mt: 5,
              }}
            >
              Por favor insira um video no Inspetor!
            </Typography>
          ) : error ? (
            <Typography
              variant="h6"
              sx={{
                px: 3,
                fontSize: 15,
                color: textColor,
                fontWeight: 500,
                textAlign: "center",
                m: "0 auto",
              }}
            >
              Erro ao carregar o vídeo!
            </Typography>
          ) : null}

          <ReactPlayer
            style={{
              display: error ? "none" : "block",
              width: "375px",
            }}
            onReady={() => setError(false)}
            onError={(e) => {}}
            url={url}
            width={"100%"}
            controls={true}
            playing={false}
            muted={false}
          />
        </Box>
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
    </div>
  );
}
