import { Box, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { leftNodeHandleStyle, rightNodeHandleStyle, primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';
import { useState } from 'react';
 

export default function QuizNode(props) { 
  const [question, setQuestion] = useState(props.data?.question ?? "");
  const [answers, setAnswers] = useState(props.data?.answers ?? []);
  return (
    <>
      <Handle type="target" position={Position.Left} style={leftNodeHandleStyle} />
      <Box sx={{ 
            backgroundColor: primaryColor,
            borderColor: tertiaryColor,
            display: 'flex',
            width: '50%',
            justifyContent: 'start',
            borderWidth: 2,
            borderStyle: 'solid',
      }}>
        <Typography variant="h6" sx = {{px: 2, fontSize: 15, color: textColor, fontWeight: 400}}>
          Quiz
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
            Quiz
          </Typography>
          
        </Box>

        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: secondaryColor,
        
        }}>
          <Typography variant="h6" sx = {{px: 3, py: 3, fontSize: 12, color: textColor, fontWeight: 200}}>
            {question}
          </Typography>
            
        </Box>
        
        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: primaryColor,
        
        }}>
            <Typography variant="h6" sx = {{px: 3, fontSize: 15, color: textColor, fontWeight: 400}}>
            Respostas
          </Typography>
        </Box>


        <Box sx = {{
            width: '100%',
            height: '100%',
            backgroundColor: secondaryColor,
        
        }}>
            {answers.map((answer, index) => ( 
              <div key={index}>
                <Typography  variant="h6" sx = {{px: 3, py: 0.2, fontSize: 12, color: textColor, fontWeight: 200}}>
                    {answer}
                </Typography>
                <Handle type="source" position={Position.Right} style={{marginTop: 25 * index + 45, 
                    ...rightNodeHandleStyle}} id={index.toString()} />
                </div>
            ))}

        </Box>

      </Box>
      
   
    </>
  );
}