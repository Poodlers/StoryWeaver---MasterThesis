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

function TextFieldExpandable(props) {
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

      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value.map((val, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "row",
                mt: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h7"
                component="div"
                sx={{
                  textAlign: "start",
                  flexGrow: 1,
                  py: 1,
                  px: 2,
                  color: textColor,
                  m: 0,
                }}
              >
                Resposta {index + 1}
              </Typography>
              <TextField
                fullWidth
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
                  flexGrow: 1,
                  py: 0,
                  px: 2,
                  color: textColor,
                  mx: "10px",
                  borderRadius: 0,
                  ".MuiInputBase-root": {
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: "#ffffff",
                  },
                }}
                id="outlined-basic"
                variant="outlined"
                value={val}
                onChange={(event) => {
                  handleFieldChange(props.data.name, [
                    ...value.slice(0, index),
                    event.target.value,
                    ...value.slice(index + 1),
                  ]);
                }}
              />
              <Icon
                sx={{ color: textColor, cursor: "pointer", flexGrow: 0 }}
                onClick={() => {
                  handleFieldChange(props.data.name, [
                    ...value.slice(0, index),
                    ...value.slice(index + 1),
                  ]);
                }}
              >
                <RemoveCircle> </RemoveCircle>
              </Icon>
            </Box>
          );
        })}

        <Icon
          sx={{ color: textColor, cursor: "pointer" }}
          onClick={() => {
            handleFieldChange(props.data.name, [...value, "Nova Resposta"]);
          }}
        >
          <AddCircle> </AddCircle>
        </Icon>
      </Box>
    </Box>
  );
}

export default TextFieldExpandable;
