import React, { useCallback } from "react";
import { Edge as ReactFlowEdge, Node as ReactFlowNode, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings from "./components/BehaviorFlowSettings/BehaviorFlowSettings";
import ReactFlowComponent from "./components/ReactFlow/ReactFlowComponent";
import { BfNodeTypeAttributes, BfNodeTypeCategory } from "./types";
import { NodeTypesProvider, useNodeTypesContext } from "./contexts";
import { exportGraphAsJson } from "./utils";
import { NodeTypeIds, ReactFlowNodeTypes } from "./constants";

import useLocalStorage from "use-local-storage";

import "./App.css";

import { Menu, Workflow, Settings } from "lucide-react";
import NodeIdManager from "./utils/NodeIdManager";

const initialNodes: ReactFlowNode[] = [
  {
    id: NodeTypeIds.START_NODE_TYPE_ID,
    type: ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE,
    position: { x: 0, y: 0 },
    draggable: false,
    deletable: false,
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

const nodeIdManager = new NodeIdManager();

function AppContent() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const [showMiniMap, setShowMiniMap] = useLocalStorage("showMiniMap", true);
  const { nodeTypes } = useNodeTypesContext();
  const [graphData, setGraphData] = React.useState<{ nodes: ReactFlowNode[]; edges: ReactFlowEdge[] }>({
    nodes: initialNodes,
    edges: initialEdges,
  });

  const handleGraphUpdate = React.useCallback((nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
    setGraphData({ nodes, edges });
  }, []);

  const menuItems = [
    {
      label: "Export as JSON",
      onClick: () => {
        if (!graphData.nodes || !graphData.edges) {
          console.warn("Graph data not available");
          return;
        }
        exportGraphAsJson(graphData.nodes, graphData.edges, nodeTypes);
      },
    },
  ];

  const activityBarItems = [
    {
      itemName: "Menu",
      nameDisplay: "Menu",
      symbol: <Menu />,
      content: <BehaviorFlowMenu menuItems={menuItems} />,
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

  const generateReactNode = useCallback((nodeTypeId: string, position: { x: number; y: number }): ReactFlowNode => {
    const nodeId = nodeIdManager.generateNodeId(nodeTypeId);
    return {
      id: nodeId,
      type: ReactFlowNodeTypes.BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE,
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
  }, []);

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
          onGraphUpdate={handleGraphUpdate}
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
