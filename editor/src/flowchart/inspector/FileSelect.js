import { AttachFileOutlined, CloseOutlined } from "@mui/icons-material";
import { Checkbox, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { MuiFileInput } from "mui-file-input";
import React from "react";
import { FileTypesInput } from "../../models/FileTypesInput";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { v4 as uuid } from "uuid";
import { BlobReader, ZipReader } from "@zip.js/zip.js";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

async function getFileNamesFromZip(fileBlob) {
  const zipReader = new ZipReader(new BlobReader(fileBlob));
  const entries = await zipReader.getEntries();
  return entries.map((entry) => entry.filename);
}

function FileSelectField(props) {
  const repo = ApiDataRepository.getInstance();
  const label = props.data.label;
  const generateMarkerFiles = props.generateMarkerFiles;
  const style = props.style;
  const value = props.value;
  const [inputMethod, setInputMethod] = React.useState(value.inputType);
  const handleFieldChange = props.onChange;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Typography
        onClick={() => setInputMethod("file")}
        variant="h7"
        component="div"
        sx={{
          flexGrow: 1,
          width: "100%",
          py: 1,
          px: 2,
          color: textColor,
          mb: 2,
          justifySelf: "start",
          justifyContent: "start",
          textAlign: "center",
          backgroundColor: primaryColor,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          onClick={() => setInputMethod("file")}
          variant="h7"
          component="div"
          sx={{
            flexGrow: 1,
            py: 1,
            px: 2,
            color: textColor,
            m: 0,
            justifySelf: "start",
            justifyContent: "start",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor:
              inputMethod == "file" ? primaryColor : secondaryColor,
          }}
        >
          Ficheiro local
        </Typography>

        <Typography
          onClick={() => setInputMethod("url")}
          variant="h7"
          component="div"
          sx={{
            flexGrow: 1,
            py: 1,
            px: 2,
            color: textColor,
            m: 0,
            justifySelf: "start",
            justifyContent: "start",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor:
              inputMethod == "url" ? primaryColor : secondaryColor,
          }}
        >
          URL
        </Typography>
      </Box>

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
          {inputMethod == "file" ? "Ficheiro:" : "URL:"}
        </Typography>

        {inputMethod == "file" ? (
          <MuiFileInput
            InputProps={{
              inputProps: {
                accept:
                  props.data.acceptedType == FileTypesInput.ThreeDModel
                    ? ".zip"
                    : props.data.acceptedType == FileTypesInput.Image
                    ? ".png, .jpg, .jpeg"
                    : props.data.acceptedType == FileTypesInput.Video
                    ? ".mp4, .avi, .mov"
                    : props.data.acceptedType == FileTypesInput.Audio
                    ? ".mp3, .wav"
                    : ".*",
              },
              sx: {
                flexGrow: 1,
                py: 0,
                color: "black",
                ".MuiFileInput-TextField": {
                  borderRadius: 2,
                  width: "100%",
                  backgroundColor: "#ffffff",
                  color: "black",
                  overflow: "hidden",
                  textAlign: "center",
                },
                ".MuiFileInput-Typography-size-text": {
                  color: "black",
                },
                ".MuiFileInput-ClearIconButton": {
                  color: "black",
                },
              },
              startAdornment: <AttachFileOutlined />,
            }}
            typeof="file"
            clearIconButtonProps={{
              title: "Remove",
              sx: { color: "black" },
              children: <CloseOutlined fontSize="small" />,
            }}
            hideSizeText={false}
            getInputText={(value) => (value ? value : "Select a file")}
            onChange={(file) => {
              if (file === null) return;
              const fileID = uuid();
              const fileName = fileID + file.name;
              file = new File([file], fileName, { type: file.type });
              repo
                .uploadFile(file)
                .then((res) => {
                  const urlObj = URL.createObjectURL(file);

                  if (props.data.acceptedType == FileTypesInput.ThreeDModel) {
                    getFileNamesFromZip(file).then((fileNames) => {
                      if (fileNames.find((name) => name.includes(".obj"))) {
                        handleFieldChange(props.data.name, {
                          blob: urlObj,
                          filename: fileName,
                          inputType: "file",
                          modelType: ThreeDModelTypes.obj,
                        });
                      } else if (
                        fileNames.find((name) => name.includes(".fbx"))
                      ) {
                        handleFieldChange(props.data.name, {
                          blob: urlObj,
                          filename: fileName,
                          inputType: "file",
                          modelType: ThreeDModelTypes.fbx,
                        });
                      } else if (
                        fileNames.find((name) => name.includes(".gltf"))
                      ) {
                        handleFieldChange(props.data.name, {
                          blob: urlObj,
                          filename: fileName,
                          inputType: "file",
                          modelType: ThreeDModelTypes.gltf,
                        });
                      }
                    });
                  } else {
                    handleFieldChange(props.data.name, {
                      blob: urlObj,
                      filename: fileName,
                      inputType: "file",
                    });
                  }

                  if (generateMarkerFiles) {
                    repo
                      .requestGenerateMarkerFiles(fileName)
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
            value={value.inputType == "file" ? value.filename : ""}
            sx={{
              flexGrow: 1,
              py: 0,
              px: 1,
              color: "black",
              mx: "10px",
              borderRadius: 0,
              ".MuiInputBase-root": {
                borderRadius: 2,
                backgroundColor: "#ffffff",
                overflow: "hidden",
              },
              ".MuiFileInput-Typography-size-text": {
                color: "black",
              },
            }}
          />
        ) : (
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
                textAlign: "start",
              },
            }}
            sx={{
              flexGrow: 1,
              py: 0,
              px: 1,
              color: textColor,
              mx: "10px",
              borderRadius: 0,
              ".MuiInputBase-root": {
                borderRadius: 2,
                backgroundColor: "#ffffff",
              },
            }}
            id="outlined-basic"
            variant="outlined"
            value={value.inputType == "url" ? value.filename : ""}
            onChange={(event) => {
              handleFieldChange(props.data.name, {
                blob: null,
                inputType: "url",
                filename: event.target.value,
              });
              if (generateMarkerFiles) {
                fetch(event.target.value)
                  .then((res) => res.blob())
                  .then((blob) => {
                    if (!blob.type.includes("image")) return;
                    const uri = event.target.value;
                    const extension = uri.substring(uri.lastIndexOf("."));
                    const fileName = uuid() + extension;
                    const file = new File([blob], fileName);
                    repo
                      .uploadFile(file)
                      .then((res) => {
                        repo
                          .requestGenerateMarkerFiles(fileName)
                          .then((res) => {
                            console.log(res);
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default FileSelectField;
