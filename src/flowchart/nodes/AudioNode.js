import { Box, Typography } from '@mui/material';
import AudioPlayer from 'mui-audio-player-plus';
import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { leftNodeHandleStyle, rightNodeHandleStyle, primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export default function AudioNode(props) { 
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
          Audio
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
            Nome
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
            minHeight: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {
                error || fileInfo.filename == '' ? <Typography variant="h6" sx = {{px: 3, fontSize: 15, color: textColor, fontWeight: 500}}>
                Insira um audio no inspetor!
            </Typography> : 
            null
            
            
            }
            <div className='audio-player-container' >
            <AudioPlayer 
            
            src={fileInfo.inputType == 'file' ? 
                fileInfo.blob 
            : fileInfo.filename} 
            id="inline-timeline" display="timeline" inline={true} paperize size='medium'
                
                playPauseIconButtonProps={{size: 'large', sx: {color: textColor, 
                '.MuiSvgIcon-root': {fontSize: '3.5rem'},
                    '&:hover': {color: tertiaryColor}}}}

                waveColor={tertiaryColor}
                containerSx = {{
                    display: error || fileInfo.filename == '' ? 'none' : 'block',
                    textAlign:'center', backgroundColor: primaryColor, p:1, 
                '& .MuiSlider-root': {color: '#fff'},
                '& .MuiIconButton-root': {color: '#fff'}
            
                }}
                        
          />
        </div>

          
          
           

        </Box>

      </Box>
      
      <Handle type="source" position={Position.Right} style={rightNodeHandleStyle} />
    </>
  );
}