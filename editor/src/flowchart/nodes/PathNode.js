import { Box, Icon, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import React, { useEffect } from "react";

export default function PathNode(props) {
  const repo = ApiDataRepository.getInstance();
  const pathName = props.data?.name ?? "";

  const maps = localStorage.getItem("maps")
    ? JSON.parse(localStorage.getItem("maps"))
    : [];

  const backgroundFileInfo = props.data?.background ?? "";
  const [backgroundURL, setBackgroundURL] = React.useState("");
  const end = props.data?.destination ?? "";
  const mapEnd = maps.find((map) => map.name == end.map);
  const placeEnd = mapEnd
    ? mapEnd.anchors.find((place) => place.name == end.place)
    : null;

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
      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
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
          Rota
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
          style={{ width: "90%" }}
          text={pathName}
          messageType={"Texto auxiliar"}
        />

        <PlayerTextFinalDisplay
          text={
            end.trigger_mode === "GPS Coords"
              ? end.place
              : end.trigger_mode === "QR Code"
              ? end.qr_code
              : end.image.filename
              ? end.image.filename
              : " "
          }
          messageType={"Destino"}
          icon={
            end.trigger_mode === "GPS Coords" ? (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                {placeEnd ? placeEnd.icon : "place"}
              </Icon>
            ) : end.trigger_mode === "QR Code" ? (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                qr_code
              </Icon>
            ) : (
              <Icon sx={{ fontSize: 20, color: primaryColor, mr: 1 }}>
                image
              </Icon>
            )
          }
          style={{ mt: 2, width: "90%" }}
        />
      </Box>
    </>
  );
}
