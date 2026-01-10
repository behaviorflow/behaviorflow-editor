export const ReactFlowNodeTypes = {
  START_NODE_REACT_FLOW_TYPE: "startNode",
  BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE: "behaviorFlowNode",
};

export const NodeTypeIds = {
  START_NODE_TYPE_ID: "start",
};

export const SIMPLE_NODE_HANDLE_ID = "Simple-Node-Result-Handle-Placeholder-Id";

import { BfNodeTypeCategory } from "./types";
const ProcessColor = "#6799ffff";
const DecisionColor = "#FFD129";
// Other colors: #6dd4cf, #b89777
export const NodeColors = {
  StartNodeColor: "#b47bf5",
  BfNodeCategoryColors: {
    [BfNodeTypeCategory.Action]: ProcessColor,
    [BfNodeTypeCategory.Condition]: DecisionColor,
    [BfNodeTypeCategory.Simple]: ProcessColor,
    [BfNodeTypeCategory.Success]: "#4bb543",
    [BfNodeTypeCategory.Failure]: "#FF6161",
    [BfNodeTypeCategory.Custom]: ProcessColor,
  },
};
