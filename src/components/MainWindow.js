import * as React from 'react';
import Box from '@mui/material/Box';
import Flow from '../flowchart/Flow';
import { Typography } from '@mui/material';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../themes';

export default function MainWindow(props) {
  const [windows, changeWindows] = React.useState(['Flowchart', 'Mapa']);
  const [displayedWindow, changeDisplayedWindow] = React.useState('Flowchart');
  

  return (
    <Box sx={{ flexGrow: 1 }}>
         <Box sx={{ display:"flex",flexDirection:'row', p:0, alignItems: 'center', justifyContent: 'left', backgroundColor: primaryColor}}>
        {
            windows.map((window) => {
                return (
                    <Box key={window} sx={{ display:"flex",flexDirection:'row'
                    , p:0, alignItems: 'center', justifyContent: 'left', backgroundColor: primaryColor}}>
                        <Box sx={{backgroundColor: displayedWindow == window ? secondaryColor : primaryColor,
                             borderColor: tertiaryColor,
                               borderWidth: 3, borderStyle:'solid', m:0,
                               borderBottomWidth: displayedWindow == window ? 0: 3}} onClick={() => changeDisplayedWindow(window)}>
                            <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: textColor, m:0}}>
                                {window}
                            </Typography>
                        </Box>
                    </Box>
                )
            })
        }
       
            <Box sx = { {flexGrow: 1, height:'-webkit-fill-available' , m:0, borderColor: tertiaryColor, borderWidth: 2, borderStyle:'solid' }}>
                <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: primaryColor }}>
                    Mapa
                </Typography>
            </Box>
        </Box>

        {displayedWindow === 'Flowchart' ? <Flow></Flow>  : <div>Not implemented yet</div>}
      </Box>
  );
}