import {
  Box,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { backgroundColor, textColor } from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import { AREntityTypes } from "../../models/AREntityTypes";

export default function ThreeDModelDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const threeDNode = props.node;
  const file = threeDNode.data.file;
  const position = threeDNode.data.position;
  const scale = threeDNode.data.scale;
  const name = threeDNode.data.name;
  const isAR = threeDNode.data.ar;
  const modelType = threeDNode.data.modelType;
  const ARTypeInfo = threeDNode.data.ar_type;
  const possibleNextNodes = props.possibleNextNodes;

  const setNextNode = props.setNextNode;

  return isAR ? (
    ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
      <LocationBasedARDisplay
        map={ARTypeInfo.map}
        place={ARTypeInfo.place}
        tolerance={ARTypeInfo.tolerance}
        position={position}
        scale={scale}
        entityType={AREntityTypes.ThreeDModel}
        threeDModelType={modelType}
      />
    ) : (
      <div></div>
    )
  ) : (
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
      <Typography variant="h4">{name}</Typography>

      <div
        className="sketchfab-embed-wrapper"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>

      <ButtonBase
        sx={{
          mt: 2,
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        onClick={() => {
          setNextNode(possibleNextNodes[0]);
        }}
      >
        <Typography variant="h4">Avançar</Typography>
      </ButtonBase>
    </Box>
  );
}
