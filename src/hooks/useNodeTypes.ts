import { useState, useCallback } from "react";
import { BfNodeTypeAttributes } from "../types";

export type NodeTypeSortingFunction = (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => number;

export interface UseNodeTypesReturn {
  nodeTypes: Map<string, BfNodeTypeAttributes>;
  nodeTypeOrder: string[];
  addNodeType: (nodeType: BfNodeTypeAttributes) => void;
  deleteNodeType: (nodeTypeId: string) => void;
  getOrderedNodeTypes: (orderingFn?: NodeTypeSortingFunction) => BfNodeTypeAttributes[];
  getNodeTypeById: (typeId: string) => BfNodeTypeAttributes | undefined;
}

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

  const getOrderedNodeTypes = useCallback(
    (orderingFn?: NodeTypeSortingFunction) => {
      const nodeTypesArray = nodeTypeOrder.map((id) => nodeTypes.get(id)!).filter(Boolean); // Filter out any undefined values

      return orderingFn ? nodeTypesArray.sort(orderingFn) : nodeTypesArray;
    },
    [nodeTypes, nodeTypeOrder]
  );

  const getNodeTypeById = useCallback((typeId: string) => nodeTypes.get(typeId), [nodeTypes]);

  return {
    nodeTypes,
    nodeTypeOrder,
    addNodeType,
    deleteNodeType,
    getOrderedNodeTypes,
    getNodeTypeById,
  };
}
