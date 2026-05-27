import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import { GraphDTO } from "./graphDtos";
import { uploadFile } from "./uploadFile";
import { BfNodeTypeAttributes, ResultWithErrorMsgs } from "../types";
import { resultIdsToCategory } from "./resultIdsToCategory";
import { ReactFlowNodeTypes, SIMPLE_NODE_HANDLE_ID, StandardLibraryNodeTypes } from "../constants";
import { isStandardLibraryNodeType } from "./nodeIdentity";

function buildNodeTypes(graph: GraphDTO, errors: string[]): Map<string, BfNodeTypeAttributes> {
  const importedNodeTypes = new Map<string, BfNodeTypeAttributes>();
  for (const nodeType of graph.node_types) {
    if (importedNodeTypes.has(nodeType.node_type_id)) {
      errors.push(
        `Imported graph contains node types with the following duplicate node type ids: ${nodeType.node_type_id}.`,
      );
    }

    const duplicateResultIds = nodeType.result_ids.filter(
      (resultId, index) => nodeType.result_ids.indexOf(resultId) !== index,
    );
    if (duplicateResultIds.length > 0) {
      errors.push(
        `Imported node type '${nodeType.node_type_id}' contains the following duplicate result ids: ${Array.from(new Set(duplicateResultIds)).join(", ")}.`,
      );
    }

    importedNodeTypes.set(nodeType.node_type_id, {
      typeId: nodeType.node_type_id,
      resultIds: nodeType.result_ids,
      inParams: [],
      outParams: [],
      isReadOnly: isStandardLibraryNodeType(nodeType.node_type_id),
      category: resultIdsToCategory(nodeType.result_ids, nodeType.node_type_id),
    });
  }

  return importedNodeTypes;
}

function buildNodes(
  graph: GraphDTO,
  importedNodeTypes: Map<string, BfNodeTypeAttributes>,
  errors: string[],
): ReactFlowNode[] {
  return graph.nodes.map((node) => {
    if (!importedNodeTypes.has(node.node_type)) {
      errors.push(
        `Imported graph contains node '${node.node_id}' with node type '${node.node_type}', but '${node.node_type}' does not correspond to any node type from the imported graph.`,
      );
    }
    return {
      id: node.node_id,
      type: ReactFlowNodeTypes.BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE,
      data: {
        nodeAttributes: {
          nodeId: node.node_id,
          nodeTypeId: node.node_type,
        },
      },
      position: { x: 0, y: 0 }, // Placeholder, layout handled later
    };
  });
}

function buildEdges(
  graph: GraphDTO,
  importedNodeTypes: Map<string, BfNodeTypeAttributes>,
  errors: string[],
): ReactFlowEdge[] {
  const importedEdges: ReactFlowEdge[] = [];
  for (const node of graph.nodes) {
    const nodeTypeAttributes = importedNodeTypes.get(node.node_type);
    let unexpectedResultIds: string[] = [];
    if (nodeTypeAttributes) {
      const transitionResultIds = new Set(Object.keys(node.transitions));
      const expectedResultIds = new Set(nodeTypeAttributes.resultIds);
      const missingResultIds = Array.from(expectedResultIds).filter((resultId) => !transitionResultIds.has(resultId));
      unexpectedResultIds = Array.from(transitionResultIds).filter((resultId) => !expectedResultIds.has(resultId));
      if (missingResultIds.length > 0) {
        errors.push(
          `Imported node '${node.node_id}' does not map every result id from its node type to another node. Unmapped result ids: ${missingResultIds.join(", ")}.`,
        );
      }
      if (unexpectedResultIds.length > 0) {
        errors.push(
          `Imported node '${node.node_id}' has node transitions from result ids that do not exist in its node type. Invalid result ids: ${unexpectedResultIds.join(", ")}.`,
        );
      }
    }

    for (const [resultId, targetId] of Object.entries(node.transitions)) {
      if (unexpectedResultIds.includes(resultId)) {
        continue;
      }
      if (!graph.nodes.some((n) => n.node_id === targetId)) {
        errors.push(
          `Imported graph contains node '${node.node_id}' with a transition to '${targetId}', but '${targetId}' does not correspond to any node defined in the imported graph.`,
        );
        continue;
      }
      const handleId = resultId.length === 0 ? SIMPLE_NODE_HANDLE_ID : resultId;
      importedEdges.push({
        id: `${node.node_id}:${handleId}->${targetId}`,
        source: node.node_id,
        target: targetId,
        sourceHandle: handleId,
      });
    }
  }

  return importedEdges;
}

function fromGraphDTO(graph: GraphDTO): {
  result: ResultWithErrorMsgs;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  start_node_id: string | null;
  nodeTypes: Map<string, BfNodeTypeAttributes>;
} {
  const errors: string[] = [];
  const importedNodeTypes = buildNodeTypes(graph, errors);
  const importedNodes = buildNodes(graph, importedNodeTypes, errors);
  const importedEdges = buildEdges(graph, importedNodeTypes, errors);

  if (graph.start_node_id && !importedNodes.some((node) => node.id === graph.start_node_id)) {
    errors.push(
      `Imported graph's start_node_id '${graph.start_node_id}' does not correspond to any node defined in the imported graph.`,
    );
  }
  if (!graph.start_node_id) {
    errors.push(`Imported graph does not specify a start_node_id.`);
  }

  return {
    result: {
      success: errors.length === 0,
      errors,
    },
    nodes: importedNodes,
    edges: importedEdges,
    start_node_id: graph.start_node_id || null,
    nodeTypes: importedNodeTypes,
  };
}

export async function importGraphFromJsonFile(accept: string = "application/json"): Promise<{
  result: ResultWithErrorMsgs;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  start_node_id: string | null;
  nodeTypes: Map<string, BfNodeTypeAttributes>;
  filename?: string;
}> {
  try {
    const { contents: fileContents, filename } = await uploadFile(accept);
    const graph: GraphDTO = JSON.parse(fileContents);
    return { ...fromGraphDTO(graph), filename };
  } catch (err) {
    return {
      result: {
        success: false,
        errors: [`Failed to parse or upload graph: ${err instanceof Error ? err.message : String(err)}`],
      },
      nodes: [],
      edges: [],
      start_node_id: null,
      nodeTypes: new Map<string, BfNodeTypeAttributes>(),
    };
  }
}
