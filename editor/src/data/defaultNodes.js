import { EndDialogProps } from "../flowchart/nodes/nodeProps";
import { NodeType } from "../models/NodeTypes";
import { generateInspectorProps } from "./utils";

export const defaultNodes = [
  {
    id: "0",
    position: { x: 0, y: 0 },
    data: undefined,
    type: NodeType.beginNode,
  },
  {
    id: "5",
    position: { x: 400, y: 100 },
    data: generateInspectorProps(EndDialogProps),
    type: NodeType.endNode,
  },
];
