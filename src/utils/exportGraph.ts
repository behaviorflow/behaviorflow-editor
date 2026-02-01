import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import { downloadFile } from "./downloadFile";
import { BfNodeTypeAttributes } from "../types";
import { ReactFlowNodeTypes } from "../constants";
import { SIMPLE_NODE_HANDLE_ID } from "../constants";
import { GraphNodeTypeDTO, GraphNodeDTO, GraphDTO } from "./graphDtos";

function toGraphNodeTypeDTO(nodeType: BfNodeTypeAttributes): GraphNodeTypeDTO {
  return {
    node_type_id: nodeType.typeId,
    result_ids: nodeType.outPorts,
  };
}

function isStartNode(node: ReactFlowNode): boolean {
  return node.type === ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE;
}

function findStartNodeId(nodes: ReactFlowNode[], edges: ReactFlowEdge[]): string | null {
  const startNode = nodes.find((node) => isStartNode(node));
  if (!startNode) {
    return null;
  }
  const startEdge = edges.find((edge) => edge.source === startNode.id);
  return startEdge ? startEdge.target : null;
}

function buildTransitions(nodeId: string, edges: ReactFlowEdge[], expectedHandleIds: string[]): Record<string, string> {
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
  const missing = expectedHandleIds.filter((port) => !Object.keys(transitions).includes(port));
  const extra = Object.keys(transitions).filter((key) => !expectedHandleIds.includes(key));
  if (missing.length > 0) {
    console.warn(`Not all handles of node ${nodeId} have corresponding edges.`);
  }
  if (extra.length > 0) {
    console.warn(`Node ${nodeId} has edges from unknown handles: ${extra.join(", ")}`);
  }
  return transitions;
}

function toGraphNodeDTO(
  node: ReactFlowNode,
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
): GraphNodeDTO | null {
  if (isStartNode(node)) {
    return null;
  }
  const nodeData = node.data as { nodeAttributes?: { nodeId: string; nodeTypeId: string } };
  const nodeAttributes = nodeData?.nodeAttributes;
  if (!nodeAttributes) {
    console.warn(`Node ${node.id} has no nodeAttributes`);
    return null;
  }
  const nodeTypeAttributes = nodeTypes.get(nodeAttributes.nodeTypeId);
  if (!nodeTypeAttributes) {
    console.warn(
      `Skipping export of node ${node.id} (${nodeAttributes.nodeId}) because node type ${nodeAttributes.nodeTypeId} is unknown.`,
    );
    return null;
  }

  const transitions = buildTransitions(node.id, edges, nodeTypeAttributes.outPorts);

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

function toGraphDTO(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
): GraphDTO {
  const nodeTypesDTO: GraphNodeTypeDTO[] = Array.from(nodeTypes.values()).map(toGraphNodeTypeDTO);
  const startNodeId = findStartNodeId(nodes, edges);
  const orderedNodes = bfsOrderNodes(nodes, edges, startNodeId);

  const nodeDTOs: GraphNodeDTO[] = orderedNodes
    .map((node) => toGraphNodeDTO(node, edges, nodeTypes))
    .filter((node): node is GraphNodeDTO => node !== null);

  return {
    node_types: nodeTypesDTO,
    nodes: nodeDTOs,
    start_node_id: startNodeId,
  };
}

/**
 * Exports the graph and downloads it as a JSON file
 */
export function exportGraphAsJsonFile(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
  filename: string = "behavior-flow-graph.json",
): void {
  const graphDTO = toGraphDTO(nodes, edges, nodeTypes);
  const jsonGraph = JSON.stringify(graphDTO, null, 2);
  downloadFile(jsonGraph, filename, "application/json");
}
