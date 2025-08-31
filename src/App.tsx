import React, { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  useReactFlow,
  NodeToolbar,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import BehaviorFlowNode from "./components/nodes/BehaviorFlowNode";
import StartNode from "./components/nodes/StartNode";
import TerminalNode from "./components/nodes/TerminalNode";
import "./components/nodes/behavior-flow-node.css";

import NodePaletteSidebar from "./components/sidebars/NodePaletteSidebar/NodePaletteSidebar";
import { NodeParam, BfNodeAttributes } from "./types";

import { v4 as uuid } from "uuid";

import useLocalStorage from "use-local-storage";

import "./App.css";

const initialNodes = [
  {
    id: "start",
    type: "startNode",
    position: { x: 0, y: 0 },
    draggable: false,
  },
  {
    id: "node-1",
    type: "behaviorFlowNode",
    position: { x: 100, y: -50 },
    data: {
      nodeId: "Move to Charger",
      nodeType: "Move to Position",
      inParams: [{ paramName: "Target Pose" }, { paramName: "Speed" }],
      outParams: [{ paramName: "Recovery Count" }],
      outPorts: ["Success", "Failure"],
    },
  },
  {
    id: "failure",
    type: "terminalNode",
    position: { x: 400, y: 20 },
    data: {
      label: "Failure",
    },
  },
  {
    id: "success",
    type: "terminalNode",
    position: { x: 400, y: -50 },
    data: {
      label: "Success",
    },
  },
];
const nodeTypes = { behaviorFlowNode: BehaviorFlowNode, startNode: StartNode, terminalNode: TerminalNode };

const connectionLineStyle = {
  stroke: "#00254d",
  strokeWidth: 1.5,
};

const initialEdges = [];

function FlowContent({ nodeAttributes }) {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            style: connectionLineStyle,
          },
          edges
        )
      ),
    [setEdges]
  );

  const insertNode = useCallback(
    (nodeAttributes: BfNodeAttributes, position: { x: number; y: number }) => {
      nodeAttributes.nodeId = nodeAttributes.nodeType + "-" + uuid();
      const newNode = {
        id: nodeAttributes.nodeId,
        type: "behaviorFlowNode", // revisit if needed
        position,
        data: nodeAttributes,
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const { screenToFlowPosition } = useReactFlow();

  // useCallback?
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  // useCallback?
  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");

    if (data) {
      try {
        const nodeAttributes = JSON.parse(data);
        if (nodeAttributes) {
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });

          insertNode(nodeAttributes, position);
        }
      } catch (e) {
        console.error("Exception on drop:", e);
      }
    }
  };

  return (
    <div className="app" data-theme={theme}>
      <div style={{ display: "flex" }}>
        <NodePaletteSidebar nodes={nodeAttributes} />
      </div>
      <div style={{ flex: 1 }}>
        <button onClick={switchTheme}>
          {/* Temporary */}
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
          style={{ backgroundColor: "#cccccc", width: "100%", height: "100%" }}>
          <Controls />
          <MiniMap />
          <Background color="#666666" variant="dots" gap={15} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  const nodeAttributes: BfNodeAttributes[] = [
    {
      nodeId: "",
      nodeType: "Do Thing",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
    {
      nodeId: "",
      nodeType: "Check Thing",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
    {
      nodeId: "",
      nodeType: "Move To Charger",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
  ];

  return (
    <ReactFlowProvider>
      <FlowContent nodeAttributes={nodeAttributes} />
    </ReactFlowProvider>
  );
}
