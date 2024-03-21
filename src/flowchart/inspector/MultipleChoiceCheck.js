import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';

function MultipleChoiceCheckboxField(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;

  return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', ...style, width:'100%'}}>
        <Box style={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent:'center', width:'100%'}}>

            <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: textColor, m:0, backgroundColor: primaryColor, 
            textAlign: 'center',
            }}>

                {label}
            </Typography>

        </Box>
        <FormGroup>
            {
                Object.keys(value).map((key, index) => {
                    
                    return <FormControlLabel
                    control={
                        <Checkbox 
                        TouchRippleProps={{style: {color: 'transparent'}}}
                        sx = {{
                            py:2, px:2, color: textColor, mx:'10px', borderRadius:0,
                                
                            
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
                        checked={value[key]} onChange={
                        (event) => {
                            handleFieldChange(props.data.name, {...value, [key]: event.target.checked});
                        }
    
                        } name={key} />
                    }
                    label={<Typography sx={{color: textColor}}>
                        {key}
                    </Typography>
                    }

                    />
                })
            }
           
        </FormGroup>


      </Box>
    );
}

export default MultipleChoiceCheckboxField;
