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
  fs,
  TextReader,
  ZipReader,
} from "@zip.js/zip.js";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";
const { FS } = fs;

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
    var mainFileBlob = { data: undefined };
    repo
      .getFile(file.filename)
      .then(async (file) => {
        const zipFs = new FS();

        await zipFs.importBlob(file);
        const realFilesToBlobNames = {};

        async function processZipThreeDModelChildren(
          entry,
          mainBlob,
          parentsNames = []
        ) {
          if (entry.data.directory) {
            for (const child of entry.children) {
              await processZipThreeDModelChildren(child, mainBlob, [
                ...parentsNames,
                entry.name,
              ]);
            }
          } else {
            const data = await entry.data.getData(new BlobWriter());

            if (entry.name.split(".")[1] === modelType) {
              mainBlob.data = data;
            } else if (entry.name.split(".")[1] === "mtl") {
              const createdURL = URL.createObjectURL(data);
              setOtherFile(createdURL);
            } else {
              const createdURL = URL.createObjectURL(data);
              realFilesToBlobNames[createdURL] =
                parentsNames.length > 0
                  ? parentsNames.join("/") + "/" + entry.name
                  : entry.name;
            }
          }
        }

        for (const entry of zipFs.root.children) {
          await processZipThreeDModelChildren(entry, mainFileBlob);
        }

        const rawTextData = await new BlobReader(mainFileBlob.data).readable
          .getReader()
          .read();
        var string = new TextDecoder().decode(rawTextData.value);
        for (const [key, value] of Object.entries(realFilesToBlobNames)) {
          string = string.replace(value, key);
        }

        const mainModelBlob = new Blob([string]);

        const mainFileURL = URL.createObjectURL(mainModelBlob);
        setFileURL(mainFileURL);

        setComponentState(ComponentState.LOADED);
      })
      .catch((error) => {
        console.log(error);
        setComponentState(ComponentState.ERROR);
      });
  }, []);

  const setNextNode = props.setNextNode;

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
          <ImageTrackingBasedARDisplay
            name={name}
            markerSrc={ARTypeInfo.image}
            src={fileURL}
            position={position}
            scale={scale}
            entityType={AREntityTypes.ThreeDModel}
            threeDModelType={modelType}
          />
        )
      ) : (
        <div>Will implement</div>
      )}
      <ButtonBase
        sx={{
          backgroundColor: backgroundColor,
          color: textColor,
          position: "absolute",
          bottom: "10vh",
          right: 10,
        }}
        onClick={() => {
          document.querySelector("video").remove();
          setNextNode(possibleNextNodes[0]);
        }}
      >
        <Typography variant="h4">Avançar</Typography>
      </ButtonBase>
    </Box>
  );
}
