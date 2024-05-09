import { Box, Typography } from "@mui/material";
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

export default function CharacterNode(props) {
  const title = props.data?.name ?? "";
  const endNodes =
    props.data.dialog.nodes.filter((nodes) => nodes.type == "endDialogNode") ??
    [];

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
          sx={{ px: 2, fontSize: 15, color: textColor, fontWeight: 400 }}
        >
          Diálogo Personagem
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: secondaryColor,
          borderColor: tertiaryColor,
          borderWidth: 2,
          borderStyle: "solid",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}
          >
            Título da Conversa
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: secondaryColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              px: 3,
              py: 1,
              fontSize: 12,
              color: textColor,
              fontWeight: 200,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: secondaryColor,
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
              sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}
            >
              Fins possíveis
            </Typography>
          </Box>
          {endNodes.map((node, index) => {
            console.log(node);
            return (
              <div key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    px: 3,
                    py: 0.6,
                    fontSize: 12,
                    color: textColor,
                    fontWeight: 200,
                  }}
                >
                  {"Fim " + node.data.id}
                </Typography>
                <Handle
                  type="source"
                  position={Position.Right}
                  style={{
                    marginTop: 30 * index + (1 / endNodes.length) * 75 + "px",
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
