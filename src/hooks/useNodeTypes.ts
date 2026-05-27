import { isStandardLibraryNodeType } from "../utils/nodeIdentity";
import { useState, useCallback } from "react";
import { BfNodeTypeAttributes, ResultWithErrorMsgs } from "../types";

export type NodeTypeSortingFunction = (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => number;

export interface UseNodeTypesReturn {
  nodeTypes: Map<string, BfNodeTypeAttributes>;
  nodeTypeOrder: string[];
  addNodeType: (nodeType: BfNodeTypeAttributes) => ResultWithErrorMsgs;
  deleteNodeType: (nodeTypeId: string) => ResultWithErrorMsgs;
  getOrderedNodeTypes: (orderingFn?: NodeTypeSortingFunction) => BfNodeTypeAttributes[];
  getNodeTypeById: (typeId: string) => BfNodeTypeAttributes | undefined;
  validateNodeType: (nodeType: BfNodeTypeAttributes) => ResultWithErrorMsgs;
  replaceNodeTypes: (newNodeTypes: BfNodeTypeAttributes[]) => ResultWithErrorMsgs;
  hasUserDefinedNodeTypes: () => boolean;
}

export function useNodeTypes(initialNodeTypes: BfNodeTypeAttributes[]): UseNodeTypesReturn {
  const [nodeTypes, setNodeTypes] = useState<Map<string, BfNodeTypeAttributes>>(
    new Map(initialNodeTypes.map((nodeType) => [nodeType.typeId, nodeType])),
  );

  const [nodeTypeOrder, setNodeTypeOrder] = useState<string[]>(initialNodeTypes.map((nodeType) => nodeType.typeId));

  const addNodeType = useCallback(
    (nodeType: BfNodeTypeAttributes): ResultWithErrorMsgs => {
      let result = validateNodeType(nodeType);
      const existing = Array.from(nodeTypes.values()).find(
        (nt) => nt.typeId.toLowerCase() === nodeType.typeId.toLowerCase(),
      );
      if (existing) {
        result.errors.push("A node type named '" + existing.typeId + "' already exists.");
        result.success = false;
      }
      if (!result.success) {
        return result;
      }
      setNodeTypes((types) => {
        const newTypes = new Map(types);
        newTypes.set(nodeType.typeId, nodeType);
        return newTypes;
      });
      setNodeTypeOrder((order) => [...order, nodeType.typeId]);
      return result;
    },
    [nodeTypes],
  );

  const deleteNodeType = useCallback(
    (nodeTypeId: string) => {
      const result: ResultWithErrorMsgs = { success: true, errors: [] };
      if (!nodeTypes.has(nodeTypeId)) {
        result.success = false;
        result.errors.push("Node type '" + nodeTypeId + "' not found.");
        return result;
      }
      if (nodeTypes.get(nodeTypeId)?.isReadOnly) {
        result.success = false;
        result.errors.push("Node type '" + nodeTypeId + "' is read-only and cannot be deleted.");
        return result;
      }
      setNodeTypes((types) => {
        const newTypes = new Map(types);
        newTypes.delete(nodeTypeId);
        return newTypes;
      });
      setNodeTypeOrder((order) => order.filter((id) => id !== nodeTypeId));
      return result;
    },
    [nodeTypes],
  );

  const getOrderedNodeTypes = useCallback(
    (orderingFn?: NodeTypeSortingFunction) => {
      const nodeTypesArray = nodeTypeOrder.map((id) => nodeTypes.get(id)!).filter(Boolean); // Filter out any undefined values

      return orderingFn ? nodeTypesArray.sort(orderingFn) : nodeTypesArray;
    },
    [nodeTypes, nodeTypeOrder],
  );

  const getNodeTypeById = useCallback((typeId: string) => nodeTypes.get(typeId), [nodeTypes]);

  const validateNodeType = useCallback((nodeType: BfNodeTypeAttributes): ResultWithErrorMsgs => {
    let errors: string[] = [];
    if (nodeType.typeId.trim() !== nodeType.typeId) {
      errors.push("Node type ID cannot have leading or trailing whitespace.");
    }
    if (!nodeType.typeId || nodeType.typeId.trim() === "") {
      errors.push("Node type ID cannot be empty.");
    }
    if (nodeType.typeId.length < 3 || nodeType.typeId.length > 64) {
      errors.push("Node type ID must be between 3 and 64 characters.");
    }
    if (!/^[\p{L}\p{N}_ ?]+$/u.test(nodeType.typeId)) {
      errors.push("Node type ID can only contain letters, numbers, underscores, spaces, and question marks.");
    }
    return { success: errors.length === 0, errors };
  }, []);

  const replaceNodeTypes = useCallback(
    (newNodeTypes: BfNodeTypeAttributes[]): ResultWithErrorMsgs => {
      let errors: string[] = [];
      let seenTypeIds = new Set<string>();
      for (const nodeType of newNodeTypes) {
        // Check for duplicate typeIds in the new list
        if (seenTypeIds.has(nodeType.typeId)) {
          errors.push(`Duplicate node type ID '${nodeType.typeId}' in new node types.`);
          continue;
        }
        seenTypeIds.add(nodeType.typeId);
        // Validate each node type
        const result = validateNodeType(nodeType);
        if (!result.success) {
          errors.push(...result.errors.map((e) => `Node type '${nodeType.typeId}': ${e}`));
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }
      // Review: Replacing even base read-only node types that are included by default, assuming they are in the new graph. We might want to consider readding them if they were not in the graph
      setNodeTypes(new Map(newNodeTypes.map((nodeType) => [nodeType.typeId, nodeType])));
      setNodeTypeOrder(newNodeTypes.map((nodeType) => nodeType.typeId));
      return { success: true, errors: [] };
    },
    [nodeTypes, nodeTypeOrder, validateNodeType],
  );

  const hasUserDefinedNodeTypes = useCallback(() => {
    return Array.from(nodeTypes.values()).some((nt) => !isStandardLibraryNodeType(nt.typeId));
  }, [nodeTypes]);

  return {
    nodeTypes,
    nodeTypeOrder,
    addNodeType,
    deleteNodeType,
    getOrderedNodeTypes,
    getNodeTypeById,
    validateNodeType,
    replaceNodeTypes,
    hasUserDefinedNodeTypes,
  };
}
