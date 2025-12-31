import React, { useCallback, useState } from "react";
import { Edge as ReactFlowEdge, Node as ReactFlowNode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings from "./components/BehaviorFlowSettings/BehaviorFlowSettings";
import ReactFlowComponent from "./components/ReactFlow/ReactFlowComponent";
import { NodeParam, BfNodeAttributes, BfNodeTypeAttributes, BfNodeTypeCategory } from "./types";
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

export default function App() {
  const { addNodeType, deleteNodeType, getOrderedNodeTypes, getNodeTypeById } =
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
        type: "behaviorFlowNode",
        position,
        draggable: true,
        data: {
          nodeAttributes: {
            nodeId: nodeId,
            nodeTypeId: nodeTypeId,
          },
          nodeTypeAttributes: getNodeTypeById(nodeTypeId),
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
