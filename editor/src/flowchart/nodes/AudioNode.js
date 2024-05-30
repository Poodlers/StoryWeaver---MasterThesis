import { Box, Typography } from "@mui/material";
import AudioPlayer from "mui-audio-player-plus";
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

var BASE64_MARKER = ";base64,";

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export default function AudioNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const fileInfo = props.data?.file ?? "";
  const audioColor = props.data?.color ?? "#000000";
  const backgroundFileInfo = props.data?.background ?? "";

  const [error, setError] = React.useState(false);
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
          Audio
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
          text={title}
          messageType="Texto"
          style={{ mb: 2 }}
        />

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
              Insira um audio no inspetor!
            </Typography>
          ) : null}
          <div className="audio-player-container">
            <AudioPlayer
              src={url}
              id="inline-timeline"
              display="timeline"
              containerWidth={300}
              inline
              size="medium"
              playPauseIconButtonProps={{
                TouchRippleProps: { style: { color: "transparent" } },
                sx: {
                  color: textColor,
                  ".MuiSvgIcon-root": { fontSize: "3.5rem" },
                  "&:hover": { color: tertiaryColor },
                  "&:focused": {
                    backgroundColor: "transparent",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                  },
                },
              }}
              containerSx={{
                display: error || fileInfo.filename == "" ? "none" : "block",
                textAlign: "center",
                backgroundColor: audioColor,
                p: 1,
                "& .MuiSlider-root": { color: "#fff" },
                "& .MuiIconButton-root": { color: "#fff" },
              }}
            />
          </div>
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
