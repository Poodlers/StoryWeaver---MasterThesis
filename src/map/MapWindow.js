import * as React from "react";
import Box from "@mui/material/Box";
import {
  backgroundColor,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import {
  Alert,
  ButtonBase,
  Icon,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import maps from "../data/maps";
import { DeleteOutline } from "@mui/icons-material";
import MapDisplay from "./MapDisplay";
import MapDisplayRawLeaflet from "./MapDisplayRawLeaflet";

export default function MapWindow(props) {
  const [mapsState, setMaps] = React.useState(maps);
  const [displayAlert, setDisplayAlert] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [selectedMap, setSelectedMap] = React.useState(
    maps.length > 0 ? maps[0] : null
  );
  const addNewMap = () => {
    //open the file system and select a png
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png, .jpg, .jpeg";
    fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;

        //get height and width of the image
        const img = new Image();
        img.src = data;
        img.onload = () => {
          const newMap = {
            id: maps.length + 1,
            name: "Novo mapa",
            image: data,
            mapSize: { width: img.width, height: img.height },
            description: "This is your map's description",
            anchors: [],
            places: [
              {
                id: 1,
                name: "Casa de Banho",
                description: "This is a bathroom",
                icon: "bathroom",
                coords: { x: 0, y: 0 },
                realCoords: { lat: 0, long: 0 },
              },
            ],
          };
          setMaps([...mapsState, newMap]);
          maps.push(newMap);
          setSelectedMap(maps[maps.length - 1]);

          localStorage.setItem("maps", JSON.stringify(maps));
        };
      };
      reader.readAsDataURL(file);
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh",
        width: "100%",
        backgroundColor: textColor,
      }}
    >
      {mapsState.length > 0 && selectedMap ? (
        <Box
          sx={{
            wdith: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Select
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: primaryColor,
                    "& .MuiMenuItem-root": {
                      padding: 2,
                    },
                  },
                },
              }}
              sx={{
                backgroundColor: primaryColor,
                color: textColor,
                fontSize: "20px",
                m: 2,
                border: "none",
                outline: "none",
                ".MuiSvgIcon-root": {
                  color: textColor,
                },
              }}
              value={selectedMap}
              onChange={(e) => {
                setSelectedMap(e.target.value);
              }}
            >
              {maps.map((map) => {
                return (
                  <MenuItem
                    sx={{
                      color: textColor,
                      backgroundColor: primaryColor,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "left",
                      "&.Mui-selected": {
                        backgroundColor: secondaryColor,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: secondaryColor,
                      },

                      "&:hover": {
                        backgroundColor: secondaryColor,
                      },
                    }}
                    key={map.id}
                    value={map}
                  >
                    {map.name}
                  </MenuItem>
                );
              })}
            </Select>
            <IconButton
              sx={{
                backgroundColor: "transparent",
                color: textColor,
                border: "none",
                outline: "none",
              }}
              onClick={() => {
                addNewMap();
              }}
            >
              <img
                src="./assets/add_symbol.png"
                alt="Mapa 1"
                style={{ width: "50px", height: "50px" }}
              />
            </IconButton>
            <Box
              sx={{
                p: 0,
                m: 0,

                alignContent: "center !important",
              }}
              onClick={() => {
                //remove the selected map
                const newMaps = maps.filter((map) => map.id !== selectedMap.id);
                maps.splice(maps.indexOf(selectedMap), 1);
                setMaps(newMaps);
                setSelectedMap(newMaps.length > 0 ? newMaps[0] : null);
                localStorage.setItem("maps", JSON.stringify(newMaps));
              }}
            >
              <Icon
                fontSize="inherit"
                sx={{
                  color: tertiaryColor,
                  cursor: "pointer",
                  fontSize: "50px !important",
                }}
              >
                <DeleteOutline fontSize="inherit"></DeleteOutline>
              </Icon>
            </Box>
            {selectedMap.anchors.length < 2 ? (
              <>
                <Typography
                  variant="h7"
                  component="div"
                  sx={{
                    py: 1,
                    px: 2,
                    color: secondaryColor,
                    m: 0,
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Selecione pelo menos dois pontos (de preferência em cantos
                  opostos) e preencha as coordenadas de latitude e longitude.
                </Typography>

                <ButtonBase
                  variant="contained"
                  onClick={() => {
                    if (selectedMap.anchors.length < 2) {
                      setDisplayAlert(true);
                      setAlertText("Selecione pelo menos dois pontos.");
                    }
                  }}
                  sx={{
                    backgroundColor: tertiaryColor,
                    color: textColor,
                    fontSize: "20px",
                    p: 2,
                    borderRadius: 3,
                    m: 2,
                  }}
                >
                  Continuar
                </ButtonBase>
              </>
            ) : null}
          </Box>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <MapDisplayRawLeaflet map={selectedMap} />
          </div>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            minHeight: "80vh",
            alignItems: "center",
            justifyContent: "center",
            m: 0,
            mt: 2,
          }}
        >
          <ButtonBase
            variant="contained"
            sx={{
              backgroundColor: "transparent",
              color: textColor,
              appearance: "none",
              border: "none",
            }}
            onClick={() => {
              addNewMap();
            }}
          >
            <img
              src="./assets/add_symbol.png"
              alt="Mapa 1"
              style={{ width: "100px", height: "100px" }}
            />
          </ButtonBase>

          <Typography
            variant="h7"
            component="div"
            sx={{
              py: 1,
              px: 2,
              color: secondaryColor,
              m: 0,
              fontSize: "20px",
              textAlign: "start",
            }}
          >
            Parece que ainda não adicionou o mapa da exposição. Clique no ícone
            acima para começar.
          </Typography>
        </Box>
      )}

      <Alert
        sx={{
          display: displayAlert ? "flex" : "none",
          backgroundColor: primaryColor,
          color: textColor,
          position: "fixed",
          width: "90%",
          bottom: "3%",
          left: "5%",
          m: 2,
          p: 0.3,
          borderRadius: 3,
          fontSize: "15px",
          ".MuiAlert-icon": {
            color: textColor,
          },
          ".MuiAlert-action": {
            color: textColor,
            fontSize: "20px",
            mr: 1,
          },
        }}
        onClose={() => {
          setDisplayAlert(false);
        }}
      >
        {alertText}
      </Alert>
    </Box>
  );
}
