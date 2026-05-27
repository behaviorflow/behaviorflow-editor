// Much of this is temporary until we have a shared space with C++
import { BfNodeTypeCategory, BfNodeTypeAttributes } from "./types";

export const ReactFlowNodeTypes = {
  START_NODE_REACT_FLOW_TYPE: "startNode",
  BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE: "behaviorFlowNode",
};

export const NodeTypeIds = {
  START_NODE_TYPE_ID: "Start",
  SUCCESS_NODE_TYPE_ID: "Success",
  FAILURE_NODE_TYPE_ID: "Failure",
};

export const SIMPLE_NODE_HANDLE_ID = "Simple-Node-Result-Handle-Placeholder-Id";

// Other colors: #6dd4cf, #b89777
export const NodeColors = {
  StartNodeColor: "#b47bf5",
  BfNodeCategoryColors: {
    [BfNodeTypeCategory.Process]: "#6799ffff",
    [BfNodeTypeCategory.Decision]: "#FFD129",
    [BfNodeTypeCategory.Success]: "#4bb543",
    [BfNodeTypeCategory.Failure]: "#FF6161",
    [BfNodeTypeCategory.Unknown]: "#999999",
  },
};

export const ResultTypeSets = {
  Decision: ["Yes", "No"],
  Simple: [""],
  Terminal: [],
};

export const StandardLibraryNodeTypes: BfNodeTypeAttributes[] = [
  {
    typeId: NodeTypeIds.SUCCESS_NODE_TYPE_ID,
    inParams: [],
    outParams: [],
    resultIds: [],
    isReadOnly: true,
    category: BfNodeTypeCategory.Success,
  },
  {
    typeId: NodeTypeIds.FAILURE_NODE_TYPE_ID,
    inParams: [],
    outParams: [],
    resultIds: [],
    isReadOnly: true,
    category: BfNodeTypeCategory.Failure,
  },
];
