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
import { ComponentState } from "../../models/ComponentState";
import {
  BlobReader,
  BlobWriter,
  ZipDirectoryEntry,
  ZipReader,
} from "@zip.js/zip.js";

export default function ThreeDModelDisplay(props) {
  const repo = ApiDataRepository.getInstance();
  const threeDNode = props.node;
  const file = threeDNode.data.file;
  const position = threeDNode.data.position;
  const scale = threeDNode.data.scale;
  const name = threeDNode.data.name;
  const isAR = threeDNode.data.ar;
  const modelType = file.modelType;
  const ARTypeInfo = threeDNode.data.ar_type;
  const possibleNextNodes = props.possibleNextNodes;
  const [fileURL, setFileURL] = React.useState("");
  const [otherFile, setOtherFile] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  useEffect(() => {
    if (file.inputType === "url") {
      setFileURL(file.filename);
      setComponentState(ComponentState.LOADED);
      return;
    }
    repo
      .getFile(file.filename)
      .then((file) => {
        const blobReader = new BlobReader(file);
        const zipReader = new ZipReader(blobReader);
        const URLBlobToRealFileName = {};
        zipReader
          .getEntries()
          .then((entries) => {
            entries.forEach((entry) => {
              entry.getData(new BlobWriter()).then((data) => {
                if (entry.directory) {
                  console.log(entry.children);
                }
                const createdURL = URL.createObjectURL(data);

                if (entry.filename.split(".")[1] === modelType) {
                  setFileURL(createdURL);
                } else {
                  setOtherFile(createdURL);
                }
              });
            });
          })
          .catch((error) => {
            console.log(error);
            setComponentState(ComponentState.ERROR);
          });
        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        console.log(error);
        setComponentState(ComponentState.ERROR);
      });
  }, []);

  const setNextNode = props.setNextNode;

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
  ) : isAR ? (
    ARTypeInfo.trigger_mode === ARTriggerMode.GPSCoords ? (
      <LocationBasedARDisplay
        name={name}
        additionalFiles={otherFile}
        src={fileURL}
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
