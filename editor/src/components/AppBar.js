import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Icon, Menu, MenuItem, TextField } from "@mui/material";
import AddNodePopup from "../flowchart/menu/AddNodePopup";
import { primaryColor, secondaryColor, textColor } from "../themes";
import AddLocationsPopup from "../flowchart/menu/AddLocationsPopup";
import CharactersPopup from "../flowchart/menu/CharactersPopup";
import { possibleNodes } from "../models/possibleNodes";
import { possibleDialogueNodes } from "../models/possibleDialogueNodes";
import LoadProjectPopup from "../flowchart/menu/LoadProjectPopup";
import { ApiDataRepository } from "../api/ApiDataRepository";

export default function TopAppBar(props) {
  const repo = ApiDataRepository.getInstance();
  const currentWindow = props.currentWindow;
  const projectTitle = props.projectTitle;
  const characters = props.characters;
  const setCharacters = props.setCharacters;
  const setProjectTitle = (projectTitle) => {
    props.setProjectTitle(projectTitle);
    localStorage.setItem("projectTitle", projectTitle);
  };
  const addNode = props.addNode;
  const addDialogueNode = props.addDialogueNode;

  const addLocation = props.addLocation;

  const [openAddNode, setOpenAddNode] = React.useState(false);
  const [openLoadProjectPopup, setOpenLoadProjectPopup] = React.useState(false);
  const [openCharacterMenu, setOpenCharacterMenu] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [projects, setProjects] = React.useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (openLoadProjectPopup) {
      repo.getProjects().then((projects) => {
        setProjects(projects);
      });
    }
  }, [openLoadProjectPopup]);

  const handleSaveLocal = props.handleSaveLocal;
  const handleSaveServer = props.handleSaveServer;

  const handleLoadLocal = props.handleLoadLocal;
  const handleLoadServer = props.handleLoadServer;

  const handleNewProject = props.handleNewProject;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            id="basic-button"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <CharactersPopup
            characters={characters}
            setCharacters={setCharacters}
            open={openCharacterMenu}
            onClose={() => {
              setOpenCharacterMenu(false);
            }}
          ></CharactersPopup>
          <LoadProjectPopup
            open={openLoadProjectPopup}
            onClose={(projectId) => {
              if (projectId != undefined) handleLoadServer(projectId);
              setOpenLoadProjectPopup(false);
            }}
            projects={projects}
          ></LoadProjectPopup>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
              sx: {
                color: textColor,
                backgroundColor: primaryColor,
                "& .MuiMenuItem-root": {
                  color: textColor,
                  backgroundColor: primaryColor,
                  "&:hover": {
                    backgroundColor: secondaryColor,
                  },
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setOpenCharacterMenu(true);
                handleClose();
              }}
            >
              Ver Personagens
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleNewProject();
                handleClose();
              }}
            >
              Novo
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleSaveLocal();
                handleClose();
              }}
            >
              Guardar Localmente
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLoadLocal();
                handleClose();
              }}
            >
              Carregar Localmente
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSaveServer();
                handleClose();
              }}
            >
              Guardar no Servidor
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenLoadProjectPopup(true);
                handleClose();
              }}
            >
              Carregar do Servidor
            </MenuItem>
          </Menu>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, fontSize: "30px !important" }}
            onClick={() => {
              setOpenAddNode(true);
            }}
          >
            <img
              src="./assets/add_symbol.png"
              alt="Add"
              style={{ width: "50px", height: "50px" }}
            />
          </IconButton>
          {currentWindow === "Flowchart" ? (
            <AddNodePopup
              open={openAddNode}
              possibleNodes={possibleNodes}
              onClose={(nodeType, nodeProps) => {
                setOpenAddNode(false);
                if (nodeType) addNode(nodeType, nodeProps);
              }}
            ></AddNodePopup>
          ) : currentWindow === "Mapa" ? (
            <AddLocationsPopup
              open={openAddNode}
              onClose={(markerType) => {
                setOpenAddNode(false);
                if (markerType) addLocation(markerType);
              }}
            ></AddLocationsPopup>
          ) : currentWindow.startsWith("Diálogo") ? (
            <AddNodePopup
              open={openAddNode}
              possibleNodes={possibleDialogueNodes}
              onClose={(nodeType, nodeProps) => {
                setOpenAddNode(false);
                if (nodeType) {
                  addDialogueNode(nodeType, nodeProps);
                }
              }}
            ></AddNodePopup>
          ) : null}

          <TextField
            aria-autocomplete="off"
            autoComplete="off"
            fullWidth
            sx={{
              m: "0 auto",
              textAlign: "center",
              backgroundColor: primaryColor,
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
                  color: textColor,
                  fontSize: "17px",
                },
              },
            }}
            id="standard-basic"
            variant="standard"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
