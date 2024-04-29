import { Box, Icon, Typography } from "@mui/material";
import { Handle, Position } from "reactflow";
import {
  leftNodeHandleStyle,
  rightNodeHandleStyle,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";

export default function EndNode(props) {
  const id = props.data.id ?? "";
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={leftNodeHandleStyle}
      />
      <Box
        sx={{
          backgroundColor: "red",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 150,
          width: 150,
          borderRadius: 100,
        }}
      >
        <Typography
          variant="h7"
          component="div"
          sx={{
            color: textColor,
            textAlign: "center",
            m: "0 auto",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          {"Fim " + id}
        </Typography>
      </Box>
    </>
  );
}
