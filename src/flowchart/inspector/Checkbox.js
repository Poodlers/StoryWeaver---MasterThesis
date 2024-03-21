import { Checkbox, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';

function CheckboxField(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
      <Box sx={{display: 'flex', width:'100%', flexDirection: 'row', alignItems:'center', justifyContent:'space-between', ...style}}>
        
        <Typography variant="h7" component="div" sx={{  py:1, px:2, color: textColor, m:0, justifySelf:'start',
         justifyContent:'start', textAlign:'start'}}>
            {label}
        </Typography>
        <Checkbox
        sx={{ py:0, px:2, color: textColor, mx:'10px', borderRadius:0,
        textAlign:'end',
       
          '.MuiInputBase-root': {
            borderRadius: 2,
            backgroundColor: "#ffffff",
          },
          ':hover': {
            backgroundColor: 'transparent',
          },
           '&:focused': {
                backgroundColor: 'transparent',
            },
            '&:active': {
                backgroundColor: 'transparent',
            },
        }}
         inputPropsinputProps={{ 'aria-label': 'controlled' }}
            id="checkbox"
            checked={value}
            onChange={(event) => {
                handleFieldChange(props.data.name, event.target.checked);
            }}
            />

      </Box>
    );
}

export default CheckboxField;
