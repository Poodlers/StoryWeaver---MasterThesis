import React, { useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  MiniMap,
  BackgroundVariant,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import { secondaryColor, textColor } from "../themes";
import Inspector from "../flowchart/Inspector";
import { DialogNodeType } from "../models/DialogNodeTypes";
import BeginNode from "./BeginNode";
import DialogNode from "./DialogNode";
import EndNode from "./EndNode";
import DialogChoiceNode from "./DialogChoiceNode";
import {
  DialogChoiceProps,
  DialogProps,
  EndDialogProps,
} from "../flowchart/nodes/nodeProps";

const nodeColor = (node) => {
  switch (node.type) {
    case DialogNodeType.beginDialogNode:
      return "#6ede87";
    case DialogNodeType.dialogNode:
      return "#6865A5";
    case DialogNodeType.endDialogNode:
      return "#ff0072";
    default:
      return "#ff0072";
  }
};

function DialogueTree(props) {
  const [selectedNode, setSelectedNode] = useState(undefined);
  const [inspectorData, setInspectorData] = useState({});
  const [inspectorProps, setInspectorProps] = useState(undefined);
  const nodeId = props.nodeId;
  const characters = props.characters;
  const { nodes, setNodes, edges, setEdges } = props;

  const applyChanges = props.applyChanges;
  const nodeTypes = useMemo(
    () => ({
      beginDialogNode: BeginNode,
      dialogNode: DialogNode,
      endDialogNode: EndNode,
      dialogChoiceNode: DialogChoiceNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((els) => {
        if (
          els.find(
            (edge) =>
              edge.sourceHandle == params.sourceHandle &&
              edge.source == params.source
          ) != undefined
        ) {
          return els;
        }
        applyChanges(nodeId, { nodes: nodes, edges: addEdge(params, els) });
        return addEdge(params, els);
      }),
    []
  );

  // gets called after end of edge gets dragged to another source or target

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => {
        if (
          els.find((edge) => edge.sourceHandle == newConnection.sourceHandle) !=
          undefined
        ) {
          return els;
        }
        applyChanges(nodeId, {
          nodes: nodes,
          edges: updateEdge(oldEdge, newConnection, els),
        });
        return updateEdge(oldEdge, newConnection, els);
      }),
    []
  );

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        applyChanges(nodeId, {
          nodes: applyNodeChanges(changes, nds),
          edges: edges,
        });
        return applyNodeChanges(changes, nds);
      }),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        applyChanges(nodeId, {
          nodes: nodes,
          edges: applyEdgeChanges(changes, eds),
        });
        return applyEdgeChanges(changes, eds);
      }),
    []
  );

  const handleDelete = (idToDelete) => {
    let newNodes = [...nodes];
    let newEdges = [...edges];
    let indexToDelete = -1;
    for (let i = 0; i < newNodes.length; i++) {
      if (newNodes[i].id == idToDelete) {
        indexToDelete = i;
        break;
      }
    }
    if (indexToDelete != -1) {
      newNodes.splice(indexToDelete, 1);
    }
    newEdges = newEdges.filter(
      (edge) => edge.source != idToDelete && edge.target != idToDelete
    );
    setNodes(newNodes);
    setEdges(newEdges);
    applyChanges(nodeId, { nodes: newNodes, edges: newEdges });
    setInspectorProps(undefined);
    setInspectorData({});
    setSelectedNode(undefined);
  };

  const handleNodeDataChange = (id, data) => {
    let newNodes = [...nodes];
    for (let i = 0; i < newNodes.length; i++) {
      if (newNodes[i].id == id) {
        newNodes[i].data = data;
        setNodes(newNodes);
        applyChanges(nodeId, { nodes: newNodes, edges: edges });
        break;
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "85vh",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <ReactFlow
        onPaneClick={(event) => {
          setInspectorProps(undefined);
          if (selectedNode != undefined) {
            // the node is changing, save the current inspector data
            selectedNode.data = inspectorData;
            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].data = selectedNode.data;
                setNodes(newNodes);
                applyChanges(nodeId, { nodes: newNodes, edges: edges });
                break;
              }
            }
          }
        }}
        deleteKeyCode={
          selectedNode
            ? selectedNode.type === DialogNodeType.beginDialogNode
              ? ""
              : "Delete"
            : "Delete"
        }
        onNodesDelete={(nodeToDelete) => {
          handleDelete(nodeToDelete[0].id);
        }}
        onEdgeUpdate={onEdgeUpdate}
        onNodeClick={(event, node) => {
          if (selectedNode != undefined && node.id != selectedNode.id) {
            // the node is changing, save the current inspector data
            selectedNode.data = inspectorData;

            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].data = selectedNode.data;
                setNodes(newNodes);
                applyChanges(nodeId, { nodes: newNodes, edges: edges });
                break;
              }
            }
          }

          setSelectedNode(node);
          let inspecProps = undefined;
          switch (node.type) {
            case DialogNodeType.beginDialogNode:
              break;
            case DialogNodeType.dialogNode:
              inspecProps = DialogProps;
              break;
            case DialogNodeType.endDialogNode:
              inspecProps = EndDialogProps;
              break;
            case DialogNodeType.dialogChoiceNode:
              inspecProps = DialogChoiceProps;
              break;
          }

          const dataProps = node.data;
          setInspectorData(dataProps);
          setInspectorProps(inspecProps);
        }}
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background
          style={{ backgroundColor: textColor }}
          id="1"
          gap={10}
          color={textColor}
          variant={BackgroundVariant.Dots}
        />
        <MiniMap
          zoomStep={2}
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
          maskColor={"rgb(240, 240, 240, 0.6)"}
          maskStrokeColor={secondaryColor}
        />
        <Controls
          showZoom={true}
          position={"top-right"}
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: secondaryColor,
            button: {
              backgroundColor: textColor,
              color: secondaryColor,
              border: "none",
              borderRadius: 5,
              padding: 10,
            },
          }}
        />
      </ReactFlow>
      <Inspector
        characters={characters}
        value={inspectorData}
        nodeId={selectedNode ? selectedNode.id : undefined}
        handleNodeDataChange={handleNodeDataChange}
        handleDelete={handleDelete}
        setValue={setInspectorData}
        data={inspectorProps}
      ></Inspector>
    </div>
  );
}

export default DialogueTree;
