import { DeleteOutline } from "@mui/icons-material";
import { Icon, IconButton, Input, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { InputFieldType } from "../models/InputFieldTypes";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import CheckboxField from "./inspector/Checkbox";
import FileSelectField from "./inspector/FileSelect";
import MultipleChoiceCheckboxField from "./inspector/MultipleChoiceCheck";
import SelectLocationField from "./inspector/SelectLocation";
import TextFieldInspector from "./inspector/TextField";
import TextFieldExpandable from "./inspector/TextFieldExpandable";
import TextFieldMultiline from "./inspector/TextFieldMultiline";
import ThreeDCoordField from "./inspector/ThreeDCoordField";

function Inspector(props) {
  const values = props.value;
  const nodeId = props.nodeId;
  const setValues = props.setValue;
  const handleNodeDataChange = props.handleNodeDataChange;
  const handleDelete = props.handleDelete;
  const handleFieldChange = (fieldId, value) => {
    setValues({ ...values, [fieldId]: value });
    handleNodeDataChange(nodeId, { ...values, [fieldId]: value });
  };

  return props.data !== undefined ? (
    <Box
      sx={{
        width: "32vw",
        backgroundColor: secondaryColor,
        overflowY: "scroll",
        scrollbarWidth: "thin",
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
        resize: "horizontal",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h7"
          component="div"
          sx={{
            color: textColor,
            flexGrow: 1,
            py: 1,
            px: 2,
            color: "white",
            m: 0,
            borderWidth: 1,
            borderColor: tertiaryColor,
            borderStyle: "solid",
            backgroundColor: primaryColor,
          }}
        >
          Inspector
        </Typography>

        <Typography
          variant="h7"
          component="div"
          sx={{ flexGrow: 1, py: 1, px: 2, color: "white", m: 0 }}
        >
          {props.data.nodeType}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.data.fields.map((field, index) => {
          switch (field.type) {
            case InputFieldType.textField:
              return (
                <TextFieldInspector
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></TextFieldInspector>
              );
            case InputFieldType.threeDCoord:
              return (
                <ThreeDCoordField
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></ThreeDCoordField>
              );
            case InputFieldType.select_location:
              return (
                <SelectLocationField
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></SelectLocationField>
              );
            case InputFieldType.checkbox:
              return (
                <CheckboxField
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></CheckboxField>
              );
            case InputFieldType.multichoice_check:
              return (
                <MultipleChoiceCheckboxField
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></MultipleChoiceCheckboxField>
              );
            case InputFieldType.textFieldExpandable:
              return (
                <TextFieldExpandable
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></TextFieldExpandable>
              );
            case InputFieldType.file_select:
              return (
                <FileSelectField
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></FileSelectField>
              );
            case InputFieldType.textFieldMultiline:
              return (
                <TextFieldMultiline
                  key={index}
                  id={index}
                  onChange={handleFieldChange}
                  value={values[field.name]}
                  data={field}
                  style={{ mt: 2 }}
                ></TextFieldMultiline>
              );
          }
        })}
        <Box
          onClick={() => handleDelete(nodeId)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
            cursor: "pointer",
          }}
        >
          <Icon
            fontSize="inherit"
            sx={{ color: tertiaryColor, mt: 2, fontSize: "50px !important" }}
          >
            <DeleteOutline fontSize="inherit"></DeleteOutline>
          </Icon>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: tertiaryColor, mt: 0, fontWeight: "bolder" }}
          >
            Apagar
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : null;
}

export default Inspector;
