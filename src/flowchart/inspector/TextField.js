import { TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';

function TextFieldInspector(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent:'space-between', ...style, width:'100%'}}>
        
        <Typography variant="h7" component="div" sx={{ py:1, px:2, color: textColor, m:0,
           textAlign:'start'}}>
            {label}
        </Typography>
        <TextField 
        inputProps={{style: {borderRadius:0, color: 'black', height: 40, padding: 0, margin: 0,
          borderColor: 'transparent', borderWidth: 0,  backgroundColor: "#ffffff", 
          borderRadius: 10, textAlign: 'start',
        }}}
        sx={{ flexGrow: 1, py:0, px:1, color: textColor, mx:'10px', borderRadius:0,
          '.MuiInputBase-root': {
            borderRadius: 2,
            backgroundColor: "#ffffff",
          },
      }}
         id="outlined-basic" variant="outlined" 
         value={value}
          onChange={(event) => {
            handleFieldChange(props.data.name, event.target.value);
          }}
         />

      </Box>
    );
}

export default TextFieldInspector;
