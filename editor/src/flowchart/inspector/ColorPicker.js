import { Checkbox, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { SketchPicker } from "react-color";
import { textColor } from "../../themes";

function ColorPicker(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;
  const [open, setOpen] = React.useState(false);

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
      <Typography
        variant="h7"
        component="div"
        sx={{
          py: 1,
          px: 2,
          color: textColor,
          m: 0,
          justifySelf: "start",
          justifyContent: "start",
          textAlign: "start",
        }}
      >
        {label}
      </Typography>
      <div
        style={{
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            backgroundColor: value,
          }}
        />
      </div>
      {open ? (
        <div>
          <div
            onClick={() => {
              setOpen(false);
            }}
          />
          <SketchPicker
            color={value}
            onChange={(color) => {
              handleFieldChange(props.data.name, color.hex);
            }}
          />
        </div>
      ) : null}
    </Box>
  );
}

export default ColorPicker;
