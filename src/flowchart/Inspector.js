import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { InputFieldType } from '../models/InputFieldTypes';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../themes';
import TextFieldInspector from './inspector/TextField';
import ThreeDCoordField from './inspector/ThreeDCoordField';

function Inspector(props) {
  const values = props.value;
  const setValues = props.setValue;
  const handleFieldChange = (fieldId, value) => {
    setValues({ ...values, [fieldId]: value });
  };
  
  return props.data !== undefined ? 
        <Box sx={{width: '30vw', backgroundColor: secondaryColor}}>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              
                    <Typography variant="h7" component="div" sx={{color: textColor,  flexGrow: 1, py:1, px:2, color: 'white', m:0,
                     borderWidth: 1, borderColor: tertiaryColor, borderStyle: 'solid', backgroundColor: primaryColor}}>
                        Inspector
                    </Typography>
               
          
                    <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: 'white', m:0}}>
                        {props.data.nodeType}
                    </Typography>
                
            </Box>

            {props.data.fields.map((field, index) => {
              
              switch (field.type) {
                case InputFieldType.textField:
                  return <TextFieldInspector key={index} id={index} onChange={handleFieldChange} value={values[field.name]} data={field} style={{mt: 2}} ></TextFieldInspector>
                case InputFieldType.threeDCoord:
                  return <ThreeDCoordField key={index} id={index} onChange={handleFieldChange} value={values[field.name]} data={field} style={{mt: 2}} ></ThreeDCoordField>
                case InputFieldType.select_location:
                  break;  

              }
               
            })}

        </Box>
       : 
       null
    
}

export default Inspector;
