import * as React from "react";
import Box from "@mui/material/Box";
import Flow from "../flowchart/Flow";
import { Typography } from "@mui/material";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
} from "../themes";
import { NodeType } from "../models/NodeTypes";
import {
  ImageProps,
  QuizProps,
  ThreeDModelProps,
  VideoProps,
} from "../flowchart/nodes/nodeProps";
import TopAppBar from "./AppBar";

const generateInspectorProps = (props) => {
  return props.fields.reduce(
    (obj, field) => ({ ...obj, [field.name]: field.initialValue }),
    {}
  );
};

const defaultNodes = [
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
];

const initialNodes = JSON.parse(
  localStorage.getItem("nodes") || JSON.stringify(defaultNodes)
);
const initialEdges = JSON.parse(localStorage.getItem("edges") || "[]");

export default function MainWindow(props) {
  const [windows, setWindows] = React.useState(["Flowchart", "Mapa"]);
  const [displayedWindow, changeDisplayedWindow] = React.useState("Flowchart");
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);
  const [projectTitle, setProjectTitle] = React.useState(
    localStorage.getItem("projectTitle") || "Projeto Exemplo"
  );

  const handleLoad = () => {
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
        setProjectTitle(data.projectTitle);
        localStorage.setItem("edges", JSON.stringify(data.edges));
        localStorage.setItem("nodes", JSON.stringify(data.nodes));
        localStorage.setItem("projectTitle", data.projectTitle);
      };
      reader.readAsText(file);
    };
  };

  const handleSave = () => {
    //write NODES and EDGES to file
    const file = new Blob(
      [
        JSON.stringify({
          projectTitle: projectTitle,
          nodes: nodes,
          edges: edges,
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
  return (
    <>
      <TopAppBar
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        currentWindow={displayedWindow}
        addNode={addNode}
        handleSave={handleSave}
        handleLoad={handleLoad}
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
                    m: 0,
                    borderBottomWidth: displayedWindow === window ? 0 : 3,
                  }}
                  onClick={() => changeDisplayedWindow(window)}
                >
                  <Typography
                    variant="h7"
                    component="div"
                    sx={{ flexGrow: 1, py: 1, px: 2, color: textColor, m: 0 }}
                  >
                    {window}
                  </Typography>
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
            key={"flowchart"}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
          >
            {" "}
          </Flow>
        ) : (
          <div>Not implemented yet</div>
        )}
      </Box>
    </>
  );
}
