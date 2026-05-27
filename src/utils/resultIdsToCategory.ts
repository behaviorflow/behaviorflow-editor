import { BfNodeTypeCategory } from "../types";
import { NodeTypeIds, ResultTypeSets } from "../constants";

export function resultIdsToCategory(resultIds: string[], nodeTypeId?: string): BfNodeTypeCategory {
  if (
    resultIds.length === ResultTypeSets.Decision.length &&
    resultIds.every((type) => ResultTypeSets.Decision.includes(type)) &&
    ResultTypeSets.Decision.every((type) => resultIds.includes(type))
  ) {
    return BfNodeTypeCategory.Decision;
  } else if (resultIds.length === 0) {
    if (nodeTypeId === NodeTypeIds.SUCCESS_NODE_TYPE_ID) {
      return BfNodeTypeCategory.Success;
    } else if (nodeTypeId === NodeTypeIds.FAILURE_NODE_TYPE_ID) {
      return BfNodeTypeCategory.Failure;
    } else {
      console.warn("Unexpected terminal node type:", nodeTypeId);
      return BfNodeTypeCategory.Unknown;
    }
  } else {
    return BfNodeTypeCategory.Process;
  }
}
