import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

function ThreeDCoordField(props) {
  const label = props.data.label;
  const style = props.style;

  const conditional = props.conditional ? props.conditional : true;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
    <Box
      sx={{
        display: conditional ? "flex" : "none",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Typography
        variant="h7"
        component="div"
        sx={{
          py: 1,
          px: 2,
          color: textColor,
          m: 0,
          width: "50px",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{ py: 1, px: 1, color: textColor, m: 0, textAlign: "center" }}
          >
            x
          </Typography>
          <TextField
            inputProps={{
              style: {
                borderRadius: 0,
                color: "black",
                height: 40,
                padding: 0,
                margin: 0,
                borderColor: "transparent",
                borderWidth: 0,
                backgroundColor: "#ffffff",

                borderRadius: 10,
              },
            }}
            sx={{
              color: textColor,
              mr: "10px",
              borderRadius: 0,
              maxWidth: "50px",
              ".MuiInputBase-root": {
                borderRadius: 2,
                px: 1,
                backgroundColor: "#ffffff",
              },
            }}
            id="outlined-basic"
            variant="outlined"
            value={value ? value.x : 0}
            onChange={(event) => {
              handleFieldChange(props.data.name, {
                x: event.target.value,
                y: value ? value.y : 0,
                z: value ? value.z : 0,
              });
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{ py: 1, px: 1, color: textColor, m: 0, textAlign: "center" }}
          >
            y
          </Typography>
          <TextField
            inputProps={{
              style: {
                borderRadius: 0,
                color: "black",
                height: 40,
                padding: 0,
                margin: 0,
                borderColor: "transparent",
                borderWidth: 0,
                backgroundColor: "#ffffff",
                borderRadius: 10,
              },
            }}
            sx={{
              py: 0,
              px: 0,
              color: textColor,
              mr: "10px",
              borderRadius: 0,
              maxWidth: "50px",
              ".MuiInputBase-root": {
                borderRadius: 2,
                px: 1,
                backgroundColor: "#ffffff",
              },
            }}
            id="outlined-basic"
            variant="outlined"
            value={value ? value.y : 0}
            onChange={(event) => {
              handleFieldChange(props.data.name, {
                x: value ? value.x : 0,
                y: event.target.value,
                z: value ? value.z : 0,
              });
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{ py: 1, px: 1, color: textColor, m: 0, textAlign: "center" }}
          >
            z
          </Typography>

          <TextField
            inputProps={{
              style: {
                borderRadius: 0,
                color: "black",
                height: 40,
                padding: 0,
                margin: 0,
                borderColor: "transparent",
                borderWidth: 0,
                backgroundColor: "#ffffff",
                borderRadius: 10,
              },
            }}
            sx={{
              py: 0,
              px: 0,
              color: textColor,
              mr: "10px",
              borderRadius: 0,
              maxWidth: "50px",
              ".MuiInputBase-root": {
                borderRadius: 2,
                px: 1,
                backgroundColor: "#ffffff",
              },
            }}
            id="outlined-basic"
            variant="outlined"
            value={value ? value.z : 0}
            onChange={(event) => {
              handleFieldChange(props.data.name, {
                x: value ? value.x : 0,
                y: value ? value.y : 0,
                z: event.target.value,
              });
            }}
          />
        </div>
      </div>
    </Box>
  );
}

export default ThreeDCoordField;
