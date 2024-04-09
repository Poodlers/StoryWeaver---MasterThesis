import { DeleteOutline } from "@mui/icons-material";
import { ButtonBase, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { primaryColor, tertiaryColor, textColor } from "../themes";
import { iconPerson } from "./MarkerIcon";

const markerToIcon = {
  person: iconPerson,
  place: iconPerson,
  event: iconPerson,
  default: iconPerson,
};

export default function AnchorMarker(props) {
  const [position, setPosition] = React.useState(props.position);
  const markerType = props.markerType;
  const icon = markerToIcon[markerType];
  const [link, setLink] = React.useState("");
  const map = useMapEvents({
    click(e) {
      console.log(e);
      setPosition(e.latlng);
      console.log(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker icon={iconPerson} position={position}>
      <Popup className="request-popup">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ py: 1, px: 2, color: textColor, m: 0, textAlign: "start" }}
            >
              Link:
            </Typography>
            <TextField
              value={link}
              onChange={(e) => setLink(e.target.value)}
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
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ py: 1, px: 2, color: textColor, m: 0, textAlign: "start" }}
            >
              Lat , Long:
            </Typography>
            <TextField
              value={position.lat + " , " + position.lng}
              onChange={(e) => setLink(e.target.value)}
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
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonBase
              sx={{
                backgroundColor: tertiaryColor,
                color: textColor,
                p: 2,
                borderRadius: 3,
                margin: "10px",
              }}
              onClick={() => {
                window.open(link, "_blank");
              }}
            >
              Usar a minha posição
            </ButtonBase>
            <IconButton
              sx={{
                backgroundColor: primaryColor,
                color: tertiaryColor,
                p: 2,
                borderRadius: 3,
                fontSize: "40px !important",
              }}
              onClick={() => {
                setPosition(null);
              }}
            >
              <DeleteOutline fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Popup>
    </Marker>
  );
}
