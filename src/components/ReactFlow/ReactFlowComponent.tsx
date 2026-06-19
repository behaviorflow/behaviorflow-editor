import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  Connection,
  useReactFlow,
  useKeyPress,
  BackgroundVariant,
  useNodesInitialized,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BehaviorFlowNodeData } from "../nodes/BehaviorFlowNode";
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import StartNode from "../nodes/StartNode";
import { BfNodeTypeAttributes, BfNodeTypeCategory } from "../../types";
import { ReactFlowNodeTypes, NodeColors } from "../../constants";
import { useNodeTypesContext } from "../../contexts";
import "./react-flow.css";
import { getLayoutedElements } from "./elkLayout";

const SNAP_KEY = "Shift";
const MULTI_SELECT_KEY = "Control";
const GRID_SIZE = 15;

const reactFlowNodeTypes = {
  behaviorFlowNode: BehaviorFlowNode,
  startNode: StartNode, //todo: consider replacing with BehaviorFlowNode
};

export interface ReactFlowComponentProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  showMiniMap: boolean;
  generateReactNode: (nodeData: any, position: { x: number; y: number }) => Node;
  onGraphUpdate: (nodes: Node[], edges: Edge[]) => void;
  graphOverride?: { nodes: Node[]; edges: Edge[] } | null;
}

export default function ReactFlowContent({
  initialNodes,
  initialEdges,
  showMiniMap,
  generateReactNode,
  onGraphUpdate,
  graphOverride,
}: ReactFlowComponentProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const isSnapping = useKeyPress(SNAP_KEY);
  const nodesInitialized = useNodesInitialized();
  const needsLayoutRef = useRef(false);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const { getNodeTypeById } = useNodeTypesContext();

  const runLayout = useCallback(async () => {
    const { nodes: ln, edges: le } = await getLayoutedElements(
      nodesRef.current,
      edgesRef.current,
      getNodeTypeById,
    );
    setNodes(ln);
    setEdges(le);
  }, [setNodes, setEdges, getNodeTypeById]);

  useEffect(() => {
    // Wait until 1) needsLayout flag is set to true, and 2) nodes are initialized (meaning node dimension are meausred) before running layout.
    if (!nodesInitialized || !needsLayoutRef.current) return;
    needsLayoutRef.current = false;
    runLayout();
  }, [nodesInitialized, runLayout]);

  useEffect(() => {
    if (!graphOverride) return;
    needsLayoutRef.current = true;
    setNodes(graphOverride.nodes);
    setEdges(graphOverride.edges);
  }, [graphOverride, setNodes, setEdges]);

  // Call onGraphUpdate whenever nodes or edges change to propagate graph changes upward
  useEffect(() => {
    onGraphUpdate(nodes, edges);
  }, [nodes, edges, onGraphUpdate]);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      const newEdge = { ...connection, type: "default" };
      setEdges((edges) => {
        // Enforce single connection per out-port handle.
        const edgesWithPrevRemoved = edges.filter(
          (edge) => !(edge.source === connection.source && edge.sourceHandle === connection.sourceHandle),
        );
        return addEdge(newEdge, edgesWithPrevRemoved);
      });
    },
    [setEdges],
  );

  const insertNode = useCallback(
    (nodeData: any, position: { x: number; y: number }) => {
      const newNode = generateReactNode(nodeData, position);
      setNodes((nds) => [...nds, newNode as any]);
    },
    [generateReactNode, setNodes],
  );

  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;
    try {
      const node = JSON.parse(data);
      if (node) {
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        insertNode(node, position);
      }
    } catch (e) {
      console.error("Exception on drop:", e);
    }
  };

  const deleteKeyCode = ["Backspace", "Delete"];

  return (
    <div className="react-flow-component">
      <button onClick={runLayout}>Auto Layout</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={reactFlowNodeTypes}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        deleteKeyCode={deleteKeyCode}
        selectionKeyCode={MULTI_SELECT_KEY}
        multiSelectionKeyCode={MULTI_SELECT_KEY}
        snapToGrid={isSnapping}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        fitView>
        <Controls />
        {showMiniMap && (
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) => minimapNodeColor(node, getNodeTypeById)}
            nodeStrokeColor={minimapNodeStrokeColor}
            nodeStrokeWidth={4}
          />
        )}
        <Background color="#666666" variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
      </ReactFlow>
    </div>
  );
}

function minimapNodeColor(node: Node, getNodeTypeById: (id: string) => BfNodeTypeAttributes | undefined) {
  switch (node.type) {
    case ReactFlowNodeTypes.BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE: {
      const nodeData = node.data as BehaviorFlowNodeData;
      const nodeType = getNodeTypeById(nodeData?.nodeAttributes?.nodeTypeId || "");
      const category = nodeType?.category as keyof typeof NodeColors.BfNodeCategoryColors;
      if (category && category in NodeColors.BfNodeCategoryColors) {
        return NodeColors.BfNodeCategoryColors[category];
      }
      console.warn(`[Node ${node.id}] Unknown category for minimap color: ${category}`);
      return NodeColors.BfNodeCategoryColors[BfNodeTypeCategory.Process];
    }
    case ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE:
      return NodeColors.StartNodeColor;
    default:
      console.warn(`[Node ${node.id}] Unknown node type for minimap color: ${node.type}`);
      return NodeColors.BfNodeCategoryColors[BfNodeTypeCategory.Process];
  }
}

function minimapNodeStrokeColor(node: Node) {
  return node.selected ? "rgb(255, 227, 100)" : "transparent";
}
