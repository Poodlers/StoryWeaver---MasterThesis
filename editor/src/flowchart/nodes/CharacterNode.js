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

export default function CharacterNode(props) {
  const repo = ApiDataRepository.getInstance();
  const title = props.data?.name ?? "";
  const endNodes =
    props.data.dialog.nodes.filter((nodes) => nodes.type == "endDialogNode") ??
    [];
  const backgroundFileInfo = props.data?.background ?? "";
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
          justifyContent: "start",
          borderWidth: 2,
          borderStyle: "solid",
        }}
      >
        <Typography
          variant="h6"
          sx={{ px: 2, fontSize: 20, color: textColor, fontWeight: 500 }}
        >
          Diálogo
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
          messageType={"Diálogo"}
          style={{ mb: 2 }}
        />

        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: primaryColor,
            }}
          >
            <Typography
              variant="h6"
              sx={{ px: 3, fontSize: 18, color: textColor, fontWeight: 500 }}
            >
              Fins possíveis
            </Typography>
          </Box>
          {endNodes.map((node, index) => {
            return (
              <div
                key={index}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <PlayerTextFinalDisplay style={{ mb: 2 }} text={node.data.id} />
                <Handle
                  type="source"
                  position={Position.Right}
                  style={{
                    marginTop: 70 * index + 20,
                    ...rightNodeHandleStyle,
                  }}
                  id={node.data.id}
                />
              </div>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
