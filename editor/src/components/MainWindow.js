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

const generateInspectorProps = (props) => {
  return props.fields.reduce(
    (obj, field) => ({ ...obj, [field.name]: field.initialValue }),
    {}
  );
};

const defaultNodes = [
  {
    id: "0",
    position: { x: 0, y: 0 },
    data: undefined,
    type: NodeType.beginNode,
  },
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: generateInspectorProps(QuizProps),
    type: NodeType.quizNode,
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
    data: generateInspectorProps(VideoProps),
    type: NodeType.videoNode,
  },
  {
    id: "3",
    position: { x: 200, y: 100 },
    data: generateInspectorProps(ImageProps),
    type: NodeType.imageNode,
  },

  {
    id: "4",
    position: { x: 300, y: 100 },
    data: generateInspectorProps(ThreeDModelProps),
    type: NodeType.threeDModelNode,
  },
  {
    id: "5",
    position: { x: 400, y: 100 },
    data: generateInspectorProps(EndDialogProps),
    type: NodeType.endNode,
  },
];

const initialNodes = JSON.parse(
  localStorage.getItem("nodes") || JSON.stringify(defaultNodes)
);
const initialEdges = JSON.parse(localStorage.getItem("edges") || "[]");

export default function MainWindow(props) {
  const repo = ApiDataRepository.getInstance();
  const [windows, setWindows] = React.useState(["Flowchart", "Mapa"]);
  const [mapsState, setMaps] = React.useState(maps);
  const [selectedMap, setSelectedMap] = React.useState(
    maps.length > 0 ? maps[0] : null
  );
  const [mountMap, setMountMap] = React.useState(true);
  const [displayedWindow, changeDisplayedWindow] = React.useState("Flowchart");
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [characters, setCharacters] = React.useState(
    localStorage.getItem("characters")
      ? JSON.parse(localStorage.getItem("characters"))
      : [narrator]
  );

  const [displayAlert, setDisplayAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const [dialogNodes, setDialogNodes] = React.useState([]);
  const [dialogEdges, setDialogEdges] = React.useState([]);
  const [dialogueNodeId, setDialogueNodeId] = React.useState(null);

  const [projectTitle, setProjectTitle] = React.useState(
    localStorage.getItem("projectTitle") || "Projeto Exemplo"
  );

  React.useEffect(() => {
    //check if the saved blobs are still valid
    let newNodes = [...nodes];
    newNodes.forEach((node) => {
      if (
        (node.type === NodeType.imageNode ||
          node.type === NodeType.videoNode) &&
        node.data.file.inputType === "file"
      ) {
        fetch(node.data.file.blob)
          .then((response) => {
            console.log(response);
            if (!response.ok || response.blob.length === 0) {
              repo
                .getFile(node.data.file.filename)
                .then((blob) => {
                  node.data.file.blob = URL.createObjectURL(blob);
                })
                .catch((e) => {
                  console.log("Error fetching the blob from the server");
                });
            }
          })
          .catch((e) => {
            console.log("Replacing the blob with the file from the server");
            repo
              .getFile(node.data.file.filename)
              .then((blob) => {
                node.data.file.blob = URL.createObjectURL(blob);
              })
              .catch((e) => {
                console.log("Error fetching the blob from the server");
              });
          });
      }
    });
    setNodes(newNodes);
    localStorage.setItem("nodes", JSON.stringify(nodes));
  }, []);

  React.useEffect(() => {
    if (!mountMap) {
      setMountMap(true);
    }
  }, [mountMap]);

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
        setProjectTitle(data.projectTitle);
        localStorage.setItem("edges", JSON.stringify(data.edges));
        localStorage.setItem("nodes", JSON.stringify(data.nodes));
        localStorage.setItem("projectTitle", data.projectTitle);
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
      setProjectTitle(data.projectTitle);
      setCharacters(data.characters);
      localStorage.setItem("edges", JSON.stringify(data.edges));
      localStorage.setItem("nodes", JSON.stringify(data.nodes));
      localStorage.setItem("projectTitle", data.projectTitle);
      localStorage.setItem("maps", JSON.stringify(data.maps));
      localStorage.setItem("storyId", projectId);
      localStorage.setItem("characters", JSON.stringify(data.characters));
    });
  };

  const handleNewProject = () => {
    setNodes(defaultNodes);
    setEdges([]);
    setMaps([]);
    setCharacters([narrator]);
    setWindows(["Flowchart", "Mapa"]);
    changeDisplayedWindow("Flowchart");
    setProjectTitle("Adicone um título ao projeto");
    localStorage.setItem("edges", JSON.stringify([]));
    localStorage.setItem("nodes", JSON.stringify(defaultNodes));
    localStorage.setItem("maps", JSON.stringify([]));
    localStorage.removeItem("storyId");
    localStorage.setItem("projectTitle", "Adicone um título ao projeto");
    localStorage.setItem("characters", JSON.stringify([narrator]));
  };

  const handleSaveLocal = () => {
    //write NODES and EDGES to file
    //write NODES and EDGES to file
    const file = new Blob(
      [
        JSON.stringify({
          projectTitle: projectTitle,
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

  const handleSaveServer = () => {
    //write NODES and EDGES to file

    repo
      .saveProject(projectTitle, nodes, edges, characters, mapsState)
      .then((data) => {
        setDisplayAlert(true);
        setAlertMessage("Projeto salvo com sucesso!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addNode = (nodeType, nodeProps) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: 0, y: 0 },
      data: generateInspectorProps(nodeProps),
      type: nodeType,
    };

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

  const changeOneNode = (nodeId, newData) => {
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
    console.log("add dialogue node", nodeType, "to", dialogueNodeId);
    const newNode = {
      id: (dialogNodes.length + 1).toString(),
      position: { x: 0, y: 0 },
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
                        changeDisplayedWindow("Flowchart");
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

        {displayedWindow === "Flowchart" ? (
          <Flow
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

      <Alert
        sx={{
          display: displayAlert ? "flex" : "none",
          backgroundColor: primaryColor,
          zIndex: 1000,
          color: textColor,
          position: "fixed",
          width: "90%",
          bottom: "3%",
          left: "5%",
          m: 2,
          p: 0.3,
          borderRadius: 3,
          fontSize: "15px",
          ".MuiAlert-icon": {
            color: textColor,
          },
          ".MuiAlert-action": {
            color: textColor,
            fontSize: "20px",
            mr: 1,
          },
        }}
        onClose={() => {
          setDisplayAlert(false);
        }}
      >
        {alertMessage}
      </Alert>
    </>
  );
}
