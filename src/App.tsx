import React, { useCallback, useState } from "react";
import { Edge as ReactFlowEdge, Node as ReactFlowNode, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings from "./components/BehaviorFlowSettings/BehaviorFlowSettings";
import ReactFlowComponent from "./components/ReactFlow/ReactFlowComponent";
import { BfNodeTypeAttributes, BfNodeTypeCategory } from "./types";
import { NodeTypesProvider } from "./contexts";

import { v4 as uuid } from "uuid";

import useLocalStorage from "use-local-storage";

import "./App.css";

import { Menu, Workflow, Settings } from "lucide-react";

const initialNodes: ReactFlowNode[] = [
  {
    id: "start",
    type: "startNode",
    position: { x: 0, y: 0 },
    draggable: false,
    data: {},
  },
];

const initialEdges: ReactFlowEdge[] = [];

const initialBfNodeTypes: BfNodeTypeAttributes[] = [
  {
    typeId: "Success",
    inParams: [],
    outParams: [],
    outPorts: [],
    isReadOnly: true,
    category: BfNodeTypeCategory.Success,
  },
  {
    typeId: "Failure",
    inParams: [],
    outParams: [],
    outPorts: [],
    isReadOnly: true,
    category: BfNodeTypeCategory.Failure,
  },
];

function AppContent() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
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
      content: <NodePalette />,
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

  const generateReactNode = useCallback(
    (nodeTypeId: string, position: { x: number; y: number }): ReactFlowNode => {
      const nodeId = nodeTypeId + "-" + uuid();
      return {
        id: nodeId,
        type: "behaviorFlowNode",
        position,
        draggable: true,
        data: {
          nodeAttributes: {
            nodeId: nodeId,
            nodeTypeId: nodeTypeId,
          },
          // No longer storing nodeTypeAttributes - BehaviorFlowNode will look it up from context
        },
      };
    },
    []
  );

  return (
    <div className="app" data-theme={theme}>
      <div className="activity-bar-container">
        <ActivityBar activityBarItems={activityBarItems} />
      </div>
      <div className="react-flow-container">
        <ReactFlowComponent
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          showMiniMap={showMiniMap}
          generateReactNode={generateReactNode}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NodeTypesProvider initialNodeTypes={initialBfNodeTypes}>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </NodeTypesProvider>
  );
}
