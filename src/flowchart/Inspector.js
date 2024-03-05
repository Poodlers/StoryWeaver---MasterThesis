import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../themes';

function Inspector(props) {
  const nodeType = props.data.nodeType;

  return (
      <Box sx={{width: '30vw', backgroundColor: secondaryColor}}>
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            
                  <Typography variant="h7" component="div" sx={{color: textColor,  flexGrow: 1, py:1, px:2, color: 'white', m:0,
                   borderWidth: 1, borderColor: tertiaryColor, borderStyle: 'solid', backgroundColor: primaryColor}}>
                      Inspector
                  </Typography>
             
        
                  <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: 'white', m:0}}>
                      {nodeType}
                  </Typography>
              
          </Box>

      </Box>
    );
}

export default Inspector;
