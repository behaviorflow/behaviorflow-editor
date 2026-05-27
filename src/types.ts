// import type { Node, BuiltInNode } from '@xyflow/react';

// export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
// export type AppNode = BuiltInNode | PositionLoggerNode;

export type NodeParam = {
  paramName: string;
  // paramType, defaultValue, etc
};

export enum BfNodeTypeCategory {
  Process = "Process",
  Decision = "Decision",
  Success = "Success",
  Failure = "Failure",
  Unknown = "Unknown",
}

export type BfNodeTypeAttributes = {
  typeId: string;
  inParams: NodeParam[];
  outParams: NodeParam[];
  resultIds: string[];
  isReadOnly: boolean;
  category: BfNodeTypeCategory;
};

export type BfNodeAttributes = {
  nodeId: string;
  nodeTypeId: string;
};

export type ResultWithErrorMsgs = {
  success: boolean;
  errors: string[];
};
