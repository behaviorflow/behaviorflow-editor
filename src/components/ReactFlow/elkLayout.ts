import ELK, { ElkNode, ElkExtendedEdge, LayoutOptions } from "elkjs/lib/elk.bundled.js";
import { Node, Edge } from "@xyflow/react";
import { BehaviorFlowNodeData } from "../nodes/BehaviorFlowNode";
import { SIMPLE_NODE_HANDLE_ID } from "../../constants";
import { BfNodeTypeAttributes } from "../../types";

const DEFAULT_NODE_WIDTH = 60;
const DEFAULT_NODE_HEIGHT = 60;

const elk = new ELK();

const GRAPH_LAYOUT_OPTIONS: LayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT", // left-to-right
  "elk.layered.spacing.nodeNodeBetweenLayers": "50",
  "elk.spacing.nodeNode": "50",
  // Tell ELK we will assign port positions ourselves.
  "elk.portConstraints": "FIXED_ORDER",
};

/**
 * Returns the ordered list of source-handle IDs for a ReactFlow node.
 *
 * For BehaviorFlowNode the handles and order come from `resultIds` on
 * the node-type attributes.
 *
 * ASSUMPTION: A BehaviorFlowNode's `resultIds` are in the same order
 * as the node's ports are visually.
 *
 * ASSUMPTION: Node handleIds match the corresponding `resultIds`
 */
function buildHandleOrderMap(
  nodes: Node[],
  edges: Edge[],
  getNodeTypeById: (id: string) => BfNodeTypeAttributes | undefined,
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  nodes.forEach((node) => {
    const outgoingEdges = edges.filter((edge) => edge.source === node.id);
    const seenHandles = new Set<string>();
    for (const edge of outgoingEdges) {
      if (!edge.sourceHandle) continue;
      seenHandles.add(edge.sourceHandle);
    }

    // Order per the resultIds (i.e. visual port order) if this is a BehaviorFlowNode with a known node type.
    // Otherwise, just use the order in which handles were seen on outgoing edges.
    const data = node.data as BehaviorFlowNodeData;
    const nodeTypeId = data?.nodeAttributes?.nodeTypeId;
    const resultIds = nodeTypeId ? (getNodeTypeById(nodeTypeId)?.resultIds ?? []) : [];
    const orderedHandles = Array.from(seenHandles).sort((a, b) => {
      const aIndex = resultIds.indexOf(a);
      const bIndex = resultIds.indexOf(b);
      const aOrder = aIndex === -1 ? Infinity : aIndex;
      const bOrder = bIndex === -1 ? Infinity : bIndex;
      return aOrder - bOrder;
    });

    map.set(node.id, orderedHandles);
  });

  return map;
}

function getGlobalPortId(nodeId: string, handleId: string): string {
  return `${nodeId}__${handleId}`;
}

/**
 * Asynchronously organizes a ReactFlow graph into a nice-looking tree using ELK.
 * @param reactFlowNodes   ReactFlow nodes (must have `measured` dimensions if available)
 * @param reactFlowEdges   ReactFlow edges (must carry `sourceHandle` when using labelled ports)
 */
export async function getLayoutedElements(
  reactFlowNodes: Node[],
  reactFlowEdges: Edge[],
  getNodeTypeById: (id: string) => BfNodeTypeAttributes | undefined,
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  // Convert ReactFlow nodes → ELK nodes
  const handleOrderMap = buildHandleOrderMap(reactFlowNodes, reactFlowEdges, getNodeTypeById);
  const elkNodes: ElkNode[] = reactFlowNodes.map((node) => {
    const width = node.measured?.width ?? DEFAULT_NODE_WIDTH;
    const height = node.measured?.height ?? DEFAULT_NODE_HEIGHT;
    const handleIds = handleOrderMap.get(node.id) ?? [];
    const orderedPorts = handleIds.map((handleId, index) => ({
      id: getGlobalPortId(node.id, handleId),
      properties: {
        "port.side": "EAST",
        "port.index": String(index),
      },
    }));

    return {
      id: node.id,
      width,
      height,
      ports: orderedPorts,
      layoutOptions: {
        "elk.portConstraints": "FIXED_ORDER",
      },
    };
  });

  // Convert ReactFlow edges → ELK edges
  const elkEdges: ElkExtendedEdge[] = reactFlowEdges.map((edge) => {
    const rawHandle = edge.sourceHandle ?? "";
    const elkSourcePortId = rawHandle ? getGlobalPortId(edge.source, rawHandle) : undefined;

    return {
      id: edge.id,
      sources: elkSourcePortId ? [elkSourcePortId] : [edge.source],
      targets: [edge.target],
    };
  });

  const elkGraph: ElkNode = {
    id: "root",
    layoutOptions: {
      ...GRAPH_LAYOUT_OPTIONS,
    },
    children: elkNodes,
    edges: elkEdges,
  };

  let layoutedGraph: ElkNode;
  try {
    layoutedGraph = await elk.layout(elkGraph);
  } catch (err) {
    console.error("[ELK] Layout failed:", err);
    // Return the original positions.
    return { nodes: reactFlowNodes, edges: reactFlowEdges };
  }

  // Map ELK positions back to ReactFlow nodes
  const elkNodeMap = new Map<string, ElkNode>((layoutedGraph.children ?? []).map((n) => [n.id, n]));
  const layoutedReactNodes = reactFlowNodes.map((node) => {
    const elkNode = elkNodeMap.get(node.id);
    if (!elkNode || elkNode.x == null || elkNode.y == null) {
      console.warn(`[ELK] No position returned for node "${node.id}"`);
      return node;
    }
    return {
      ...node,
      position: { x: elkNode.x, y: elkNode.y },
    };
  });

  return { nodes: layoutedReactNodes, edges: reactFlowEdges };
}
