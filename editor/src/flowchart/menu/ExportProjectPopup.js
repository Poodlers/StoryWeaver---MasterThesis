import {
  ButtonBase,
  Dialog,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../../themes";

import ProjectTag from "./ProjectTag";

const colors = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
  "#000000",
  "#A9A9A9",
  "#FFFFFF",
];

export default function ExportProjectPopup(props) {
  const open = props.open;
  const onClose = props.onClose;
  const projects = props.projects;

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState([]);

  return (
    <Dialog
      id="export-project-popup"
      open={open}
      onClose={() => onClose(undefined)}
      sx={{
        scrollbarWidth: "thin",
        scrollbarColor: `${primaryColor} ${secondaryColor}`,
      }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "720px !important",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: secondaryColor,
          flexDirection: "column",
          width: "100%",
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
              px: 4,
              color: textColor,
              textAlign: "center",
              ml: "auto",
              fontWeight: "bold",
              fontSize: 30,
              backgroundColor: primaryColor,
              borderBottomWidth: 3,
              mt: 2,
              mr: 2,
              borderBottomStyle: "solid",
              borderBottomColor: secondaryColor,
            }}
          >
            EXPORTAR
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
            width: "100%",
          }}
        >
          <Box
            sx={{
              py: 5,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "90%",

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
                Nome:
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
                  borderRadius: 2,
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
                      borderRadius: 2,
                    },
                  },
                }}
                id="standard-basic"
                variant="standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "90%",

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
                Descrição:
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
                  borderRadius: 2,
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
                      borderRadius: 2,
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
                flexDirection: "row",
                width: "90%",

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
                Etiquetas:
              </Typography>
              <>
                {tags.map((tag, index) => {
                  return (
                    <ProjectTag
                      key={index}
                      name={tag.name}
                      setName={(name) => {
                        const newTags = [...tags];
                        newTags[index].name = name;
                        setTags(newTags);
                      }}
                      color={tag.color}
                      onDelete={(name) =>
                        setTags(tags.filter((tag) => tag.name !== name))
                      }
                    />
                  );
                })}
              </>
              <IconButton
                sx={{
                  color: "black",
                  ml: "auto",
                  fontSize: "50px !important",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setTags([
                    ...tags,
                    { name: "", color: colors[tags.length % colors.length] },
                  ])
                }
              >
                <Icon fontSize="inherit">add</Icon>
              </IconButton>
            </Box>

            <ButtonBase
              onClick={() => {
                onClose();
              }}
              sx={{
                backgroundColor: tertiaryColor,
                color: textColor,
                fontSize: "20px",
                p: 2,
                borderRadius: 3,
                m: 1,
              }}
            >
              Confirmar
            </ButtonBase>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
