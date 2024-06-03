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

export default function BeginNode(props) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        style={rightNodeHandleStyle}
      />
      <Box
        sx={{
          backgroundColor: "#7080B9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 150,
          width: 150,
          borderRadius: 100,
        }}
      >
        {/*


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
          Início
        </Typography>
          */}

        <Icon
          sx={{
            fontSize: "90px !important",
          }}
        >
          start
        </Icon>
      </Box>
    </>
  );
}
