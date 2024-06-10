import * as React from "react";
import Box from "@mui/material/Box";
import Flow from "../flowchart/Flow";
import L from "leaflet";
import { Alert, IconButton, Typography } from "@mui/material";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import { NodeType } from "../models/NodeTypes";
import {
  EndDialogProps,
  ImageProps,
  QuizProps,
  ThreeDModelProps,
  VideoProps,
} from "../flowchart/nodes/nodeProps";
import TopAppBar from "./AppBar";
import MapWindow from "../map/MapWindow";
import maps from "../data/maps";
import DialogueTree from "../dialogue_tree/DialogueTree";
import { CloseOutlined } from "@mui/icons-material";
import { DialogNodeType } from "../models/DialogNodeTypes";
import { ApiDataRepository } from "../api/ApiDataRepository";
import { narrator } from "../data/narrator";
import { v4 as uuid } from "uuid";
import { findRemovedIndex, generateInspectorProps } from "../data/utils";
import { defaultNodes } from "../data/defaultNodes";

const defaultNarrator = {
  id: 0,
  name: "Narrador",
  description: "O narrador da história",
  image: {
    inputType: "url",
    filename: "../assets/character_dialogue_node.png",
    blob: null,
  },
};

const initialNodes = JSON.parse(
  localStorage.getItem("nodes") || JSON.stringify(defaultNodes)
);
const initialEdges = JSON.parse(localStorage.getItem("edges") || "[]");

