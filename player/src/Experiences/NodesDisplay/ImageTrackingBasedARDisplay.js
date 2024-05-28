import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import { AREntityTypes } from "../../models/AREntityTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";
import VideoImageTrackingARDisplay from "./VideoImageTrackingARDisplay";
import ImageImageTrackingARDisplay from "./ImageImageTrackingARDisplay";

export default function ImageTrackingBasedARDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const markerSrc = props.markerSrc;
  const name = props.name;
  const position = props.position;
  const rotation = props.rotation;
  const scale = props.scale;
  const src = props.src;
  const additionalFiles = props.additionalFiles;
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );
  const [imageDescriptorsPath, setImageDescriptorsPath] = React.useState("");

  useEffect(() => {
    repo
      .getFilePath(markerSrc.split(".")[0])
      .then((path) => {
        setImageDescriptorsPath(path);
        console.log("Image Descriptors Path: " + path);
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        console.error(error);
        setComponentState(ComponentState.ERROR);
      });
  }, []);

  const entityType = props.entityType;
  const threeDModelType = props.threeDModelType;

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
      {componentState === ComponentState.LOADING ? (
        <div>Loading...</div>
      ) : componentState === ComponentState.ERROR ? (
        <div>Error loading map</div>
      ) : (
        <div>
          {entityType === AREntityTypes.ThreeDModel ? null : entityType ===
            AREntityTypes.Video ? (
            <VideoImageTrackingARDisplay
              src={src}
              markerSrc={imageDescriptorsPath}
              position={position}
              rotation={rotation}
              scale={scale}
            ></VideoImageTrackingARDisplay>
          ) : AREntityTypes.Image ? (
            <ImageImageTrackingARDisplay
              src={src}
              markerSrc={imageDescriptorsPath}
              position={position}
              rotation={rotation}
              scale={scale}
            ></ImageImageTrackingARDisplay>
          ) : AREntityTypes.ThreeDModel ? (
            <div>
              <Typography variant="h4">3D Model</Typography>
            </div>
          ) : null}
        </div>
      )}
    </Box>
  );
}
