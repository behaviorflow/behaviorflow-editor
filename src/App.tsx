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

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";

import { NodeParam, BfNodeAttributes } from "./types";

import { v4 as uuid } from "uuid";

import useLocalStorage from "use-local-storage";

import "./App.css";

import { Menu, Workflow, Settings } from "lucide-react";

const initialNodes = [
  {
    id: "start",
    type: "startNode",
    position: { x: 0, y: 0 },
    draggable: false,
    data: {},
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

const initialEdges: Edge[] = [];

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
      setEdges((edges) => {
        const newEdge = addEdge(connection, edges);
        // Add style to each new edge
        if (Array.isArray(newEdge)) {
          return newEdge.map(edge => ({
            ...edge,
          }));
        }
        return newEdge;
      }),
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

  const activityBarItems = [
    {
      itemName: "Menu",
      nameDisplay: "Menu",
      symbol: <Menu />,
      content: <BehaviorFlowMenu />,
    },
    {
      itemName: "Node Palette",
      nameDisplay: "Nodes",
      symbol: <Workflow />,
      content: <NodePalette nodes={nodeAttributes} />,
    },
    {
      itemName: "Settings",
      nameDisplay: "Settings",
      symbol: <Settings />,
      content: (
        <div>
          <button onClick={switchTheme}>
            {/* Temporary */}
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
            {/* todo: fix, so that this item is aware of change, or make drop down */}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="app" data-theme={theme}>
      <div className="activity-bar-container">
        <ActivityBar activityBarItems={activityBarItems} />
      </div>
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView>
          <Controls />
          <MiniMap />
          <Background color="#666666" variant={BackgroundVariant.Dots} gap={15} size={1} />
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
