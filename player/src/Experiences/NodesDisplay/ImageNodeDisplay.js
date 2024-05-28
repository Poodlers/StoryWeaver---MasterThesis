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
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import { ARTriggerMode } from "../../models/ARTriggerModes";

export default function ImageNodeDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const imageNode = props.node;
  const title = imageNode.data.name;
  const fileInfo = imageNode.data.file;
  const possibleNextNodes = props.possibleNextNodes;
  const ARTypeInfo = imageNode.data.ar_type;
  const isAR = imageNode.data.ar;
  const position = imageNode.data.position;
  const scale = imageNode.data.scale;
  const rotation = imageNode.data.rotation;
  const setNextNode = props.setNextNode;
  const [url, setUrl] = React.useState("");

  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
  useEffect(() => {
    if (fileInfo.inputType == "file") {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setUrl(path);
          setComponentState(ComponentState.LOADED);
        })
        .catch((error) => {
          setComponentState(ComponentState.ERROR);
        });
    } else {
      setUrl(fileInfo.filename);
    }
  }, []);
  return componentState === ComponentState.LOADING ? (
    <Typography
      variant="h4"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      Loading...
    </Typography>
  ) : componentState === ComponentState.ERROR ? (
    <Typography
      variant="h4"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      Error loading
    </Typography>
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
      {isAR ? (
        ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
          <LocationBasedARDisplay
            name={title}
            src={fileInfo.filename}
            map={ARTypeInfo.map}
            place={ARTypeInfo.place}
            tolerance={ARTypeInfo.tolerance}
            position={position}
            scale={scale}
            entityType={AREntityTypes.Image}
          />
        ) : (
          <ImageTrackingBasedARDisplay
            name={title}
            markerSrc={
              ARTypeInfo.trigger_mode == ARTriggerMode.QRCode
                ? ARTypeInfo.qr_code
                : ARTypeInfo.image.filename
            }
            src={url}
            position={position}
            scale={scale}
            entityType={AREntityTypes.Image}
          />
        )
      ) : (
        <>
          <Typography variant="h4">{title}</Typography>

          <img
            onError={(e) => {
              // if blob is not valid, fetch the image from the server
              if (fileInfo.inputType == "file") {
                repo
                  .getFilePath(fileInfo.filename)
                  .then((filepath) => {
                    e.target.src = filepath;
                  })
                  .catch((e) => {
                    setComponentState(ComponentState.ERROR);
                  });
              }
            }}
            src={url}
            style={{
              width: "auto",
              height: "500px",
              padding: 10,
              display: "block",
            }}
          />

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
        </>
      )}
    </Box>
  );
}
