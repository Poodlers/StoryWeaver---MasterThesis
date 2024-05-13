import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

function MultipleChoiceField(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;
  const options = props.characters;

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
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h7"
          component="div"
          sx={{
            flexGrow: 1,
            py: 1,
            px: 2,
            color: textColor,
            m: 0,
            backgroundColor: primaryColor,
            textAlign: "center",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Select
        sx={{
          color: "black",
          backgroundColor: "white",
          width: "50%",
          height: 40,
          padding: 0,
          margin: 0,
          mt: 2,
          mr: "10px",
        }}
        value={value ? value.name : options[0].name}
        SelectDisplayProps={{
          style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "left",
          },
        }}
      >
        {options.map((character, index) => {
          return (
            <MenuItem
              sx={{
                color: "black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
              }}
              key={index}
              value={character.name}
              onClick={(event) => {
                handleFieldChange(props.data.name, character);
              }}
            >
              {character.name}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}

export default MultipleChoiceField;
