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
  EndDialogProps,
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
import BeginNode from "../dialogue_tree/BeginNode";
import EndNode from "../dialogue_tree/EndNode";

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
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    setWindows,
    windows,
    changeDisplayedWindow,
    changeWindows,
    setDialogNodes,
    setDialogEdges,
    setDialogueNodeId,
  } = props;

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
      beginNode: BeginNode,
      endNode: EndNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((els) => {
        // refuse to add edge if the source already has an edge
        if (
          els.find(
            (edge) =>
              edge.sourceHandle == params.sourceHandle &&
              edge.source == params.source
          ) != undefined
        ) {
          return els;
        }
        localStorage.setItem("edges", JSON.stringify(addEdge(params, els)));
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
        if (newNodes[i].type === NodeType.beginNode) {
          return;
        } else if (newNodes[i].type === NodeType.characterNode) {
          setDialogNodes([]);
          setDialogEdges([]);
          setDialogueNodeId(null);
          if (
            windows.find(
              (window) => window === "Diálogo " + newNodes[i].data["name"]
            ) !== undefined
          ) {
            changeWindows(
              windows.filter(
                (window) => window !== "Diálogo " + newNodes[i].data["name"]
              )
            );
          }
        }
        indexToDelete = i;
        break;
      }
    }
    newNodes = newNodes.filter((node) => node.id != idToDelete);
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

  const handleNodeDataChange = (id, data, openWindow) => {
    let newNodes = [...nodes];

    for (let i = 0; i < newNodes.length; i++) {
      if (newNodes[i].id == id) {
        if (openWindow) {
          if (
            windows.find((window) => window === "Diálogo " + data["name"]) ===
            undefined
          ) {
            setWindows([...windows, "Diálogo " + data["name"]]);
          }

          changeDisplayedWindow("Diálogo " + data["name"]);
          setDialogNodes(data["dialog"].nodes);
          setDialogEdges(data["dialog"].edges);
          setDialogueNodeId(newNodes[i].id);
        }

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
        width: "100%",
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
        deleteKeyCode={
          selectedNode
            ? selectedNode.type === NodeType.beginNode
              ? ""
              : "Delete"
            : "Delete"
        }
        onNodesDelete={(nodeToDelete) => {
          handleDelete(nodeToDelete[0].id);
        }}
        panOnDrag={pannable}
        nodesDraggable={pannable}
        onPaneClick={(event) => {
          setInspectorProps(undefined);
          if (selectedNode != undefined) {
            // the node is changing, save the current inspector data
            if (selectedNode.type == NodeType.characterNode) {
              changeWindows(
                windows.map((window) =>
                  window === "Diálogo " + selectedNode.data["name"]
                    ? "Diálogo " + inspectorData["name"]
                    : window
                )
              );
            }
            selectedNode.data = inspectorData;

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
            if (selectedNode.type == NodeType.characterNode) {
              changeWindows(
                windows.map((window) =>
                  window === "Diálogo " + selectedNode.data["name"]
                    ? "Diálogo " + inspectorData["name"]
                    : window
                )
              );
            }
            selectedNode.data = inspectorData;

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
            case NodeType.endNode:
              inspecProps = EndDialogProps;
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
          maskColor={"rgb(226, 224,214,0.3)"}
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
        setData={setInspectorProps}
      ></Inspector>
    </div>
  );
}

export default Flow;
