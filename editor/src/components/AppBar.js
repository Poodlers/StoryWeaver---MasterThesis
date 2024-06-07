import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  ButtonBase,
  Icon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import AddNodePopup from "../flowchart/menu/AddNodePopup";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import AddLocationsPopup from "../flowchart/menu/AddLocationsPopup";
import CharactersPopup from "../flowchart/menu/CharactersPopup";
import { possibleNodes } from "../models/possibleNodes";
import { possibleDialogueNodes } from "../models/possibleDialogueNodes";
import LoadProjectPopup from "../flowchart/menu/LoadProjectPopup";
import { ApiDataRepository } from "../api/ApiDataRepository";
import ExportProjectPopup from "../flowchart/menu/ExportProjectPopup";
import { NodeType } from "../models/NodeTypes";
import { DialogNodeType } from "../models/DialogNodeTypes";
import { AccountCircle } from "@mui/icons-material";

export default function TopAppBar(props) {
  const repo = ApiDataRepository.getInstance();
  const currentWindow = props.currentWindow;
  const projectTitle = props.projectTitle;
  const characters = props.characters;
  const nodes = props.nodes;
  const edges = props.edges;

  const [displayAlert, setDisplayAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("error");
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
  const [openExportProjectPopup, setOpenExportProjectPopup] =
    React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [projects, setProjects] = React.useState([]);

  const checkIfStoryIsReadyForExport = () => {
    setSeverity("error");
    if (nodes.length === 0) {
      setAlertMessage("Não existem nós para exportar.");
      setDisplayAlert(true);
      return false;
    }
    if (edges.length === 0) {
      setAlertMessage("Adicione ligações à sua história para exportar.");
      setDisplayAlert(true);
      return false;
    }

    for (let node of nodes) {
      const hasIncomingConnection =
        edges.some((edge) => edge.target === node.id) ||
        node.type === NodeType.beginNode;

      if (!hasIncomingConnection) {
        setAlertMessage(
          `O nó "${node.data.sceneName}" não tem ligações de entrada!`
        );
        setDisplayAlert(true);
        return false;
      }

      if (node.type === NodeType.characterNode) {
        const allEndings = node.data.dialog.nodes.filter(
          (dialogNode) => dialogNode.type === DialogNodeType.endDialogNode
        );
        //check that every ending has a connection
        const dialogName = node.data.name;
        for (let ending of allEndings) {
          const endingName = ending.data.id;
          const hasConnection = edges.some(
            (edge) => edge.sourceHandle === endingName
          );
          if (!hasConnection) {
            setAlertMessage(
              `O fim "${endingName}" no diálogo ${dialogName} não tem ligação!"`
            );
            setDisplayAlert(true);
            return false;
          }
        }
      } else if (node.type === NodeType.quizNode) {
        const allAnswers = node.data.answers;
        //check that every question has a connection
        const quizId = node.id;
        const quizQuestion = node.data.question;
        for (let i = 0; i < allAnswers.length; i++) {
          const hasConnection = edges.some(
            (edge) =>
              edge.source === quizId && edge.sourceHandle === allAnswers[i]
          );
          if (!hasConnection) {
            setAlertMessage(
              `A resposta "${allAnswers[i]}" no quiz ${quizQuestion} não tem ligação!"`
            );
            setDisplayAlert(true);
            return false;
          }
        }
      } else {
        const hasOutgoingConnection =
          edges.some((edge) => edge.source === node.id) ||
          node.type === NodeType.endNode;

        if (!hasOutgoingConnection) {
          setAlertMessage(
            `O nó "${node.data.sceneName}" não tem ligações de saída!`
          );
          setDisplayAlert(true);
          return false;
        }
      }
    }

    return true;
  };

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
          <ExportProjectPopup
            open={openExportProjectPopup}
            onClose={() => {
              setOpenExportProjectPopup(false);
            }}
          ></ExportProjectPopup>
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
            setProjects={setProjects}
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
                setDisplayAlert(true);
                if (handleNewProject()) {
                  setSeverity("success");
                  setAlertMessage("Projeto criado com sucesso!");
                } else {
                  setSeverity("error");
                  setAlertMessage("Erro ao criar projeto");
                }
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
                setDisplayAlert(true);
                if (handleSaveServer()) {
                  setSeverity("success");
                  setAlertMessage("Projeto guardado no servidor com sucesso!");
                } else {
                  setSeverity("error");
                  setAlertMessage("Erro ao guardar projeto");
                }
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
          {currentWindow === "História" ? (
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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, fontSize: "30px !important" }}
            onClick={() => {
              setOpenCharacterMenu(true);
            }}
          >
            <AccountCircle
              sx={{
                fontSize: "50px !important",
                color: secondaryColor,
              }}
            ></AccountCircle>
          </IconButton>
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
          <ButtonBase
            onClick={() => {
              if (checkIfStoryIsReadyForExport()) {
                setOpenExportProjectPopup(true);
              }
            }}
            sx={{
              p: 2,
              borderRadius: 3,
              m: 1,
            }}
          >
            <Icon
              sx={{
                color: secondaryColor,
                fontSize: "40px !important",
              }}
            >
              send_to_mobile
            </Icon>
          </ButtonBase>
        </Toolbar>
      </AppBar>

      <Alert
        severity={severity}
        sx={{
          display: displayAlert ? "flex" : "none",
          backgroundColor: severity == "success" ? primaryColor : "#F21414",
          zIndex: 1000,
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
        {alertMessage}
      </Alert>
    </Box>
  );
}
