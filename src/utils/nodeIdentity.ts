import { ReactFlowNodeTypes, NodeTypeIds, StandardLibraryNodeTypes } from "../constants";
import { Node as ReactFlowNode } from "@xyflow/react";

/**
 * Returns true if the given node type id is a standard library node type.
 */
export function isStandardLibraryNodeType(typeId: string): boolean {
  return StandardLibraryNodeTypes.some((nodeType) => nodeType.typeId === typeId);
}

/**
 * Returns true if the given node is a start node.
 */
export function isStartNode(node: ReactFlowNode): boolean {
  return node.type === ReactFlowNodeTypes.START_NODE_REACT_FLOW_TYPE || node.id === NodeTypeIds.START_NODE_TYPE_ID;
}
