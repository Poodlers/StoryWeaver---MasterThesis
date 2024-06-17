import { Image, Search, SearchOffTwoTone } from "@mui/icons-material";
import { Dialog, Grid, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { MarkerTypes, possibleMarkers } from "../../models/MarkerTypes";
import { primaryColor, secondaryColor, textColor } from "../../themes";
import { ARTriggerMode } from "../../models/ARTriggerModes";
import LocationBasedARDisplay from "./LocationBasedARDisplay";
import ImageTrackingBasedARDisplay from "./ImageTrackingBasedARDisplay";

export default function ARDialog(props) {
  const open = props.open;
  const onClose = props.onClose;
  const title = props.title;
  const src = props.src;
  const ARTypeInfo = props.ARTypeInfo;
  const position = props.position;
  const scale = props.scale;
  const rotation = props.rotation;
  const AREntityType = props.AREntityType;
  const markerSrc = props.markerSrc;
  const autoplay = props.autoplay;
  const threeDModelType = props.threeDModelType;
  const color = props.color;
  return (
    <Dialog
      id="display-ar-dialog"
      open={open}
      fullWidth
      PaperProps={{
        sx: {
          height: "90%",
          maxHeight: "90%",
          overflow: "hidden",
        },
      }}
      maxWidth="lg"
      onClose={() => onClose()}
      sx={{
        width: "100%",
        scrollbarWidth: "thin",
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: secondaryColor,
          zIndex: 1,
          m: "0 auto",
        }}
      >
        <Icon
          fontSize="large"
          onClick={() => onClose()}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "black",
            ml: "auto",
            fontSize: "50px !important",
            cursor: "pointer",
          }}
        >
          close
        </Icon>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{
              py: 1,
              px: 2,
              color: textColor,
              textAlign: "center",
              ml: "auto",
              fontWeight: "bold",
              fontSize: 30,
              backgroundColor: primaryColor,
              mt: 2,
            }}
          >
            VISUALIZAR AR
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          {ARTypeInfo.trigger_mode == ARTriggerMode.GPSCoords ? (
            <LocationBasedARDisplay
              name={title}
              src={src}
              map={ARTypeInfo.map}
              place={ARTypeInfo.place}
              tolerance={ARTypeInfo.tolerance}
              position={position}
              rotation={rotation}
              scale={scale}
              entityType={AREntityType}
              autoplay={autoplay}
              threeDModelType={threeDModelType}
              color={color}
            />
          ) : (
            <ImageTrackingBasedARDisplay
              name={title}
              markerSrc={markerSrc}
              src={src}
              position={position}
              rotation={rotation}
              scale={scale}
              threeDModelType={threeDModelType}
              entityType={AREntityType}
              autoplay={autoplay}
              color={color}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
