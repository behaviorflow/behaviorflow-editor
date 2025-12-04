import React, { useCallback, useState } from "react";
import {
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings from "./components/BehaviorFlowSettings/BehaviorFlowSettings";
import ReactFlowComponent from "./components/ReactFlow/ReactFlowComponent";
import { NodeParam, BfNodeAttributes, BfNodeTypeAttributes } from "./types";
import { useNodeTypes } from "./hooks";

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

const initialEdges: ReactFlowEdge[] = [];

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

export default function App() {
  const { addNodeType, deleteNodeType, editNodeType, getOrderedNodeTypes, getNodeTypeById, hasNodeType } =
    useNodeTypes(initialBfNodeTypes);

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

  const generateReactNode = useCallback(
    (nodeTypeId: string, position: { x: number; y: number }): ReactFlowNode => {
      const nodeId = nodeTypeId + "-" + uuid();
      return {
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
    },
    [getNodeTypeById]
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
