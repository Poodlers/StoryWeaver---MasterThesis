import { Box, Typography } from '@mui/material';
import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { leftNodeHandleStyle, rightNodeHandleStyle, primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';


export default function CharacterNode(props) { 
  const title = props.data?.name ?? "";
  const fileInfo  = props.data?.file ?? "";
  const [error, setError] = React.useState(false);
  return (
    <>
      <Handle type="target" position={Position.Left} style={leftNodeHandleStyle} />
     
      <Box sx={{ 
            backgroundColor: primaryColor,
            borderColor: tertiaryColor,
            borderWidth: 2,
            borderStyle: 'solid',
      }}>
        <Typography variant="h6" sx = {{px: 2, fontSize: 15, color: textColor, fontWeight: 400}}>
            Diálogo Personagem
        </Typography>
      </Box>
      <Box sx={{ 
            backgroundColor: secondaryColor,
            borderColor: tertiaryColor,
            borderWidth: 2,
            borderStyle: 'solid',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
    
            
      }}>
        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: primaryColor,
        
        }}>
          <Typography variant="h6" sx = {{px: 3, fontSize: 15, color: textColor, fontWeight: 400}}>
            Nome da Personagem
          </Typography>
          
        </Box>

        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: secondaryColor,
        
        }}>
          <Typography variant="h6" sx = {{px: 3, py: 1, fontSize: 12, color: textColor, fontWeight: 200}}>
            {title}
          </Typography>
            
        </Box>
        
        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: primaryColor,
        
        }}>
          <Typography variant="h6" sx = {{px: 3, fontSize: 15, color: textColor, fontWeight: 400}}>
            Sprite do Personagem
          </Typography>
        </Box>


        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: secondaryColor,
            minHeight: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        
        }}>
          {
             error || fileInfo.filename == '' ? <Typography variant="h6" sx = {{px: 3, fontSize: 15, color: textColor, fontWeight: 500}}>
            Insira uma imagem no editor!
          </Typography> : 
           null
          
          }

          <img
              onLoad={() => {setError(false)}}
              onError={(e) => {setError(true)}}
              src={fileInfo.inputType == 'file' ? fileInfo.blob : fileInfo.filename} style={{width: 'auto', height: '200px', padding: 10,
              display: error ? 'none' : 'block'
            }}
            />
          
           

        </Box>

      </Box>
      
      <Handle type="source" position={Position.Right} style={rightNodeHandleStyle} />
    </>
  );
}