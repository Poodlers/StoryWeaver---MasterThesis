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

export default function PopupMarker(props) {
  const marker = props.marker;
  const maps = props.maps;
  const setMaps = props.setMaps;
  const mapInfo = props.mapInfo;
  const setAlertDisplay = props.setAlertDisplay;
  const setAlertText = props.setAlertText;
  const anchorId = props.anchorId;

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

  useEffect(() => {
    marker.on("dragend", (e) => {});
  }, [marker]);

  const getFullURL = async (link) => {};

  useEffect(() => {
    document.addEventListener("input", async (e) => {
      const name = document.getElementById("name-" + anchorId);
      const description = document.getElementById("description-" + anchorId);
      const anchor = mapInfo.anchors.find(
        (anchor) => anchor.anchorId == anchorId
      );
      anchor.name = name.value;
      anchor.description = description.value;
      const newMaps = maps.filter((map) => map.id != mapInfo.id);
      newMaps.push(mapInfo);
      setMaps(newMaps);
      localStorage.setItem("maps", JSON.stringify(newMaps));
    });

    document.addEventListener("click", (e) => {
      const deleteButton = document.getElementById("deletebutton" + anchorId);

      if (deleteButton) {
        if (deleteButton.contains(e.target)) {
          console.log("deleting anchor", anchorId);

          deleteMarker();
        }
      }
    });

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
            Nome:
          </Typography>
          <TextField
            id={"name-" + anchorId}
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
            Descrição:
          </Typography>
          <TextField
            aria-multiline="true"
            id={"description-" + anchorId}
            inputProps={{
              style: {
                minWidth: "100px",
                borderRadius: 0,
                color: "black",
                height: 100,
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
