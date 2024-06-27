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
  useReactFlow,
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
import { findRemovedIndex } from "../data/utils";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { v4 as uuid } from "uuid";

const nodeColor = (node) => {
  switch (node.type) {
    case NodeType.beginNode:
      return "#7080B9";
    case NodeType.endNode:
      return "#B97070";
    default:
      return "#5F6F52";
  }
};

function Flow(props) {
  const repo = ApiDataRepository.getInstance();
  const [selectedNode, setSelectedNode] = useState(undefined);
  const selectedNodeRef = useRef(selectedNode);
  const [inspectorData, setInspectorData] = useState({});

  const [inspectorProps, setInspectorProps] = useState(undefined);
  const [pannable, setPannable] = useState(true);
  const edgeUpdateSuccessful = useRef(true);
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
    characters,
  } = props;

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

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

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    function onCopyPaste(event) {
      // Check for Ctrl+C (copy) or Ctrl+V (paste)
      if (
        document.activeElement &&
        (document.activeElement.matches("input") ||
          document.activeElement.matches("textarea"))
      ) {
        return;
      }
      if (event.ctrlKey && (event.key === "c" || event.key === "C")) {
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
          selectedNodeRef.current.type === NodeType.beginNode
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

    function onPasteDefault(event) {
      if (event.target === document.body) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    document.addEventListener("paste", onPasteDefault);

    document.addEventListener("keydown", onCopyPaste);

    return () => {
      document.removeEventListener("keydown", onCopyPaste);
      document.removeEventListener("paste", onPasteDefault);
    };
  }, []);

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
        edgeUpdateSuccessful.current = true;
        localStorage.setItem(
          "edges",
          JSON.stringify(updateEdge(oldEdge, newConnection, els))
        );
        return updateEdge(oldEdge, newConnection, els);
      }),
    []
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

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
    let newNodes = [...nodesRef.current];
    let newEdges = [...edgesRef.current];
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
        //delete the assets used by the node
        const file = newNodes[i].data ? newNodes[i].data.file : null;
        const checkIfFileInAnotherNode = (filename) => {
          for (let i = 0; i < newNodes.length; i++) {
            if (newNodes[i].id === idToDelete) continue;
            if (
              newNodes[i].data &&
              newNodes[i].data.file &&
              newNodes[i].data.file.filename === filename
            ) {
              return true;
            }
          }
          return false;
        };

        const background = newNodes[i].data
          ? newNodes[i].data.background
          : null;

        const checkIfBackgroundInAnotherNode = (background) => {
          for (let i = 0; i < newNodes.length; i++) {
            if (newNodes[i].id === idToDelete) continue;
            if (
              newNodes[i].data &&
              newNodes[i].data.background === background
            ) {
              return true;
            }
          }
          return false;
        };
        const ar_type = newNodes[i].data ? newNodes[i].data.ar_type : null;
        const checkIfArTypeInAnotherNode = (ar_type) => {
          for (let i = 0; i < newNodes.length; i++) {
            if (newNodes[i].id === idToDelete) continue;
            if (
              newNodes[i].data &&
              newNodes[i].data.ar_type &&
              newNodes[i].data.ar_type.image === ar_type.image
            ) {
              return true;
            }
          }
          return false;
        };

        if (
          file &&
          file.inputType === "file" &&
          file.filename !== "" &&
          !checkIfFileInAnotherNode(file.filename)
        ) {
          repo
            .deleteFile(file.filename)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (
          background &&
          background.inputType === "file" &&
          background.filename !== "" &&
          !checkIfBackgroundInAnotherNode(background)
        ) {
          repo
            .deleteFile(background.filename)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (
          ar_type &&
          ar_type.image.inputType === "file" &&
          ar_type.image.filename !== "" &&
          !checkIfArTypeInAnotherNode(ar_type)
        ) {
          repo
            .deleteFile(ar_type.image.filename)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
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
          setDialogNodes(JSON.parse(JSON.stringify(data["dialog"].nodes)));
          setDialogEdges(JSON.parse(JSON.stringify(data["dialog"].edges)));
          setDialogueNodeId(newNodes[i].id);
        }
        if (newNodes[i].type === NodeType.quizNode) {
          const oldAnswers = newNodes[i].data.answers;
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

            localStorage.setItem("edges", JSON.stringify(newEdges));
          }
        }
        newNodes[i].data = data;
        setNodes(newNodes);
        localStorage.setItem("nodes", JSON.stringify(newNodes));
        break;
      }
    }
  };
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowRef = useRef(null);
  const onInit = (rf) => {
    setReactFlowInstance(rf);
    reactFlowRef.current = rf;
  };

  useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "84vh",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <ReactFlow
        onInit={onInit}
        minZoom={0.3}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
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
              : ["Backspace", "Delete"]
            : ["Backspace", "Delete"]
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
            selectedNode.data.isSelectedForCopy = false;
            let newNodes = [...nodes];
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == selectedNode.id) {
                newNodes[i].data = selectedNode.data;
                setNodes(newNodes);
                break;
              }
            }
          }
          if (event.target.id == "deleteButton") {
            handleDelete(node.id);
            return;
          } else if (event.target.id == "scene-name") {
            setSelectedNode(undefined);
            selectedNodeRef.current = undefined;
            return;
          }

          if (node.type !== NodeType.beginNode) {
            node.data.isSelectedForCopy = false;
            if (node.type == NodeType.endNode) {
              reactFlowInstance.setCenter(
                node.position.x + 50,
                node.position.y + 50
              );
              reactFlowInstance.zoomTo(1.3, { duration: 500 });
            } else {
              reactFlowInstance.setCenter(
                node.position.x + 200,
                node.position.y + 380
              );
              reactFlowInstance.zoomTo(0.79, { duration: 500 });
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

export default Flow;
