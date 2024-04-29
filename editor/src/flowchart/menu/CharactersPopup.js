import { AddCircleOutline } from "@mui/icons-material";
import { Dialog, Grid, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { primaryColor, secondaryColor, textColor } from "../../themes";
import CreateCharacterPopup from "./CreateCharacterPopup";
import { ApiDataRepository } from "../../api/ApiDataRepository";

export default function CharactersPopup(props) {
  const repo = ApiDataRepository.getInstance();
  const open = props.open;
  const onClose = props.onClose;
  const [openCreateCharacter, setOpenCreateCharacter] = React.useState(false);
  const [selectedCharacter, setSelectedCharacter] = React.useState(undefined);
  const [characters, setCharacters] = React.useState(
    localStorage.getItem("characters")
      ? JSON.parse(localStorage.getItem("characters"))
      : []
  );

  const onCloseCreateCharacter = (character) => {
    setOpenCreateCharacter(false);

    if (character) {
      let newCharacters;
      if (character == "delete") {
        newCharacters = characters.filter((c) => c.id != selectedCharacter.id);
      } else if (selectedCharacter) {
        newCharacters = characters.map((c) => {
          if (c.id == selectedCharacter.id) {
            return character;
          }
          return c;
        });
      } else {
        newCharacters = characters.concat(character);
      }

      setCharacters(newCharacters);
      localStorage.setItem("characters", JSON.stringify(newCharacters));
    }
  };
  return (
    <Dialog
      id="characters-popup"
      open={open}
      onClose={onClose}
      sx={{
        width: "100%",
        scrollbarWidth: "thin",
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
      }}
    >
      <CreateCharacterPopup
        open={openCreateCharacter}
        onClose={onCloseCreateCharacter}
        characters={characters}
        selectedCharacter={selectedCharacter}
      ></CreateCharacterPopup>
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
            PERSONAGENS
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
            px: 15,
          }}
        >
          {characters.length == 0 ? (
            <Typography
              variant="h7"
              component="div"
              sx={{
                py: 1,
                px: 2,
                color: textColor,
                textAlign: "center",
                ml: "auto",
                fontSize: 24,
                fontWeight: "bold",
                mt: 2,
              }}
            >
              Nenhum personagem criado
            </Typography>
          ) : null}

          <Grid container spacing={2} sx={{ py: 10 }}>
            {characters.map((character) => {
              return (
                <Grid
                  key={character.name}
                  item
                  xs={4}
                  alignContent="center"
                  alignItems={"center"}
                  textAlign="center"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedCharacter(character);
                    setOpenCreateCharacter(true);
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
                    <img
                      src={
                        character.image.inputType == "file"
                          ? character.image.blob
                          : character.image.filename
                      }
                      onError={(e) => {
                        // if blob is not valid, fetch the image from the server
                        if (character.image.inputType == "file") {
                          repo
                            .getFile(character.image.filename)
                            .then((blob) => {
                              const newCharacters = characters.map((c) => {
                                if (c.id == character.id) {
                                  c.image.blob = blob;
                                }
                                return c;
                              });
                              localStorage.setItem(
                                "characters",
                                JSON.stringify(newCharacters)
                              );
                              e.target.src = URL.createObjectURL(blob);
                            });
                        }
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        textAlign: "center",
                        m: "0 auto",
                      }}
                    ></img>
                    <Typography
                      variant="h7"
                      component="div"
                      sx={{
                        py: 1,
                        px: 2,
                        color: "black",
                        m: 0,
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {character.name}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ fontSize: "30px !important", m: "0 auto" }}
            onClick={() => {
              setOpenCreateCharacter(true);
              setSelectedCharacter(undefined);
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
              <AddCircleOutline
                sx={{ fontSize: "50px !important", color: primaryColor }}
              ></AddCircleOutline>
              <Typography
                variant="h7"
                component="div"
                sx={{ fontSize: 20, color: primaryColor }}
              >
                Criar personagem
              </Typography>
            </Box>
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
}
