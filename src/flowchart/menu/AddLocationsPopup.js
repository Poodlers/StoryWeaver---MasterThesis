import { Image } from "@mui/icons-material";
import { Dialog, Grid, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { MarkerTypes, possibleMarkers } from "../../models/MarkerTypes";
import { primaryColor, secondaryColor, textColor } from "../../themes";

export default function AddLocationsPopup(props) {
  const open = props.open;
  const onClose = props.onClose;
  return (
    <Dialog
      id="add-node-popup"
      open={open}
      onClose={onClose}
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
              borderBottomWidth: 3,
              mt: 2,
              borderBottomStyle: "solid",
              borderBottomColor: secondaryColor,
            }}
          >
            ADICIONAR
          </Typography>

          <Icon
            fontSize="large"
            onClick={() => onClose(undefined)}
            sx={{
              color: "black",
              ml: "auto",
              fontSize: "50px !important",
              cursor: "pointer",
            }}
          >
            close
          </Icon>
        </Box>

        <Box>
          <Grid container spacing={2} sx={{ py: 10 }}>
            {possibleMarkers.map((marker) => {
              return (
                <Grid
                  key={marker.name}
                  item
                  xs={4}
                  alignContent="center"
                  alignItems={"center"}
                  textAlign="center"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      filter:
                        "invert(98%) sepia(65%) saturate(383%) hue-rotate(341deg) brightness(107%) contrast(103%)",
                    },
                  }}
                  onClick={() => {
                    onClose(marker.type);
                  }}
                >
                  <img
                    src={"./assets/" + marker.image}
                    sx={{ width: 50, height: 50 }}
                  ></img>
                  <Typography
                    variant="h7"
                    component="div"
                    sx={{
                      flexGrow: 1,
                      py: 1,
                      px: 2,
                      color: "black",
                      m: 0,
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {marker.name}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
}
