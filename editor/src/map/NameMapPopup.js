import { ButtonBase, Dialog, Icon, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";

export default function NameMapPopup(props) {
  const open = props.open;
  const [name, setName] = React.useState("");
  const onClose = props.onClose;
  return (
    <Dialog
      id="name-map-popup"
      open={open}
      onClose={onClose}
      sx={{
        width: "100%",
        scrollbarWidth: "thin",
        borderRadius: 10,
        borderColor: tertiaryColor,
        borderWidth: 3,
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: primaryColor,

          zIndex: 1,
          m: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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

        <Typography
          variant="h7"
          component="div"
          sx={{
            py: 1,
            px: 2,
            color: textColor,
            textAlign: "start",
            ml: "auto",
            fontSize: 16,
            backgroundColor: primaryColor,
            mt: 2,
          }}
        >
          Para finalizar a criação do seu mapa, tem apenas de lhe dar um nome!
          Não se preocupe se as posições das âncoras não estão perfeitas, pode
          sempre editá-las mais tarde!
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            m: 5,
          }}
        >
          <Typography
            variant="h7"
            component="div"
            sx={{
              py: 1,
              px: 2,
              color: textColor,
              textAlign: "start",
              fontWeight: "bold",
              fontSize: 20,
              mt: 1,
            }}
          >
            Nome:
          </Typography>
          <TextField
            id="map-name"
            inputProps={{
              style: {
                borderRadius: 0,
                color: "black",
                height: 40,
                padding: 0,
                margin: 0,
                borderColor: "transparent",
                borderWidth: 0,
                backgroundColor: textColor,
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
                backgroundColor: textColor,
              },
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <ButtonBase
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            m: 3,
            backgroundColor: tertiaryColor,
            color: textColor,
            fontWeight: "bold",
            fontSize: 20,
            p: 2,
            borderRadius: 3,
          }}
          onClick={() => onClose(name)}
        >
          Finalizar
        </ButtonBase>
      </Box>
    </Dialog>
  );
}
