import React, { createContext, useContext, ReactNode } from "react";
import { BfNodeTypeAttributes } from "../types";
import { useNodeTypes, UseNodeTypesReturn } from "../hooks/useNodeTypes";

// Context type - expose the full useNodeTypes return
type NodeTypesContextType = UseNodeTypesReturn;

const NodeTypesContext = createContext<NodeTypesContextType | null>(null);

export interface NodeTypesProviderProps {
  initialNodeTypes: BfNodeTypeAttributes[];
  children: ReactNode;
}

export function NodeTypesProvider({ initialNodeTypes, children }: NodeTypesProviderProps) {
  const nodeTypesState = useNodeTypes(initialNodeTypes);
  return <NodeTypesContext.Provider value={nodeTypesState}>{children}</NodeTypesContext.Provider>;
}

export function useNodeTypesContext(): NodeTypesContextType {
  const context = useContext(NodeTypesContext);
  if (!context) {
    throw new Error("useNodeTypesContext must be used within a NodeTypesProvider");
  }
  return context;
}
