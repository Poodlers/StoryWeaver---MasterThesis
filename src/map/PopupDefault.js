import { DeleteOutline } from "@mui/icons-material";
import {
  Button,
  ButtonBase,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { primaryColor, tertiaryColor, textColor } from "../themes";

export default function PopupAnchor(props) {
  const marker = props.marker;
  const maps = props.maps;
  const setMaps = props.setMaps;
  const mapInfo = props.mapInfo;
  const anchorId = props.anchorId;
  const position = mapInfo.anchors.find(
    (anchor) => anchor.anchorId == anchorId
  ).coords;
  const [link, setLink] = React.useState("");

  const deleteMarker = () => {
    marker.remove();
    mapInfo.anchors = mapInfo.anchors.filter(
      (anchor) => anchor.anchorId != anchorId
    );
    const newMaps = maps.filter((map) => map.id != mapInfo.id);
    newMaps.push(mapInfo);
    setMaps(newMaps);
    localStorage.setItem("maps", JSON.stringify(newMaps));
  };
  const fillCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = document.getElementById("latitude-coords-" + anchorId);
        const longitude = document.getElementById(
          "longitude-coords-" + anchorId
        );
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        mapInfo.anchors.find((anchor) => anchor.anchorId == anchorId).coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const newMaps = maps.filter((map) => map.id != mapInfo.id);
        newMaps.push(mapInfo);
        setMaps(newMaps);
        localStorage.setItem("maps", JSON.stringify(newMaps));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    marker.on("dragend", (e) => {});
  }, [marker]);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const deleteButton = document.getElementById("deletebutton" + anchorId);
      const useMyPosition = document.getElementById(
        "positionbutton" + anchorId
      );
      if (deleteButton) {
        if (deleteButton.contains(e.target)) {
          console.log("deleting anchor", anchorId);

          deleteMarker();
        }
      }
      if (useMyPosition) {
        if (useMyPosition.contains(e.target)) {
          fillCurrentPosition();
        }
      }
    });

    return () => {
      document.onclick = null;
    };
  }, []);

  return (
    <Box
      className="request-popup"
      sx={{
        backgroundColor: primaryColor,
      }}
    >
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
            Lat:
          </Typography>
          <TextField
            id={"latitude-coords-" + anchorId}
            value={position ? position.lat : ""}
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
            Long:
          </Typography>
          <TextField
            id={"longitude-coords-" + anchorId}
            value={position ? position.lng : ""}
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
            id={"positionbutton" + anchorId}
            sx={{
              backgroundColor: tertiaryColor,
              color: textColor,
              p: 2,
              borderRadius: 3,
              margin: "10px",
            }}
          >
            Usar a minha posição
          </ButtonBase>
          <IconButton
            id={"deletebutton" + anchorId}
            sx={{
              backgroundColor: tertiaryColor,
              color: textColor,
              p: 2,
              borderRadius: 3,
              margin: "10px",
            }}
          >
            <DeleteOutline />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