export default function MainWindow(props) {
  const repo = ApiDataRepository.getInstance();
  const [windows, setWindows] = React.useState(["História", "Mapa"]);
  const [mapsState, setMaps] = React.useState(maps);
  const [selectedMap, setSelectedMap] = React.useState(
    maps.length > 0 ? maps[0] : null
  );
  const [mountMap, setMountMap] = React.useState(true);
  const [displayedWindow, changeDisplayedWindow] = React.useState("História");
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [characters, setCharacters] = React.useState(
    localStorage.getItem("characters")
      ? JSON.parse(localStorage.getItem("characters"))
      : [narrator]
  );

  const [dialogNodes, setDialogNodes] = React.useState([]);
  const [dialogEdges, setDialogEdges] = React.useState([]);
  const [dialogueNodeId, setDialogueNodeId] = React.useState(null);

  const [projectTitle, setProjectTitle] = React.useState(
    localStorage.getItem("projectTitle") || "Adicione um título ao projeto"
  );

  React.useEffect(() => {
    if (!mountMap) {
      setMountMap(true);
    }
  }, [mountMap]);

  React.useEffect(() => {
    let newNodes = [...nodes];
    for (let i = 0; i < newNodes.length; i++) {
      if (newNodes[i].type == NodeType.characterNode) {
        const dialogNodesWithCharacter = newNodes[i].data.dialog.nodes.filter(
          (node) =>
            node.type == DialogNodeType.dialogNode ||
            node.type == DialogNodeType.dialogChoiceNode
        );
        for (let j = 0; j < dialogNodesWithCharacter.length; j++) {
          const characterInNode = dialogNodesWithCharacter[j].data.character;
          const characterLocal = characters.find(
            (character) => character.id === characterInNode.id
          );
          if (characterLocal) {
            dialogNodesWithCharacter[j].data.character = characterLocal;
          } else {
            dialogNodesWithCharacter[j].data.character = {
              name: "Personagem não encontrado",
              image: {
                inputType: "url",
                filename: "./assets/caution_sign.svg",
              },
            };
          }
        }
        console.log(dialogNodesWithCharacter);
      }

      if (newNodes[i].data && newNodes[i].data.character) {
        const character = characters.find(
          (character) => character.id === newNodes[i].data.character.id
        );
        if (character) {
          newNodes[i].data.character = character;
        } else {
          newNodes[i].data.character = {
            name: "Personagem não encontrado",
            image: {
              inputType: "url",
              filename: "./assets/caution_sign.svg",
            },
          };
        }
      }
    }
    setNodes(newNodes);
  }, [characters]);

  const handleLoadLocal = () => {
    // read NODES and EDGES from file
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setNodes(data.nodes);
        setEdges(data.edges);
        setMaps(data.maps);
        setSelectedMap(data.maps.length > 0 ? data.maps[0] : null);
        setProjectTitle(data.title);
        localStorage.setItem("edges", JSON.stringify(data.edges));
        localStorage.setItem("nodes", JSON.stringify(data.nodes));
        localStorage.setItem("projectTitle", data.title);
        localStorage.setItem("storyId", data.storyId);
        localStorage.setItem("maps", JSON.stringify(data.maps));
      };
      reader.readAsText(file);
    };
  };

  const handleLoadServer = (projectId) => {
    if (projectId == undefined) return;
    repo.getProject(projectId).then((data) => {
      setNodes(data.nodes);
      setEdges(data.edges);
      setMaps(data.maps);
      setSelectedMap(
        data.maps ? (data.maps.length > 0 ? data.maps[0] : null) : null
      );
      setProjectTitle(data.title);
      setCharacters(data.characters);
      localStorage.setItem("edges", JSON.stringify(data.edges));
      localStorage.setItem("nodes", JSON.stringify(data.nodes));
      localStorage.setItem("projectTitle", data.title);
      localStorage.setItem("maps", JSON.stringify(data.maps));
      localStorage.setItem("storyId", projectId);
      localStorage.setItem("characters", JSON.stringify(data.characters));
    });
  };

  const handleNewProject = async () => {
    setNodes(defaultNodes);
    setEdges([]);
    setMaps([]);
    setCharacters([narrator]);
    setWindows(["História", "Mapa"]);
    changeDisplayedWindow("História");
    setProjectTitle("Adicione um título ao projeto");
    localStorage.setItem("edges", JSON.stringify([]));
    localStorage.setItem("nodes", JSON.stringify(defaultNodes));
    localStorage.setItem("maps", JSON.stringify([]));
    localStorage.setItem("exported", false);
    localStorage.setItem("experienceName", "");
    localStorage.setItem("experienceDescription", "");
    localStorage.setItem("experienceTags", JSON.stringify([]));
    localStorage.removeItem("storyId");
    localStorage.setItem("projectTitle", "Adicione um título ao projeto");
    narrator.id = 0;
    narrator.name = defaultNarrator.name;
    narrator.description = defaultNarrator.description;
    narrator.image = defaultNarrator.image;
    localStorage.setItem("characters", JSON.stringify([defaultNarrator]));
    try {
      const response = await repo.saveProject(
        "Adicone um título ao projeto",
        defaultNodes,
        [],
        [narrator],
        []
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleSaveLocal = () => {
    //write NODES and EDGES to file
    //write NODES and EDGES to file
    const file = new Blob(
      [
        JSON.stringify({
          title: projectTitle,
          storyId: localStorage.getItem("storyId"),
          nodes: nodes,
          edges: edges,
          maps: mapsState,
        }),
      ],
      {
        type: "application/json",
      }
    );
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;

    a.download = "project.json";
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  const handleSaveServer = async () => {
    //write NODES and EDGES to file
    try {
      const response = await repo.saveProject(
        projectTitle,
        nodes,
        edges,
        characters,
        mapsState
      );
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const addNode = (nodeType, nodeProps) => {
    const newNode = {
      id: uuid(),
      position: {
        x: nodes[nodes.length - 1].position.x + 470,
        y: nodes[nodes.length - 1].position.y,
      },
      data: generateInspectorProps(nodeProps),
      type: nodeType,
    };
    if (newNode.data.sceneName)
      newNode.data.sceneName =
        "Cena " +
        (nodes.filter(
          (node) =>
            node.type !== NodeType.beginNode && node.type !== NodeType.endNode
        ).length +
          1);
    if (localStorage.getItem("scenes")) {
      const scenes = JSON.parse(localStorage.getItem("scenes"));
      scenes[newNode.id] = newNode.data.sceneName;
      localStorage.setItem("scenes", JSON.stringify(scenes));
    } else {
      localStorage.setItem(
        "scenes",
        JSON.stringify({
          [newNode.id]: newNode.data.sceneName,
        })
      );
    }

    setNodes([...nodes, newNode]);
    localStorage.setItem("nodes", JSON.stringify([...nodes, newNode]));
  };

  const addLocation = (markerType) => {
    const imgCoords = new L.latLng(
      selectedMap.mapSize.height / 2,
      selectedMap.mapSize.width / 2
    );
    const anchors = selectedMap.anchors.filter(
      (anchor) => anchor.anchorType === "anchor"
    );
    //TODO: compute realCoords from imgCoords and anchor position and mapSize
    const realCoords = {
      lat: imgCoords.lat * selectedMap.scale + anchors[0].coords.lat,
      lng: imgCoords.lng * selectedMap.scale + anchors[0].coords.lng,
    };
    setMountMap(false);
    const newAnchor = {
      anchorId: selectedMap.anchors.length + 1,
      anchorType: markerType,
      coords: realCoords,
      imgCoords: imgCoords,
      name: "Novo Local",
      description: "Descrição do Local",
    };
    selectedMap.anchors.push(newAnchor);
    setSelectedMap(selectedMap);
    const newMaps = mapsState.filter((map) => map.id != selectedMap.id);
    newMaps.push(selectedMap);
    setMaps(newMaps);
    localStorage.setItem("maps", JSON.stringify(newMaps));
  };

  const changeOneNode = (nodeId, newData, oldEndData) => {
    const oldNode = nodes.find((node) => node.id === nodeId);

    if (oldNode.type === NodeType.characterNode) {
      const oldDialogNodesEndsNames = oldNode.data.dialog.nodes
        .filter((node) => node.type === DialogNodeType.endDialogNode)
        .map((node) => node.data.id);
      const newDialogNodesEndsNames = newData.nodes
        .filter((node) => node.type === DialogNodeType.endDialogNode)
        .map((node) => node.data.id);
      if (oldDialogNodesEndsNames.length > newDialogNodesEndsNames.length) {
        const removedIndex = findRemovedIndex(
          oldDialogNodesEndsNames,
          newDialogNodesEndsNames
        );
        const newEdges = edges.filter(
          (edge) =>
            !(
              edge.source == nodeId &&
              edge.sourceHandle == oldDialogNodesEndsNames[removedIndex]
            )
        );
        setEdges(newEdges);

        localStorage.setItem("edges", JSON.stringify(newEdges));
      } else if (
        oldDialogNodesEndsNames.length == newDialogNodesEndsNames.length &&
        oldEndData
      ) {
        const newDialogEndName = newData.nodes.find(
          (node) => node.id == oldEndData.changedId
        ).data.id;

        const oldEndName = oldEndData.oldEndName;

        const newEdges = edges.map((edge) => {
          if (edge.source == nodeId && edge.sourceHandle == oldEndName) {
            return {
              ...edge,
              sourceHandle: newDialogEndName,
            };
          }

          return edge;
        });
        setEdges(newEdges);
        console.log(newEdges);
        localStorage.setItem("edges", JSON.stringify(newEdges));
      }
    }

    const newNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, dialog: newData } };
      }
      return node;
    });
    setNodes(newNodes);

    localStorage.setItem("nodes", JSON.stringify(newNodes));
  };
  const addDialogueNode = (nodeType, nodeProps) => {
    if (!(nodeType in DialogNodeType)) return;

    const newNode = {
      id: (dialogNodes.length + 1).toString(),
      position: {
        x: dialogNodes[dialogNodes.length - 1].position.x + 300,
        y: dialogNodes[dialogNodes.length - 1].position.y,
      },
      data: generateInspectorProps(nodeProps),
      type: nodeType,
    };

    changeOneNode(dialogueNodeId, {
      nodes: [...dialogNodes, newNode],
      edges: dialogEdges,
    });
    setDialogNodes([...dialogNodes, newNode]);
  };

  return (
    <>
      <TopAppBar
        nodes={nodes}
        selectedMap={selectedMap}
        edges={edges}
        characters={characters}
        setCharacters={setCharacters}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        currentWindow={displayedWindow}
        addNode={addNode}
        addDialogueNode={addDialogueNode}
        addLocation={addLocation}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        handleSaveServer={handleSaveServer}
        handleLoadServer={handleLoadServer}
        handleNewProject={handleNewProject}
      ></TopAppBar>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 0,
            alignItems: "center",
            justifyContent: "left",
            backgroundColor: primaryColor,
          }}
        >
          {windows.map((window) => {
            return (
              <Box
                key={window}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  p: 0,
                  alignItems: "center",
                  justifyContent: "left",
                  backgroundColor: primaryColor,
                }}
              >
                <Box
                  sx={{
                    backgroundColor:
                      displayedWindow === window
                        ? secondaryColor
                        : primaryColor,
                    borderColor: tertiaryColor,
                    borderWidth: 3,
                    borderStyle: "solid",
                    cursor: "pointer",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    m: 0,
                    borderBottomWidth: displayedWindow === window ? 0 : 3,
                  }}
                >
                  <Typography
                    onClick={() => changeDisplayedWindow(window)}
                    variant="h7"
                    component="div"
                    sx={{ flexGrow: 1, py: 1, px: 2, color: textColor, m: 0 }}
                  >
                    {window}
                  </Typography>
                  {window.startsWith("Diálogo") ? (
                    <IconButton
                      sx={{
                        color: textColor,
                        m: 0,
                        p: 0,
                      }}
                      onClick={() => {
                        changeDisplayedWindow("História");
                        setWindows(windows.filter((w) => w !== window));
                      }}
                    >
                      <CloseOutlined></CloseOutlined>
                    </IconButton>
                  ) : null}
                </Box>
              </Box>
            );
          })}

          <Box
            sx={{
              flexGrow: 1,
              height: "-webkit-fill-available",
              m: 0,
              borderColor: tertiaryColor,
              borderWidth: 2,
              borderStyle: "solid",
            }}
          >
            <Typography
              variant="h7"
              component="div"
              sx={{ flexGrow: 1, py: 1, px: 2, color: primaryColor }}
            >
              filler
            </Typography>
          </Box>
        </Box>

        {displayedWindow === "História" ? (
          <Flow
            characters={characters}
            setWindows={setWindows}
            changeDisplayedWindow={changeDisplayedWindow}
            windows={windows}
            changeWindows={setWindows}
            key={"flowchart"}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            setDialogNodes={setDialogNodes}
            setDialogEdges={setDialogEdges}
            setDialogueNodeId={setDialogueNodeId}
          ></Flow>
        ) : displayedWindow == "Mapa" ? (
          mountMap ? (
            <MapWindow
              mapState={mapsState}
              setMaps={setMaps}
              selectedMap={selectedMap}
              setSelectedMap={setSelectedMap}
            />
          ) : null
        ) : displayedWindow.startsWith("Diálogo") ? (
          <DialogueTree
            characters={characters}
            nodes={dialogNodes}
            edges={dialogEdges}
            setEdges={setDialogEdges}
            setNodes={setDialogNodes}
            nodeId={dialogueNodeId}
            applyChanges={changeOneNode}
            key={"dialogue"}
          ></DialogueTree>
        ) : null}
      </Box>
    </>
  );
}
