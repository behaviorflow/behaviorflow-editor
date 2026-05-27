import React, { useCallback, useState } from "react";
import { Edge as ReactFlowEdge, Node as ReactFlowNode, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import "./components/nodes/behavior-flow-node.css";

import ActivityBar from "./components/ui/ActivityBar/ActivityBar";
import BehaviorFlowMenu from "./components/BehaviorFlowMenu/BehaviorFlowMenu";
import NodePalette from "./components/NodePalette/NodePalette";
import BehaviorFlowSettings, { ToggleSwitchConfig } from "./components/BehaviorFlowSettings/BehaviorFlowSettings";
import ReactFlowComponent from "./components/ReactFlow/ReactFlowComponent";
import { NodeTypesProvider, useNodeTypesContext } from "./contexts";
import { exportGraphAsJsonFile } from "./utils";
import { NodeTypeIds, ReactFlowNodeTypes, SIMPLE_NODE_HANDLE_ID, StandardLibraryNodeTypes } from "./constants";
import { isStartNode } from "./utils/nodeIdentity";

import useLocalStorage from "use-local-storage";

import "./App.css";

import { Menu, Workflow, Settings } from "lucide-react";
import NodeIdManager from "./utils/NodeIdManager";
import { SettingsProvider } from "./contexts/SettingsContext";

import ExportGraphModal from "./components/ExportGraphModal/ExportGraphModal";
import ImportGraphModal from "./components/ImportGraphModal/ImportGraphModal";

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

const nodeIdManager = new NodeIdManager();

function AppContent() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const [showMiniMap, setShowMiniMap] = useLocalStorage("showMiniMap", true);
  const [showNodeIds, setShowNodeIds] = useLocalStorage("showNodeIds", false);
  const { nodeTypes, replaceNodeTypes, hasUserDefinedNodeTypes } = useNodeTypesContext();
  // This is the actual current graph data
  const [graphData, setGraphData] = React.useState<{ nodes: ReactFlowNode[]; edges: ReactFlowEdge[] }>({
    nodes: initialNodes,
    edges: initialEdges,
  });
  // This is a mechanism to request to override the current graph
  const [importedGraphOverride, setImportedGraphOverride] = React.useState<{
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
  } | null>(null);

  const handleGraphUpdate = React.useCallback((nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
    setGraphData({ nodes, edges });
  }, []);

  const [isExportFileSelectModalOpen, setIsExportFileSelectModalOpen] = useState(false);
  const [isImportFileSelectModalOpen, setIsImportFileSelectModalOpen] = useState(false);
  const menuItems = [
    {
      label: "Export as JSON",
      onClick: () => {
        setIsExportFileSelectModalOpen(true);
      },
      children: (
        <ExportGraphModal
          isOpen={isExportFileSelectModalOpen}
          onClose={() => setIsExportFileSelectModalOpen(false)}
          onExportGraph={(fileName: string) => {
            if (!graphData.nodes || !graphData.edges) {
              console.warn("Graph data not available");
              return { success: false, errors: ["Graph data not available"] };
            }
            return exportGraphAsJsonFile(graphData.nodes, graphData.edges, nodeTypes, false, fileName);
          }}
        />
      ),
    },
    {
      label: "Import from JSON",
      onClick: () => {
        setIsImportFileSelectModalOpen(true);
      },
      children: (() => {
        const userDefinedNodes = graphData.nodes.filter((node) => !isStartNode(node));
        const promptConfirmation = hasUserDefinedNodeTypes() || userDefinedNodes.length > 0; // todo: if the node types or nodes have changed since the most recent successful import
        return (
          <ImportGraphModal
            isOpen={isImportFileSelectModalOpen}
            onClose={() => setIsImportFileSelectModalOpen(false)}
            updateGraph={(nodes, edges, start_node_id, nodeTypes) => {
              const nt_result = replaceNodeTypes(nodeTypes);
              if (nt_result.success) {
                const startEdge = {
                  id: `starting-edge-from:${start_node_id}`,
                  source: NodeTypeIds.START_NODE_TYPE_ID,
                  target: start_node_id,
                };
                setImportedGraphOverride({ nodes: [...initialNodes, ...nodes], edges: [startEdge, ...edges] });
              }
              return nt_result;
            }}
            promptConfirmation={promptConfirmation}
          />
        );
      })(),
    },
  ];

  const settingsToggles: ToggleSwitchConfig[] = [
    {
      label: "Dark Mode",
      isOn: theme === "dark",
      onChange: (checked) => setTheme(checked ? "dark" : "light"),
    },
    {
      label: "Show Node IDs",
      isOn: showNodeIds,
      onChange: (checked) => setShowNodeIds(checked),
    },
    {
      label: "Show Mini Map",
      isOn: showMiniMap,
      onChange: (checked) => setShowMiniMap(checked),
    },
  ];

  const activityBarItems = [
    {
      itemName: "Menu",
      nameDisplay: "Menu",
      icon: <Menu />,
      content: <BehaviorFlowMenu menuItems={menuItems} />,
    },
    {
      itemName: "Node Palette",
      nameDisplay: "Nodes",
      icon: <Workflow />,
      content: <NodePalette />,
    },
    {
      itemName: "Settings",
      nameDisplay: "Settings",
      icon: <Settings />,
      content: <BehaviorFlowSettings toggles={settingsToggles} />,
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
      },
    };
  }, []);

  return (
    <div className="app" data-theme={theme}>
      <SettingsProvider value={{ showNodeIds }}>
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
            graphOverride={importedGraphOverride}
          />
        </div>
      </SettingsProvider>
    </div>
  );
}

export default function App() {
  return (
    <NodeTypesProvider initialNodeTypes={StandardLibraryNodeTypes}>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </NodeTypesProvider>
  );
}
