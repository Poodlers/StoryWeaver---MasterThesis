import { DeleteOutline } from "@mui/icons-material";
import {
  ButtonBase,
  Dialog,
  Grid,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { FileTypesInput } from "../../models/FileTypesInput";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";
import FileSelectField from "../inspector/FileSelect.js";
import { v4 as uuid } from "uuid";
import { narrator } from "../../data/narrator";

export default function CreateCharacterPopup(props) {
  const open = props.open;
  const onClose = props.onClose;
  const characters = props.characters;
  const selectedCharacter = props.selectedCharacter;
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [sprite, setSprite] = React.useState({
    inputType: "url",
    filename: "",
    blob: null,
  });

  React.useEffect(() => {
    if (selectedCharacter && selectedCharacter.id === 0) {
      narrator.name = name;
      narrator.description = description;
      narrator.image = sprite;
      console.log(narrator);
    }
  }, [name, description, sprite]);

  React.useEffect(() => {
    if (selectedCharacter) {
      setName(selectedCharacter.name);
      setDescription(selectedCharacter.description);
      setSprite(selectedCharacter.image);
    } else {
      setName("");
      setDescription("");
      setSprite({
        inputType: "url",
        filename: "",
        blob: null,
      });
    }
  }, [selectedCharacter]);

  return (
    <Dialog
      id="create-character-popup"
      open={open}
      onClose={() => onClose(undefined)}
      sx={{
        width: "100%",
        minWidth: "70vw",
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
            {selectedCharacter ? "EDITAR PERSONAGEM" : "NOVA PERSONAGEM"}
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: secondaryColor,
            zIndex: 1,
            m: "0 auto",
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
            <Typography
              variant="h7"
              component="div"
              sx={{
                color: primaryColor,
                fontSize: 20,
                fontWeight: "bold",
                m: 2,
              }}
            >
              Nome
            </Typography>
            <TextField
              aria-autocomplete="off"
              autoComplete="off"
              fullWidth
              sx={{
                px: 4,
                textAlign: "center",
                backgroundColor: textColor,
                border: "none",
                outline: "none",
                ":&hover": {
                  border: "none",
                  outline: "none",
                },
                ".MuiInputBase-root": {
                  textAlign: "center",
                },
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  "& .MuiInput-input": {
                    textAlign: "center !important",
                    color: "black",
                    fontSize: "17px",
                  },
                },
              }}
              id="standard-basic"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Typography
              variant="h7"
              component="div"
              sx={{
                color: primaryColor,
                fontSize: 20,
                fontWeight: "bold",
                m: 2,
              }}
            >
              Descrição
            </Typography>
            <TextField
              aria-autocomplete="off"
              autoComplete="off"
              fullWidth
              multiline
              sx={{
                px: 4,
                minHeight: "100px",
                textAlign: "center",
                backgroundColor: textColor,
                border: "none",
                outline: "none",
                ":&hover": {
                  border: "none",
                  outline: "none",
                },
                ".MuiInputBase-root": {
                  textAlign: "center",
                },
              }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  "& .MuiInput-input": {
                    textAlign: "center !important",
                    color: "black",
                    fontSize: "17px",
                  },
                },
              }}
              id="standard-basic"
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FileSelectField
              data={{
                label: "Sprite do Personagem",
                acceptedType: FileTypesInput.Image,
              }}
              style={{ mt: 2 }}
              value={sprite}
              onChange={(name, value) => setSprite(value)}
            ></FileSelectField>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {selectedCharacter && selectedCharacter.id != 0 ? (
              <Box
                sx={{
                  p: 0,
                  m: 0,

                  alignContent: "center !important",
                }}
                onClick={() => {
                  onClose("delete");
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
            ) : null}
            <ButtonBase
              onClick={() => {
                onClose({
                  id: selectedCharacter ? selectedCharacter.id : uuid(),
                  name: name,
                  description: description,
                  image: sprite,
                });
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
              Guardar
            </ButtonBase>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
