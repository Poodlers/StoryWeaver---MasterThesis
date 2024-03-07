import * as React from 'react';
import Box from '@mui/material/Box';
import Flow from '../flowchart/Flow';
import { Typography } from '@mui/material';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../themes';
import { NodeType } from '../models/NodeTypes';
import { ImageProps, QuizProps, ThreeDModelProps, VideoProps } from '../flowchart/nodes/nodeProps';

const generateInspectorProps = (props) => {
  return props.fields.reduce((obj, field) => ({...obj, [field.name]: field.initialValue}), {})

}

const initialNodes = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      values : generateInspectorProps(QuizProps),
      data: { question: 'Hello?', answers : ["lol", "lol"] },
      type: NodeType.quizNode
    },
    {
      id: '2',
      position: { x: 100, y: 100 },
      values : generateInspectorProps(VideoProps),
      data: { title: 'Hello?', filepath : "https://www.youtube.com/watch?v=_D5nHQTxDl0" },
      type: NodeType.videoNode
    },
    {
      id: '3',
      position: { x: 200, y: 100 },
      values : generateInspectorProps(ImageProps),
      data: { title: 'Hello?', filepath : './assets/dimeu_boyfreind.jpg' },
      type: NodeType.imageNode
    },

    {
      id: '4',
      position: { x: 300, y: 100 },
      values : generateInspectorProps(ThreeDModelProps),
      data: { name: 'Hello?', filepath : './assets/spongebob.glb' },
      type: NodeType.threeDModelNode
    },

  ];


const initialEdges = [{ id: '1-2', source: '1', target: '2'}];

export default function MainWindow(props) {
  const [windows, setWindows] = React.useState(['Flowchart', 'Mapa']);
  const [displayedWindow, changeDisplayedWindow] = React.useState('Flowchart');
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  return (
    <Box sx={{ flexGrow: 1 }}>
         <Box sx={{ display:"flex",flexDirection:'row', p:0, alignItems: 'center', justifyContent: 'left', backgroundColor: primaryColor}}>
        {
            windows.map((window) => {
                return (
                    <Box key={window} sx={{ display:"flex",flexDirection:'row'
                    , p:0, alignItems: 'center', justifyContent: 'left', backgroundColor: primaryColor}}>
                        <Box sx={{backgroundColor: displayedWindow === window ? secondaryColor : primaryColor,
                             borderColor: tertiaryColor,
                               borderWidth: 3, borderStyle:'solid', m:0,
                               borderBottomWidth: displayedWindow === window ? 0: 3}} onClick={() => changeDisplayedWindow(window)}>
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
                    filler
                </Typography>
            </Box>
        </Box>

        {displayedWindow === 'Flowchart' ? <Flow key={'flowchart'} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}> </Flow>  : <div>Not implemented yet</div>}
      </Box>
  );
}