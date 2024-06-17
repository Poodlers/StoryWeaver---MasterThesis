import {
  Checkbox,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import ARDialog from "../ar_displays/ARDialog";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import { ApiDataRepository } from "../../api/ApiDataRepository";
import { AREntityTypes } from "../../models/AREntityTypes";

function ARPreviewField(props) {
  const repo = ApiDataRepository.getInstance();
  const label = props.data.label;
  const style = props.style;
  const conditional = props.conditional == undefined ? true : props.conditional;
  const [open, setOpen] = React.useState(false);
  const handleFieldChange = props.onChange;
  const title = props.title;
  const fileInfo = props.fileInfo;
  const ARTypeInfo = props.ARTypeInfo;
  const position = props.position;
  const scale = props.scale;
  const rotation = props.rotation;
  const AREntityType = props.AREntityType;
  const character = props.character;
  const [markerSrc, setMarkerSrc] = React.useState("");
  const [characterImg, setCharacterImg] = React.useState("");
  const [fileURL, setFileURL] = React.useState("");
  const modelType = fileInfo ? fileInfo.modelType : undefined;
  const autoplay = props.autoplay;
  const color = props.color;

  useEffect(() => {
    if (fileInfo === undefined) {
      return;
    }
    if (fileInfo.inputType === "url") {
      setFileURL(fileInfo.filename);
      return;
    }
    if (AREntityType !== AREntityTypes.ThreeDModel) {
      repo
        .getFilePath(fileInfo.filename)
        .then((path) => {
          setFileURL(path);
          console.log("URL da preview: " + path);
        })
        .catch((error) => {});
    } else {
      repo.getThreeDModelPath(fileInfo.filename, modelType).then((path) => {
        setFileURL(path);
      });
    }
  }, []);

  useEffect(() => {
    if (ARTypeInfo.trigger_mode == ARTriggerMode.QRCode) {
      repo.getFilePath(ARTypeInfo.qr_code).then((url) => {
        setMarkerSrc(url);
      });
    } else {
      if (ARTypeInfo.image.inputType == "url") {
        setMarkerSrc(ARTypeInfo.image.filename);
      } else {
        repo
          .getFilePath(ARTypeInfo.image.filename.split(".")[0])
          .then((url) => {
            setMarkerSrc(url);
          });
      }
    }
  }, [ARTypeInfo]);

  useEffect(() => {
    if (character.image.filename == "") {
      return;
    }
    if (character.image.inputType == "url") {
      setCharacterImg(character.image.filename);
    } else {
      repo.getFilePath(character.image.filename).then((url) => {
        setCharacterImg(url);
      });
    }
  }, [character]);
  return (
    <Box
      sx={{
        display: conditional ? "flex" : "none",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <ARDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        src={fileURL}
        ARTypeInfo={ARTypeInfo}
        position={position}
        scale={scale}
        rotation={rotation}
        AREntityType={AREntityType}
        markerSrc={markerSrc}
        autoplay={autoplay}
        threeDModelType={modelType}
        color={color}
      />
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
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ color: primaryColor, px: 2 }}
      >
        <Icon
          sx={{
            fontSize: "35px !important",
            color: primaryColor,
          }}
        >
          play_arrow
        </Icon>
      </IconButton>
    </Box>
  );
}

export default ARPreviewField;
