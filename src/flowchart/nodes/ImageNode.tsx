import { Box, Typography } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';
import { leftNodeHandleStyle, rightNodeHandleStyle, primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';
import { useState } from 'react';


export type ImageData = {
    title?: string;
    filepath?: string;
    
  };



export default function ImageNode(props: NodeProps<ImageData>) { 
  const [title, setTitle] = useState(props.data?.title ?? "");
  const [filepath, setFilePath] = useState(props.data?.filepath ?? "" );
  return (
    <>
      <Handle type="target" position={Position.Left} style={leftNodeHandleStyle} />
     
      <Box sx={{ 
            backgroundColor: primaryColor,
            borderColor: tertiaryColor,
            width: '70%',
            borderWidth: 2,
            borderStyle: 'solid',
      }}>
        <Typography variant="h6" sx = {{px: 2, fontSize: 15, color: textColor, fontWeight: 400}}>
          Imagem
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
            Título
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
            Preview
          </Typography>
        </Box>


        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: secondaryColor,
            
        
        }}>
           <img src={filepath} alt="Imagem" style={{width: 'auto', height: '200px', padding: 10}}/>

        </Box>

      </Box>
      
      <Handle type="source" position={Position.Right} style={rightNodeHandleStyle} />
    </>
  );
}