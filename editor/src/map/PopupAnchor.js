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
  const setAlertDisplay = props.setAlertDisplay;
  const setAlertText = props.setAlertText;
  const anchorId = props.anchorId;
  const position = mapInfo.anchors.find(
    (anchor) => anchor.anchorId == anchorId
  ).coords;
  if (mapInfo.progressionState != "not-started") {
    marker.options.draggable = false;
  }
  const inputEventListener = (e) => {
    const latitude = document.getElementById("latitude-coords-" + anchorId);
    const longitude = document.getElementById("longitude-coords-" + anchorId);
    const anchor = mapInfo.anchors.find(
      (anchor) => anchor.anchorId == anchorId
    );
    const newLat = Number(latitude.value);
    const newLong = Number(longitude.value);
    if (isNaN(newLat) || isNaN(newLong)) {
      setAlertText("Coordenadas inválidas.");
      setAlertDisplay(true);
      return;
    }

    anchor.coords.lat = newLat;
    anchor.coords.lng = newLong;

    const newMaps = maps.filter((map) => map.id != mapInfo.id);
    newMaps.push(mapInfo);
    setMaps(newMaps);
    localStorage.setItem("maps", JSON.stringify(newMaps));
  };

  const deleteMarker = () => {
    if (
      mapInfo.anchors.length == 2 &&
      mapInfo.progressionState == "anchors-selected"
    ) {
      setAlertText(
        "Não é possível apagar. O mapa deve ter pelo menos 2 âncoras."
      );
      setAlertDisplay(true);
      return;
    }
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
    const latitude = document.getElementById("latitude-coords-" + anchorId);
    const longitude = document.getElementById("longitude-coords-" + anchorId);
    latitude.value = "Carregando...";
    longitude.value = "Carregando...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        latitude.value = "Erro";
        longitude.value = "Erro";
      }
    );
  };

  useEffect(() => {
    marker.on("popupclose", (e) => {
      document.removeEventListener("input", inputEventListener);
    });
  });

  const getFullURL = async (link) => {
    /* NOT WORKING
    const latitude = document.getElementById("latitude-coords-" + anchorId);
    const longitude = document.getElementById("longitude-coords-" + anchorId);
    const url = "https://unshorten.me/api/v2/unshorten?url=" + link;
    const headers = {
      Authorization: "Token  1e9a66d860fa3c643620dcf12e3cd156a2061385",
    };
    fetch(url, {
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const unshortenedURL = data.unshortened_url;
        try {
          var regex = new RegExp("@(.*),(.*),");
          var lat_long_match = url.match(regex);
          var lat = lat_long_match[1];
          var long = lat_long_match[2];
          latitude.value = lat;
          longitude.value = long;
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error("Error:", error);
      });
      */
  };

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

    document.addEventListener("input", inputEventListener);

    return () => {
      document.onclick = null;
      document.oninput = null;
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
