import React, { useCallback, useState } from "react";
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
import SuccessNode from "./components/nodes/SuccessNode";
import FailureNode from "./components/nodes/FailureNode";
import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings from "./components/BehaviorFlowSettings/BehaviorFlowSettings";

import { NodeParam, BfNodeAttributes, BfNodeTypeAttributes } from "./types";
import { useNodeTypes } from "./hooks";

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
      nodeType: {
        typeId: "Move to Position",
        inParams: [{ paramName: "Target Pose" }, { paramName: "Speed" }],
        outParams: [{ paramName: "Recovery Count" }],
        outPorts: ["Success", "Failure"],
      },
    },
  },
  {
    id: "failure",
    type: "failureNode",
    position: { x: 400, y: 20 },
    data: {
      label: "Failure",
    },
  },
  {
    id: "success",
    type: "successNode",
    position: { x: 400, y: -50 },
    data: {
      label: "Success",
    },
  },
];
const nodeTypes = {
  behaviorFlowNode: BehaviorFlowNode,
  startNode: StartNode,
  successNode: SuccessNode,
  failureNode: FailureNode,
};

const initialEdges: Edge[] = [];

interface FlowContentProps {
  initialBfNodeTypes: BfNodeTypeAttributes[];
}

function FlowContent({ initialBfNodeTypes }: FlowContentProps) {
  const { addNodeType, deleteNodeType, editNodeType, getOrderedNodeTypes, getNodeTypeById, hasNodeType } =
    useNodeTypes(initialBfNodeTypes);

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((edges) => {
        const newEdge = addEdge(connection, edges);
        // Add style to each new edge
        if (Array.isArray(newEdge)) {
          return newEdge.map((edge) => ({
            ...edge,
          }));
        }
        return newEdge;
      }),
    [setEdges]
  );

  const insertNode = useCallback(
    (nodeTypeId: string, position: { x: number; y: number }) => {
      const nodeId = nodeTypeId + "-" + uuid();
      const newNode = {
        id: nodeId,
        type: "behaviorFlowNode", // revisit if needed
        position,
        draggable: true,
        data: {
          nodeAttributes: {
            nodeId: nodeId,
            nodeTypeId: nodeTypeId,
          },
          getNodeTypeById,
        },
      };
      setNodes((nds) => [...nds, newNode as any]);
    },
    [setNodes, getNodeTypeById]
  );

  const { screenToFlowPosition } = useReactFlow();

  // useCallback?
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  // useCallback?
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");

    if (data) {
      try {
        const node = JSON.parse(data);
        if (node) {
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });

          insertNode(node, position);
        }
      } catch (e) {
        console.error("Exception on drop:", e);
      }
    }
  };

  const [showMiniMap, setShowMiniMap] = useLocalStorage("showMiniMap", true);
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
      content: (
        <NodePalette
          getOrderedNodeTypes={getOrderedNodeTypes}
          addNodeType={addNodeType}
          deleteNodeType={deleteNodeType}
          editNodeType={editNodeType}
        />
      ),
    },
    {
      itemName: "Settings",
      nameDisplay: "Settings",
      symbol: <Settings />,
      content: (
        <BehaviorFlowSettings
          setTheme={setTheme}
          themeStatus={theme}
          setShowMiniMap={setShowMiniMap}
          showMiniMapStatus={showMiniMap}
        />
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
          {showMiniMap && <MiniMap pannable zoomable nodeColor={nodeColor} />}{" "}
          {/* Todo: Add props to customize MiniMap */}
          <Background color="#666666" variant={BackgroundVariant.Dots} gap={15} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

function nodeColor(node: { type?: string }) {
  switch (node.type) {
    case "behaviorFlowNode":
      return "#7c36e5ff";
    case "startNode":
      return "#6ed5deff";
    case "successNode":
      return "#6ede87";
    case "failureNode":
      return "#d64c4c";
    default:
      return "#6b6b6bff";
  }
}

export default function App() {
  const initialBfNodeTypes: BfNodeTypeAttributes[] = [
    {
      typeId: "Do Thing",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
    {
      typeId: "Check Thing",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
    {
      typeId: "Move to Charger",
      inParams: [],
      outParams: [],
      outPorts: ["Success", "Fail"],
    },
  ];

  return (
    <ReactFlowProvider>
      <FlowContent initialBfNodeTypes={initialBfNodeTypes} />
    </ReactFlowProvider>
  );
}
