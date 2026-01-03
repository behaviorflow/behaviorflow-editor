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
  const startNode = nodes.find((node) => isStartNode(node));
  if (!startNode) {
    return null;
  }
  const startEdge = edges.find((edge) => edge.source === startNode.id);
  return startEdge ? startEdge.target : null;
}

function buildTransitions(
  nodeId: string,
  edges: ReactFlowEdge[],
): Record<string, string> {
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

function exportNode(
  node: ReactFlowNode,
  edges: ReactFlowEdge[],
): ExportedNode | null {
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

function bfsOrderNodes(nodes: ReactFlowNode[], edges: ReactFlowEdge[], startNodeId: string | null): ReactFlowNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();
  const orderedNodes: ReactFlowNode[] = [];
  const queue: string[] = [];

  if (startNodeId && nodeMap.has(startNodeId)) {
    queue.push(startNodeId);
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    const node = nodeMap.get(currentId);
    if (node && !isStartNode(node)) {
      orderedNodes.push(node);
    }
    // Enqueue all targets of outgoing edges
    const outgoing = edges.filter((e) => e.source === currentId);
    for (const edge of outgoing) {
      if (!visited.has(edge.target) && nodeMap.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  // Log and exclude any nodes not reached by BFS (disconnected)
  for (const node of nodes) {
    if (!isStartNode(node) && !visited.has(node.id)) {
      console.error(`Node ${node.id} is disconnected and will not be included in the exported graph.`);
    }
  }

  return orderedNodes;
}

function exportGraph(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>
): ExportedGraph {
  const exportedNodeTypes: ExportedNodeType[] = Array.from(nodeTypes.values()).map(exportNodeType);
  const startNodeId = findStartNodeId(nodes, edges);
  const orderedNodes = bfsOrderNodes(nodes, edges, startNodeId);

  const exportedNodes: ExportedNode[] = orderedNodes
    .map((node) => exportNode(node, edges))
    .filter((node): node is ExportedNode => node !== null);

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
