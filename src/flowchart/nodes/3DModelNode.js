import { Box, Typography } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';
import { leftNodeHandleStyle, rightNodeHandleStyle, primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';
import { Suspense, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { useGLTF } from '@react-three/drei';


function Model(props) {
  const { scene } = useGLTF(props.filepath);
 return  <primitive object={scene} />;
}

export default function ThreeDModelNode(props) {
  const name = props.data?.name ?? "";
  
  const filepath = props.data?.file.blob ?? "";
  return (
    <>
      <Handle type="target" position={Position.Left} style={leftNodeHandleStyle} />

      <Box sx= {{
          backgroundColor: primaryColor,
          borderColor: tertiaryColor,
          
          borderWidth: 2,
          borderStyle: 'solid'}}
        
          >

        <Typography variant="h6" sx={{ px: 2, fontSize: 15, color: textColor, fontWeight: 400, textAlign:'center'}}>
          Modelo 3D
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
        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: primaryColor,

        }}>
          <Typography variant="h6" sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}>
            Nome
          </Typography>

        </Box>

        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: secondaryColor,

        }}>
          <Typography variant="h6" sx={{ px: 3, py: 1, fontSize: 12, color: textColor, fontWeight: 200 }}>
            {name}
          </Typography>

        </Box>

        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: primaryColor,

        }}>
          <Typography variant="h6" sx={{ px: 3, fontSize: 15, color: textColor, fontWeight: 400 }}>
            Preview
          </Typography>
        </Box>


        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: secondaryColor,


        }}>

          {filepath == "" ? <Typography variant="h6" sx={{ px: 3, py: 1, fontSize: 12, color: textColor, fontWeight: 200 }} >
            Nenhum modelo 3D selecionado
          </Typography> :

          <Canvas style={{width: '150px', height: '100px'}} dpr={[1,2]} camera={{ position: [2, 2, 10], fov: 75, rotation: [0,0,0] }}>
            <ambientLight intensity={1.5} />
            <Suspense fallback={null}>
              <Model filepath={filepath} />
            </Suspense>
           
          </Canvas>
}

        </Box>

      </Box>

      <Handle type="source" position={Position.Right} style={rightNodeHandleStyle} />
    </>
  );
}