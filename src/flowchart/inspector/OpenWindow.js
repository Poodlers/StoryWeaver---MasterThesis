import { ButtonBase, Checkbox, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

function OpenWindowField(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <ButtonBase
        sx={{
          py: 1,
          flexGrow: 1,
          px: 2,
          color: textColor,
          backgroundColor: tertiaryColor,
          mx: "10px",
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 0,
          textAlign: "end",
          ".MuiInputBase-root": {
            borderRadius: 2,
            backgroundColor: "#ffffff",
          },

          "&:focused": {
            backgroundColor: "transparent",
          },
          "&:active": {
            backgroundColor: "transparent",
          },
        }}
        onClick={() => {
          handleFieldChange("open", "open");
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
            justifySelf: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Abrir Janela de Diálogo
        </Typography>
      </ButtonBase>
    </Box>
  );
}

export default OpenWindowField;
