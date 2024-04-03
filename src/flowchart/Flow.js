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
import QuizNode from "./nodes/QuizNode";
import VideoNode from "./nodes/VideoNode";
import ImageNode from "./nodes/ImageNode";
import AudioNode from "./nodes/AudioNode";
import ThreeDModelNode from "./nodes/3DModelNode";
import { secondaryColor, textColor } from "../themes";
import Inspector from "./Inspector";
import {
  AudioProps,
  CharacterProps,
  ImageProps,
  PathProps,
  QuizProps,
  TextProps,
  ThreeDModelProps,
  VideoProps,
} from "./nodes/nodeProps";
import { NodeType } from "../models/NodeTypes";
import CharacterNode from "./nodes/CharacterNode";
import TextNode from "./nodes/TextNode";
import PathNode from "./nodes/PathNode";

const nodeColor = (node) => {
  switch (node.type) {
    case NodeType.quizNode:
      return "#6ede87";
    case NodeType.videoNode:
      return "#6865A5";
    case NodeType.imageNode:
      return "#ff0072";
    case NodeType.threeDModelNode:
      return "#ff0072";
    case NodeType.characterNode:
      return "#ff0072";
    case NodeType.pathNode:
      return "#ff0072";
    case NodeType.textNode:
      return "#ff0072";
    default:
      return "#ff0072";
  }
};

function Flow(props) {
  const [selectedNode, setSelectedNode] = useState(undefined);
  const [inspectorData, setInspectorData] = useState({});
  const [inspectorProps, setInspectorProps] = useState(undefined);
  const [pannable, setPannable] = useState(true);
  const { nodes, edges, setNodes, setEdges } = props;
  const nodeTypes = useMemo(
    () => ({
      quizNode: QuizNode,
      videoNode: VideoNode,
      imageNode: ImageNode,
      threeDModelNode: ThreeDModelNode,
      characterNode: CharacterNode,
      textNode: TextNode,
      pathNode: PathNode,
      audioNode: AudioNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((els) => {
        localStorage.setItem("edges", JSON.stringify(addEdge(params, els)));
        return addEdge(params, els);
      }),
    []
  );

  // gets called after end of edge gets dragged to another source or target

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => {
        localStorage.setItem(
          "edges",
          JSON.stringify(updateEdge(oldEdge, newConnection, els))
        );
        return updateEdge(oldEdge, newConnection, els);
      }),
    []
  );

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        localStorage.setItem(
          "nodes",
          JSON.stringify(applyNodeChanges(changes, nds))
        );
        return applyNodeChanges(changes, nds);
      }),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        localStorage.setItem(
          "edges",
          JSON.stringify(applyEdgeChanges(changes, eds))
        );
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
    localStorage.setItem("nodes", JSON.stringify(newNodes));
    localStorage.setItem("edges", JSON.stringify(newEdges));
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
        localStorage.setItem("nodes", JSON.stringify(newNodes));
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
        width: "100vw",
        margin: "0 auto",
      }}
    >
      <ReactFlow
        onMouseMove={(event) => {
          if (event.target.closest(".audio-player-container")) {
            setPannable(false);
          } else {
            setPannable(true);
          }
        }}
        panOnDrag={pannable}
        nodesDraggable={pannable}
        onPaneClick={(event) => {
          setInspectorProps(undefined);
          if (selectedNode != undefined) {
            // the node is changing, save the current inspector data
            selectedNode.data = inspectorData;
            console.log(
              "Saving node: ",
              selectedNode.id,
              " with data: ",
              selectedNode.data
            );
            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].data = selectedNode.data;
                setNodes(newNodes);
                break;
              }
            }
          }
        }}
        onEdgeUpdate={onEdgeUpdate}
        onNodeClick={(event, node) => {
          if (node.type != NodeType.audioNode) {
            setPannable(true);
          }
          if (selectedNode != undefined && node.id != selectedNode.id) {
            // the node is changing, save the current inspector data
            selectedNode.data = inspectorData;
            console.log(
              "Saving node: ",
              selectedNode.id,
              " with data: ",
              selectedNode.data
            );
            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].data = selectedNode.data;
                setNodes(newNodes);
                break;
              }
            }
          }

          setSelectedNode(node);
          let inspecProps = undefined;
          switch (node.type) {
            case NodeType.quizNode:
              inspecProps = QuizProps;
              break;
            case NodeType.videoNode:
              inspecProps = VideoProps;
              break;
            case NodeType.imageNode:
              inspecProps = ImageProps;
              break;
            case NodeType.threeDModelNode:
              inspecProps = ThreeDModelProps;
              break;
            case NodeType.characterNode:
              inspecProps = CharacterProps;
              break;
            case NodeType.pathNode:
              inspecProps = PathProps;
              break;
            case NodeType.textNode:
              inspecProps = TextProps;
              break;
            case NodeType.audioNode:
              inspecProps = AudioProps;
              break;
            default:
              return;
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

export default Flow;
