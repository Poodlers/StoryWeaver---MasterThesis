import React, { useMemo, useState } from 'react';
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges,addEdge, MiniMap, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';
import QuizNode from './nodes/QuizNode';
import VideoNode from './nodes/VideoNode';
import ImageNode from './nodes/ImageNode';
import ThreeDModelNode from './nodes/3DModelNode';
import { secondaryColor, textColor } from '../themes';
import Inspector from './Inspector';
import { ImageProps, QuizProps, ThreeDModelProps, VideoProps } from './nodes/nodeProps';

const nodeColor = (node) => {
  switch (node.type) {
    case 'quizNode':
      return '#6ede87';
    case 'videoNode':
      return '#6865A5';
    case 'imageNode':
      return '#ff0072';
    case 'ThreeDNode':
      return '#ff0072';
    default:
      return '#ff0072';
  }
};

function Flow(props) {

const [inspectorProps, setInspectorProps] = useState({});
const {nodes, edges, setNodes, setEdges} = props;
const nodeTypes = useMemo(() => ({ quizNode: QuizNode, videoNode: VideoNode, imageNode: ImageNode, ThreeDNode: ThreeDModelNode}), []);

const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
return (
    <div style={{display:'flex', flexDirection: 'row',  height: '85vh', width: '100vw', margin: '0 auto'}}>
      <ReactFlow 
      onNodeClick={(event, node) => {
      
         switch (node.type) {
          case 'quizNode':
            setInspectorProps(QuizProps)
            break;
          case 'videoNode':
            setInspectorProps(VideoProps)
            break;
          case 'imageNode':
            setInspectorProps(ImageProps)
            break;
          case 'ThreeDNode':
            setInspectorProps(ThreeDModelProps)
            break;
        

  }
      }
      }
       nodeTypes={nodeTypes}
       nodes={nodes}
       onNodesChange={onNodesChange}
       edges={edges}
       onEdgesChange={onEdgesChange}
       onConnect={onConnect}
       fitView>
        <Background 
        style={{backgroundColor: textColor}}
        id="1"
        gap={10}
        color={textColor}
        variant={BackgroundVariant.Dots}/>
        <MiniMap zoomStep={2} nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable maskColor={"rgb(240, 240, 240, 0.6)"} maskStrokeColor={secondaryColor} />
        <Controls showZoom={true} position={'top-right'} style={{ display: 'flex', flexDirection: 'row', backgroundColor: secondaryColor,
        'button': {
          backgroundColor: textColor,
          color: secondaryColor,
          border: 'none',
          borderRadius: 5,
          padding: 10,
        },
      }}/>
      </ReactFlow>
      <Inspector data={inspectorProps}></Inspector>

    </div>
  );
}

export default Flow;
