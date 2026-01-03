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
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import StartNode from "../nodes/StartNode";
import { BfNodeTypeAttributes } from "../../types";
import { ReactFlowNodeTypes } from "../../constants";
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

function ReactFlowContent({
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
        {showMiniMap && <MiniMap pannable zoomable nodeColor={minimapNodeColor} />}{" "}
        {/* Todo: Add props to customize MiniMap */}
        <Background color="#666666" variant={BackgroundVariant.Dots} gap={15} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function ReactFlowComponent(props: ReactFlowComponentProps) {
  return <ReactFlowContent {...props} />;
}

function minimapNodeColor(node: { type?: string }) {
  // Maybe eventually just nodeColor
  switch (node.type) {
    case ReactFlowNodeTypes.BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE:
      return "#7c36e5ff";
    case ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE:
      return "#6ed5deff";
    case "successNode":
      return "#6ede87";
    case "failureNode":
      return "#d64c4c";
    default:
      return "#6b6b6bff";
  }
}
