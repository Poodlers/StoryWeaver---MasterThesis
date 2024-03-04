import React, { useMemo } from 'react';
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges,addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useCallback } from 'react';
import QuizNode from './nodes/QuizNode';
import VideoNode from './nodes/VideoNode';
import ImageNode from './nodes/ImageNode';
import ThreeDModelNode from './nodes/3DModelNode';


function Flow(props) {

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
    <div style={{  height: '85vh', width: '95vw', margin: '0 auto'}}>
      <ReactFlow 
      nodeTypes={nodeTypes}
      nodes={nodes}
       onNodesChange={onNodesChange}
       edges={edges}
       onEdgesChange={onEdgesChange}
       onConnect={onConnect}
       fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
