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
import React, { useEffect } from "react";
import {
  BlobReader,
  BlobWriter,
  fs,
  TextReader,
  ZipReader,
} from "@zip.js/zip.js";

import "aframe";

import { Entity, Scene } from "aframe-react";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { ComponentState } from "../../models/ComponentState";
import PlayerTextFinalDisplay from "./util/PlayerTextFinalDisplay";

const { FS } = fs;

export default function ThreeDModelNode(props) {
  const repo = ApiDataRepository.getInstance();
  const name = props.data?.name ?? "";

  const fileInfo = props.data?.file ?? "";
  const modelType = fileInfo.modelType;
  const isAR = props.data?.ar ?? false;
  const scale = props.data?.scale ?? { x: 1, y: 1, z: 1 };
  const position = props.data?.position ?? { x: 0, y: 0, z: 0 };

  const backgroundFileInfo = props.data?.background ?? "";
  const [fileURL, setFileURL] = React.useState("");
  const [otherFile, setOtherFile] = React.useState("");
  const [componentState, setComponentState] = React.useState(
    ComponentState.LOADING
  );

  const [backgroundURL, setBackgroundURL] = React.useState("");

  const [canLookAround, setCanLookAround] = React.useState(false);

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
    if (fileInfo.inputType === "url") {
      setFileURL(fileInfo.filename);
      setComponentState(ComponentState.LOADED);
      return;
    }
    var mainFileBlob = { data: undefined };
    repo
      .getFile(fileInfo.filename)
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
  }, [fileInfo]);

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      setCanLookAround(false);
      console.log("Can't look around");
    }
  };

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
          sx={{
            px: 2,
            zIndex: 10,
            fontSize: 20,
            color: textColor,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Modelo 3D
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
          justifyContent: "space-between",
          width: "375px",
          minHeight: "677px",
        }}
      >
        <PlayerTextFinalDisplay text={name} messageType={"Mensagem"} />

        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {fileURL == "" ? (
            <PlayerTextFinalDisplay
              text={"Nenhum modelo 3D selecionado."}
              style={{ mt: 2, px: 2 }}
            />
          ) : (
            <Scene>
              {document
                .querySelector(".a-enter-vr-button")
                ?.addEventListener("click", () => {
                  setCanLookAround(true);
                  console.log("Can look around");
                })}

              <Entity
                geometry={{ primitive: "box" }}
                material={{ color: "red" }}
                position={{ x: 0, y: 0, z: -5 }}
              />

              <Entity
                gltf-model={
                  "url(" +
                  "http://localhost:8080/files/61df0221-5231-4104-94fd-1e43264d2f84/scene.gltf" +
                  ")"
                }
                position={position}
                scale={scale}
              />

              <Entity text={{ value: "Hello, WebVR!" }} />
              <a-camera
                camera="fov: 80;"
                id="camera"
                position="0 1.6 16"
                look-controls={
                  "enabled:false; reverseMouseDrag:false; touchEnabled: false;"
                }
              ></a-camera>
            </Scene>
          )}
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
