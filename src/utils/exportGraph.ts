import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import { BfNodeTypeAttributes } from "../types";
import { ReactFlowNodeTypes, NodeTypeIds } from "../constants";
import { SIMPLE_NODE_HANDLE_ID } from "../constants";

// JSON format types
interface ExportedNodeType {
  node_type_id: string;
  result_ids: string[];
}

interface ExportedNode {
  node_id: string;
  node_type: string;
  transitions: Record<string, string>;
}

interface ExportedGraph {
  node_types: ExportedNodeType[];
  nodes: ExportedNode[];
  start_node_id: string | null;
}

function exportNodeType(nodeType: BfNodeTypeAttributes): ExportedNodeType {
  return {
    node_type_id: nodeType.typeId,
    result_ids: nodeType.outPorts,
  };
}

function isStartNode(node: ReactFlowNode): boolean {
  return (
    // todo: revisit
    node.type === ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE || node.id === NodeTypeIds.START_NODE_TYPE_ID
  );
}

function findStartNodeId(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string | null {
  const startNode = nodes.find(
    (node) => isStartNode(node)
  );
  if (!startNode) {
    return null;
  }
  const startEdge = edges.find((edge) => edge.source === startNode.id);
  return startEdge ? startEdge.target : null;
}

function buildTransitions(nodeId: string, edges: ReactFlowEdge[]): Record<string, string> {
  const transitions: Record<string, string> = {};
  // Find all edges originating from this node
  const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
  for (const edge of outgoingEdges) {
    if (!edge.sourceHandle) {
      console.warn(`Edge from node ${nodeId} is missing sourceHandle, cannot determine transition port.`);
      continue;
    }
    if (edge.sourceHandle === SIMPLE_NODE_HANDLE_ID) {
      transitions[""] = edge.target;
      continue;
    }
    transitions[edge.sourceHandle] = edge.target;
  }
  return transitions;
}

function exportNode(node: ReactFlowNode, edges: ReactFlowEdge[]): ExportedNode | null {
  if (isStartNode(node)) {
    return null;
  }
  const nodeData = node.data as { nodeAttributes?: { nodeId: string; nodeTypeId: string } };
  const nodeAttributes = nodeData?.nodeAttributes;
  if (!nodeAttributes) {
    console.warn(`Node ${node.id} has no nodeAttributes`);
    return null;
  }
  const transitions = buildTransitions(node.id, edges);
  if (transitions === null) {
    console.warn(
      `Skipping export of node ${node.id} (${nodeAttributes.nodeId}) because transitions are missing or invalid.`
    );
    return null;
  }

  return {
    node_id: nodeAttributes.nodeId,
    node_type: nodeAttributes.nodeTypeId,
    transitions,
  };
}

function exportGraph(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>
): ExportedGraph {
  const exportedNodeTypes: ExportedNodeType[] = Array.from(nodeTypes.values()).map(exportNodeType);
  const exportedNodes: ExportedNode[] = nodes
    .map((node) => exportNode(node, edges))
    .filter((node): node is ExportedNode => node !== null);
  const startNodeId = findStartNodeId(nodes, edges);
  return {
    node_types: exportedNodeTypes,
    nodes: exportedNodes,
    start_node_id: startNodeId,
  };
}

/**
 * Exports the graph and downloads it as a JSON file
 */
export function exportGraphAsJson(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
  filename: string = "behavior-flow-graph.json"
): void {
  const exportedGraph = exportGraph(nodes, edges, nodeTypes);
  const jsonGraph = JSON.stringify(exportedGraph, null, 2);

  const blob = new Blob([jsonGraph], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
