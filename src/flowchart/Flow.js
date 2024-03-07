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
import { NodeType } from '../models/NodeTypes';

const nodeColor = (node) => {
  switch (node.type) {
    case NodeType.quizNode:
      return '#6ede87';
    case NodeType.videoNode:
      return '#6865A5';
    case NodeType.imageNode:
      return '#ff0072';
    case NodeType.threeDModelNode:
      return '#ff0072';
    default:
      return '#ff0072';
  }
};



function Flow(props) {
const [selectedNode, setSelectedNode] = useState(undefined);
const [inspectorData, setInspectorData] = useState({});
const [inspectorProps, setInspectorProps] = useState(undefined);
const {nodes, edges, setNodes, setEdges} = props;
const nodeTypes = useMemo(() => ({ quizNode: QuizNode,
   videoNode: VideoNode,
    imageNode: ImageNode, 
    threeDModelNode: ThreeDModelNode}), []);

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
      
      onPaneClick={(event) => {
         setInspectorProps(undefined);
         if (selectedNode != undefined) {
          // the node is changing, save the current inspector data
           selectedNode.values = inspectorData;
           console.log("Saving node: ", selectedNode.id, " with data: ", selectedNode.values);
           let newNodes = [...nodes];
           for (let i = 0; i < nodes.length; i++) {
             if (nodes[i].id == selectedNode.id) {
               newNodes[i].values = selectedNode.values;
               setNodes(newNodes);
               break;
             }
           }

        }
      }
      }
      onNodeClick={(event, node) => {
        
         if (selectedNode != undefined && node.id != selectedNode.id) {
           // the node is changing, save the current inspector data
            selectedNode.values = inspectorData;
            console.log("Saving node: ", selectedNode.id, " with data: ", selectedNode.values);
            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].values = selectedNode.values;
                setNodes(newNodes);
                break;
              }
            }

         }
           
         setSelectedNode(node);
         let inspecProps = undefined;
         switch (node.type) {
          case NodeType.quizNode:
            inspecProps = QuizProps  
            break;
          case NodeType.videoNode:
            inspecProps = VideoProps
            break;
          case NodeType.imageNode:
            inspecProps = ImageProps
            break;
          case NodeType.threeDModelNode:
            inspecProps = ThreeDModelProps
            break;
          default:
            return;
         }

        const dataProps = node.values;
        setInspectorData(dataProps)
        setInspectorProps(inspecProps)
        
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
      <Inspector value={inspectorData} setValue={setInspectorData} data={inspectorProps} ></Inspector>

    </div>
  );
}

export default Flow;
