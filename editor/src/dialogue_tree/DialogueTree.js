import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { findRemovedIndex } from "../data/utils";
import { v4 as uuid } from "uuid";

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
  const edgeUpdateSuccessful = useRef(true);
  const [selectedNode, setSelectedNode] = useState(undefined);
  const selectedNodeRef = useRef(selectedNode);
  const [inspectorData, setInspectorData] = useState({});
  const [inspectorProps, setInspectorProps] = useState(undefined);

  const { nodes, setNodes, edges, setEdges, characters, nodeId } = props;

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

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    function onCopyPaste(event) {
      // Check for Ctrl+C (copy) or Ctrl+V (paste)
      if (event.ctrlKey && (event.key === "c" || event.key === "C")) {
        console.log("ctrl + C key pressed");
        if (selectedNodeRef.current === undefined) return;
        if (selectedNodeRef.current.data.isSelectedForCopy) return;
        selectedNodeRef.current.data.isSelectedForCopy = true;

        setNodes((nds) => {
          return nds.map((node) => {
            if (node.id === selectedNodeRef.current.id) {
              node.data.isSelectedForCopy = true;
              return node;
            }
            return node;
          });
        });
      }
      if (event.ctrlKey && (event.key === "v" || event.key === "V")) {
        if (
          selectedNodeRef.current === undefined ||
          selectedNodeRef.current.type === DialogNodeType.beginDialogNode
        )
          return;
        selectedNodeRef.current.data.isSelectedForCopy = false;
        const newNode = {
          id: uuid(),
          position: {
            x: selectedNodeRef.current.position.x + 100,
            y: selectedNodeRef.current.position.y + 100,
          },
          data: JSON.parse(JSON.stringify(selectedNodeRef.current.data)),
          type: selectedNodeRef.current.type,
        };
        setNodes((nds) => {
          setSelectedNode(selectedNodeRef.current);
          const newNodes = nds.map((node) => {
            if (node.id === selectedNodeRef.current.id) {
              node.data.isSelectedForCopy = false;
              return node;
            }
            return node;
          });
          localStorage.setItem("nodes", JSON.stringify([...newNodes, newNode]));
          return [...newNodes, newNode];
        });
      }
      if (event.ctrlKey && (event.key === "x" || event.key === "X")) {
        console.log("ctrl + X key pressed");
        if (selectedNodeRef.current == undefined) return;
        handleDelete(selectedNodeRef.current.id);
      }
    }
    document.addEventListener("keydown", onCopyPaste);

    return () => {
      document.removeEventListener("keydown", onCopyPaste);
    };
  }, []);

  const onConnect = (params) =>
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

      applyChanges(nodeId, undefined, addEdge(params, els));
      return addEdge(params, els);
    });

  // gets called after end of edge gets dragged to another source or target

  const onEdgeUpdate = (oldEdge, newConnection) =>
    setEdges((els) => {
      if (
        els.find((edge) => edge.sourceHandle == newConnection.sourceHandle) !=
        undefined
      ) {
        return els;
      }
      edgeUpdateSuccessful.current = true;

      applyChanges(nodeId, undefined, updateEdge(oldEdge, newConnection, els));
      return updateEdge(oldEdge, newConnection, els);
    });

  const onEdgeUpdateStart = () => {
    edgeUpdateSuccessful.current = false;
  };

  const onEdgeUpdateEnd = (_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));

      applyChanges(
        nodeId,
        undefined,
        edges.filter((e) => e.id !== edge.id)
      );
    }

    edgeUpdateSuccessful.current = true;
  };

  const onNodesChange = (changes) =>
    setNodes((nds) => {
      applyChanges(nodeId, applyNodeChanges(changes, nds), undefined);

      return applyNodeChanges(changes, nds);
    });

  const onEdgesChange = (changes) =>
    setEdges((eds) => {
      applyChanges(nodeId, undefined, applyEdgeChanges(changes, eds));
      return applyEdgeChanges(changes, eds);
    });

  const handleDelete = (idToDelete) => {
    let newNodes = [...nodesRef.current];
    let newEdges = [...edgesRef.current];
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

    applyChanges(nodeId, newNodes, newEdges);
    setNodes(newNodes);
    setEdges(newEdges);
    setInspectorProps(undefined);
    setInspectorData({});
    setSelectedNode(undefined);
  };

  const handleNodeDataChange = (id, data) => {
    let newNodes = [...nodes];
    for (let i = 0; i < newNodes.length; i++) {
      if (newNodes[i].id == id) {
        const oldData = newNodes[i].data;

        if (newNodes[i].type == DialogNodeType.dialogChoiceNode) {
          const oldAnswers = oldData.answers;
          const newAnswers = data.answers;

          //case answer is deleted
          if (oldAnswers.length > newAnswers.length) {
            const removedIndex = findRemovedIndex(oldAnswers, newAnswers);
            const newEdges = edges.filter(
              (edge) =>
                !(
                  edge.source == newNodes[i].id &&
                  edge.sourceHandle == removedIndex
                )
            );

            setEdges(newEdges);
          }
        }
        newNodes[i].data = data;
        applyChanges(nodeId, newNodes, undefined, {
          oldEndName: oldData.id,
          changedId: id,
        });
        setNodes(newNodes);

        break;
      }
    }
  };

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onInit = (rf) => {
    setReactFlowInstance(rf);
  };

  useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance, nodeId]);

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
        key={nodeId}
        onInit={onInit}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
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
                applyChanges(nodeId, newNodes, undefined);
                break;
              }
            }
          }
        }}
        deleteKeyCode={
          selectedNode
            ? selectedNode.type === DialogNodeType.beginDialogNode
              ? ""
              : ["Backspace", "Delete"]
            : ["Backspace", "Delete"]
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
                selectedNode.data.isSelectedForCopy = false;
                setNodes(newNodes);
                applyChanges(nodeId, newNodes, undefined);
                break;
              }
            }
          }

          if (event.target.id == "audioButton") {
            return;
          }

          if (node.type !== DialogNodeType.beginDialogNode) {
            node.data.isSelectedForCopy = false;
            if (node.type == DialogNodeType.endDialogNode) {
              reactFlowInstance.setCenter(
                node.position.x + 50,
                node.position.y + 50
              );
              reactFlowInstance.zoomTo(1.3, { duration: 500 });
            } else {
              reactFlowInstance.setCenter(
                node.position.x + 100,
                node.position.y + 175
              );
              reactFlowInstance.zoomTo(1.1, { duration: 500 });
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
        setData={setInspectorProps}
      ></Inspector>
    </div>
  );
}

export default DialogueTree;
