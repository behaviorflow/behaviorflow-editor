// import type { Node, BuiltInNode } from '@xyflow/react';

// export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
// export type AppNode = BuiltInNode | PositionLoggerNode;

export type NodeParam = {
  paramName: string;
  // paramType, defaultValue, etc
};

export enum BfNodeTypeCategory {
  Action,
  Condition,
  Simple,
  Success,
  Failure,
  Custom,
}

export type BfNodeTypeAttributes = {
  typeId: string;
  inParams: NodeParam[];
  outParams: NodeParam[];
  outPorts: string[];
  isReadOnly: boolean;
  category: BfNodeTypeCategory;
};

export type BfNodeAttributes = {
  nodeId: string;
  nodeTypeId: string;
};
