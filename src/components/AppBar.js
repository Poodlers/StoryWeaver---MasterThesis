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

export default function TopAppBar(props) {
  const currentWindow = props.currentWindow;
  const projectTitle = props.projectTitle;
  const setProjectTitle = (projectTitle) => {
    props.setProjectTitle(projectTitle);
    localStorage.setItem("projectTitle", projectTitle);
  };
  const addNode = props.addNode;

  const [openAddNode, setOpenAddNode] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = props.handleSave;

  const handleLoad = props.handleLoad;

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
                handleNewProject();
                handleClose();
              }}
            >
              Novo
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleSave();
                handleClose();
              }}
            >
              Guardar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLoad();
                handleClose();
              }}
            >
              Carregar
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
            <Icon>add</Icon>
          </IconButton>
          {currentWindow === "Flowchart" ? (
            <AddNodePopup
              open={openAddNode}
              onClose={(nodeType, nodeProps) => {
                setOpenAddNode(false);
                if (nodeType) addNode(nodeType, nodeProps);
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
