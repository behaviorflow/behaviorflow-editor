import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import { downloadFile } from "./downloadFile";
import { BfNodeTypeAttributes, ResultWithErrorMsgs } from "../types";
import { ReactFlowNodeTypes } from "../constants";
import { isStartNode } from "./nodeIdentity";
import { SIMPLE_NODE_HANDLE_ID } from "../constants";
import { GraphNodeTypeDTO, GraphNodeDTO, GraphDTO } from "./graphDtos";

function toGraphNodeTypeDTO(nodeType: BfNodeTypeAttributes): GraphNodeTypeDTO {
  return {
    node_type_id: nodeType.typeId,
    result_ids: nodeType.resultIds,
  };
}

function findStartNodeId(nodes: ReactFlowNode[], edges: ReactFlowEdge[], errors: string[]): string | null {
  const startNode = nodes.find((node) => isStartNode(node));
  if (!startNode) {
    errors.push("No start node found in the graph.");
    return null;
  }
  const startEdge = edges.find((edge) => edge.source === startNode.id);
  if (!startEdge) {
    errors.push(`Start node has no outgoing edge.`);
    return null;
  }
  return startEdge.target;
}

function buildTransitions(
  nodeId: string,
  edges: ReactFlowEdge[],
  expectedHandleIdsOrdered: string[],
  errors: string[],
): Record<string, string> {
  const transitions: Record<string, string> = {};
  // Find all edges originating from this node
  const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
  for (const edge of outgoingEdges) {
    if (!edge.sourceHandle) {
      errors.push(`Edge from node ${nodeId} is missing sourceHandle, cannot determine transition port.`);
      continue;
    }
    if (edge.sourceHandle === SIMPLE_NODE_HANDLE_ID) {
      transitions[""] = edge.target;
      continue;
    }
    transitions[edge.sourceHandle] = edge.target;
  }
  const missing = expectedHandleIdsOrdered.filter((port) => !Object.keys(transitions).includes(port));
  const extra = Object.keys(transitions).filter((key) => !expectedHandleIdsOrdered.includes(key));
  if (missing.length > 0) {
    errors.push(`Not all output ports of node ${nodeId} have corresponding edges.`);
  }
  if (extra.length > 0) {
    errors.push(`Node ${nodeId} has edges from unknown handles: ${extra.join(", ")}`);
  }
  return transitions;
}

function toGraphNodeDTO(
  node: ReactFlowNode,
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
  errors: string[],
): GraphNodeDTO | null {
  if (isStartNode(node)) {
    return null;
  }
  const nodeData = node.data as { nodeAttributes?: { nodeId: string; nodeTypeId: string } };
  const nodeAttributes = nodeData?.nodeAttributes;
  if (!nodeAttributes) {
    errors.push(`Node ${node.id} has no nodeAttributes`);
    return null;
  }
  const nodeTypeAttributes = nodeTypes.get(nodeAttributes.nodeTypeId);
  if (!nodeTypeAttributes) {
    errors.push(
      `Skipping export of node ${node.id} (${nodeAttributes.nodeId}) because node type ${nodeAttributes.nodeTypeId} is unknown.`,
    );
    return null;
  }

  const transitions = buildTransitions(node.id, edges, nodeTypeAttributes.resultIds, errors);

  return {
    node_id: nodeAttributes.nodeId,
    node_type: nodeAttributes.nodeTypeId,
    transitions,
  };
}

function bfsOrderNodes(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  startNodeId: string | null,
  errors: string[],
): ReactFlowNode[] {
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

  // Collect and exclude any nodes not reached by BFS (disconnected)
  for (const node of nodes) {
    if (!isStartNode(node) && !visited.has(node.id)) {
      errors.push(`Node ${node.id} is not connected to from the main graph.`);
    }
  }

  return orderedNodes;
}

function toGraphDTO(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
): { result: ResultWithErrorMsgs; graph: GraphDTO | null } {
  const errors: string[] = [];
  const nodeTypesDTO: GraphNodeTypeDTO[] = Array.from(nodeTypes.values()).map(toGraphNodeTypeDTO);
  const startNodeId = findStartNodeId(nodes, edges, errors);
  const orderedNodes = bfsOrderNodes(nodes, edges, startNodeId, errors);

  const nodeDTOs: GraphNodeDTO[] = orderedNodes
    .map((node) => toGraphNodeDTO(node, edges, nodeTypes, errors))
    .filter((node): node is GraphNodeDTO => node !== null);

  const graph: GraphDTO = {
    node_types: nodeTypesDTO,
    nodes: nodeDTOs,
    start_node_id: startNodeId,
  };

  return {
    result: {
      success: errors.length === 0,
      errors,
    },
    graph,
  };
}

/**
 * Exports the graph and downloads it as a JSON file
 */
export function exportGraphAsJsonFile(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  nodeTypes: Map<string, BfNodeTypeAttributes>,
  saveInvalidGraph: boolean = false,
  filename: string = "behavior-flow-graph.json",
): ResultWithErrorMsgs {
  const { result, graph } = toGraphDTO(nodes, edges, nodeTypes);
  if (!result.success && !saveInvalidGraph) {
    console.error("Graph contains errors and will not be exported:", result.errors);
    return result;
  }
  let jsonGraph: string | null = null;
  try {
    jsonGraph = JSON.stringify(graph, null, 2);
    downloadFile(jsonGraph, filename, "application/json");
  } catch (err) {
    result.errors.push(`Failed to parse or download graph: ${err instanceof Error ? err.message : String(err)}`);
    result.success = false;
    return result;
  }
  return result;
}
