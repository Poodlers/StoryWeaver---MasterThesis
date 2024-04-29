import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Icon, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

function TextFieldMultiline(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
        width: "100%",
      }}
    >
      <Typography
        variant="h7"
        component="div"
        sx={{
          flexGrow: 1,
          py: 1,
          color: textColor,
          m: 0,
          backgroundColor: primaryColor,
          width: "100%",
        }}
      >
        {label}
      </Typography>

      <TextField
        id="outlined-multiline"
        multiline
        rows={4}
        value={value}
        inputProps={{
          style: {
            borderRadius: 0,
            color: "black",
            height: 40,
            padding: 0,
            margin: 0,
            borderColor: "transparent",
            borderWidth: 0,
            backgroundColor: "white",
            borderRadius: 10,
          },
        }}
        sx={{
          ".MuiInputBase-root": {
            borderRadius: 2,
            backgroundColor: "#ffffff",
            color: "black",
          },
          flexGrow: 1,
          py: 1,
          px: 2,
          color: "black",
          mx: 2,
          mt: 2,
          width: "90%",
        }}
        onChange={(e) => handleFieldChange(props.data.name, e.target.value)}
      />
    </Box>
  );
}

export default TextFieldMultiline;