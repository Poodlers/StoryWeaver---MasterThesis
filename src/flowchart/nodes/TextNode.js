import { Box, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

export default function TextNode(props) {
  const text = props.data?.text ?? "";
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
            fontSize: 15,
            color: textColor,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Texto
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
            sx={{
              px: 3,
              fontSize: 15,
              color: textColor,
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Texto
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
              py: 3,
              fontSize: 12,
              color: textColor,
              fontWeight: 200,
            }}
          >
            <pre style={{ fontFamily: "inherit" }}>{text ?? "Texto vazio"}</pre>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
