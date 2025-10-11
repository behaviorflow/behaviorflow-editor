import { useState, useCallback } from "react";
import { BfNodeTypeAttributes } from "../types";

export type NodeTypeSortingFunction = (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => number;

export interface UseNodeTypesReturn {
  nodeTypes: Map<string, BfNodeTypeAttributes>;
  nodeTypeOrder: string[];
  addNodeType: (nodeType: BfNodeTypeAttributes) => void;
  deleteNodeType: (nodeTypeId: string) => void;
  editNodeType: (nodeTypeId: string, editedNodeType: BfNodeTypeAttributes) => void;
  getOrderedNodeTypes: (orderingFn?: NodeTypeSortingFunction) => BfNodeTypeAttributes[];
  getNodeTypeById: (typeId: string) => BfNodeTypeAttributes | undefined;
  hasNodeType: (typeId: string) => boolean;
}

/**
 * Custom hook for managing node types with efficient CRUD operations
 * Uses a Map for O(1) lookups/edits and maintains insertion order
 */
export function useNodeTypes(initialNodeTypes: BfNodeTypeAttributes[]): UseNodeTypesReturn {
  const [nodeTypes, setNodeTypes] = useState<Map<string, BfNodeTypeAttributes>>(
    new Map(initialNodeTypes.map((nodeType) => [nodeType.typeId, nodeType]))
  );

  const [nodeTypeOrder, setNodeTypeOrder] = useState<string[]>(initialNodeTypes.map((nodeType) => nodeType.typeId));

  const addNodeType = useCallback((nodeType: BfNodeTypeAttributes) => {
    setNodeTypes((types) => {
      const newTypes = new Map(types);
      newTypes.set(nodeType.typeId, nodeType);
      return newTypes;
    });
    setNodeTypeOrder((order) => [...order, nodeType.typeId]);
  }, []);

  const deleteNodeType = useCallback((nodeTypeId: string) => {
    setNodeTypes((types) => {
      const newTypes = new Map(types);
      newTypes.delete(nodeTypeId);
      return newTypes;
    });
    setNodeTypeOrder((order) => order.filter((id) => id !== nodeTypeId));
  }, []);

  const editNodeType = useCallback((nodeTypeId: string, editedNodeType: BfNodeTypeAttributes) => {
    setNodeTypes((types) => {
      const newTypes = new Map(types);
      newTypes.set(nodeTypeId, editedNodeType);
      return newTypes;
    });

    // If the typeId changed, update the order array
    if (nodeTypeId !== editedNodeType.typeId) {
      setNodeTypeOrder((order) => order.map((id) => (id === nodeTypeId ? editedNodeType.typeId : id)));
    }
  }, []);

  const getOrderedNodeTypes = useCallback(
    (orderingFn?: NodeTypeSortingFunction) => {
      const nodeTypesArray = nodeTypeOrder.map((id) => nodeTypes.get(id)!).filter(Boolean); // Filter out any undefined values

      return orderingFn ? nodeTypesArray.sort(orderingFn) : nodeTypesArray;
    },
    [nodeTypes, nodeTypeOrder]
  );

  const getNodeTypeById = useCallback((typeId: string) => nodeTypes.get(typeId), [nodeTypes]);

  const hasNodeType = useCallback((typeId: string) => nodeTypes.has(typeId), [nodeTypes]);

  return {
    nodeTypes,
    nodeTypeOrder,
    addNodeType,
    deleteNodeType,
    editNodeType,
    getOrderedNodeTypes,
    getNodeTypeById,
    hasNodeType,
  };
}

// Predefined sorting functions for common use cases
export const NodeTypeSorters = {
  byTypeId: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => a.typeId.localeCompare(b.typeId),

  byOutPortCount: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => a.outPorts.length - b.outPorts.length,

  byInParamCount: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) =>
    (a.inParams?.length || 0) - (b.inParams?.length || 0),

  byOutParamCount: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) =>
    (a.outParams?.length || 0) - (b.outParams?.length || 0),

  byTotalParamCount: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) =>
    (a.inParams?.length || 0) + (a.outParams?.length || 0) - ((b.inParams?.length || 0) + (b.outParams?.length || 0)),
};
