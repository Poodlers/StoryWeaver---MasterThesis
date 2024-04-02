import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Icon } from '@mui/material';
import AddNodePopup from '../flowchart/menu/AddNodePopup';

export default function TopAppBar(props) {
  const currentWindow = props.currentWindow;
  const projectTitle = props.projectTitle;
  const addNode = props.addNode;
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, fontSize: '30px !important'}}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Icon>add</Icon>
          </IconButton>
          {
            currentWindow === 'Flowchart' ?
            <AddNodePopup open={open} onClose={(nodeType, nodeProps)=>{
              setOpen(false);
              if(nodeType) addNode(nodeType, nodeProps);

            }}></AddNodePopup>
            : null
          }
         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {projectTitle}
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}