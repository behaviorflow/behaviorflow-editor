// import type { Node, BuiltInNode } from '@xyflow/react';

// export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
// export type AppNode = BuiltInNode | PositionLoggerNode;

export type NodeParam = {
  paramName: string;
  // paramType, defaultValue, etc
};

export type BfNodeAttributes = { // Maybe change to BfNodeType
  nodeId: string;
  nodeType: string; // Maybe change to nodeTypeId
  inParams: NodeParam[];
  outParams: NodeParam[];
  outPorts: string[];
};
