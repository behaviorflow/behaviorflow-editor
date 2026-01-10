import React, { useCallback, useEffect } from "react";
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
  NodeToolbar,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BehaviorFlowNodeData } from "../nodes/BehaviorFlowNode";
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import StartNode from "../nodes/StartNode";
import { BfNodeTypeAttributes } from "../../types";
import { ReactFlowNodeTypes, NodeColors } from "../../constants";
import { useNodeTypesContext } from "../../contexts";
import "./react-flow.css";

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
}

export default function ReactFlowContent({
  initialNodes,
  initialEdges,
  showMiniMap,
  generateReactNode,
  onGraphUpdate,
}: ReactFlowComponentProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Call onGraphUpdate whenever nodes or edges change
  useEffect(() => {
    onGraphUpdate(nodes, edges);
  }, [nodes, edges, onGraphUpdate]);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((edges) => {
        // Remove any previous edge from the same source handle (to enforce single connection per out port)
        const edgesWithPrevRemoved = edges.filter(
          (edge) => !(edge.source === connection.source && edge.sourceHandle === connection.sourceHandle)
        );
        return addEdge(connection, edgesWithPrevRemoved);
      }),
    [setEdges]
  );

  const insertNode = useCallback(
    (nodeData: any, position: { x: number; y: number }) => {
      const newNode = generateReactNode(nodeData, position);
      setNodes((nds) => [...nds, newNode as any]);
    },
    [generateReactNode, setNodes]
  );

  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

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

  const deleteKeyCode = ["Backspace", "Delete"];

  const { getNodeTypeById } = useNodeTypesContext();

  return (
    <div className="react-flow-component">
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
        fitView>
        <Controls />
        {showMiniMap && <MiniMap pannable zoomable nodeColor={(node) => minimapNodeColor(node, getNodeTypeById)} nodeStrokeColor={minimapNodeStrokeColor} nodeStrokeWidth={4} />}{" "}
        {/* Todo: Add props to customize MiniMap */}
        <Background color="#666666" variant={BackgroundVariant.Dots} gap={15} size={1} />
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
      return "#6b6b6bff";
    }
    case ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE:
      return NodeColors.StartNodeColor;
    default:
      return "#6b6b6bff";
  }
}

function minimapNodeStrokeColor(node: Node) {
  if (node.selected) {
    return "rgb(255, 227, 100)";
  }
  return "transparent";
}