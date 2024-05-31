import {
  ButtonBase,
  Dialog,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { textColor } from "../../themes";

export default function ProjectTag(props) {
  const name = props.name;
  const setName = props.setName;
  const color = props.color;
  const onDelete = props.onDelete;
  return (
    <Box
      sx={{
        borderRadius: "5px",
        backgroundColor: color,
        minWidth: "30px",
        minHeight: "20px",
        mx: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <TextField
        aria-autocomplete="off"
        autoComplete="off"
        sx={{
          textAlign: "center",
          backgroundColor: color,
          border: "none",
          outline: "none",
          borderRadius: 2,
          ":&hover": {
            border: "none",
            outline: "none",
          },
          ".MuiInputBase-root": {
            textAlign: "center",
          },
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            "& .MuiInput-input": {
              textAlign: "center !important",
              color: "black",
              fontSize: "17px",
              borderRadius: 2,
            },
          },
        }}
        id="standard-basic"
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <IconButton onClick={() => onDelete(name)}>
        <Icon>delete</Icon>
      </IconButton>
    </Box>
  );
}
