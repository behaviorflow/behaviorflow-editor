import { useRef, useLayoutEffect } from "react";
import { Handle, Position, NodeProps, Node, useReactFlow } from "@xyflow/react";
import { BfNodeAttributes, NodeParam } from "../../types";
import { useNodeTypesContext, useSettingsContext } from "../../contexts";
import { SIMPLE_NODE_HANDLE_ID, NodeColors } from "../../constants.ts";
import { BfNodeTypeCategory } from "../../types";

export type BehaviorFlowNodeData = {
  nodeAttributes: BfNodeAttributes;
};

type BehaviorFlowNodeType = Node<BehaviorFlowNodeData>;

interface BehaviorFlowNodeProps {
  isPreview?: boolean;
}

function BehaviorFlowNode(props: NodeProps<BehaviorFlowNodeType> & BehaviorFlowNodeProps) {
  const isPreview = props.isPreview ?? false;
  const { setEdges } = useReactFlow();
  const { showNodeIds } = useSettingsContext();
  const { getNodeTypeById } = useNodeTypesContext();
  const { nodeId, nodeTypeId } = props.data.nodeAttributes || {};
  const nodeTypeAttributes = nodeTypeId ? getNodeTypeById(nodeTypeId) : null;
  const { typeId, inParams = [], outParams = [], resultIds = [], category } = nodeTypeAttributes || {};
  const prevResultIdsRef = useRef<string[]>(resultIds);
  const nodeRef = useRef<HTMLDivElement>(null);

  const isDataInvalid = !nodeId || !nodeTypeId;
  const isUnknownType = nodeId && nodeTypeId && !nodeTypeAttributes;

  const haveResultIdsChanged = () => {
    if (prevResultIdsRef.current.length !== resultIds.length) return true;
    return !prevResultIdsRef.current.every((result_id, index) => result_id === resultIds[index]);
  };

  useLayoutEffect(() => {
    const resultIdsChanged = haveResultIdsChanged();
    if (isDataInvalid || isUnknownType || resultIdsChanged) {
      // Remove edges connected to this node
      setEdges((edges) => edges.filter((edge) => edge.source !== props.id && edge.target !== props.id));
    }
    prevResultIdsRef.current = resultIds;
  }, [isDataInvalid, isUnknownType, nodeTypeId, resultIds, props.id, setEdges]);

  if (isDataInvalid) {
    return <div className="behavior-flow-node error">Invalid node data</div>;
  }
  if (isUnknownType) {
    return <div className="behavior-flow-node error">Unknown node type: {nodeTypeId}</div>;
  }

  const has_non_label_result_id_only = resultIds.length === 1 && resultIds[0].length === 0;
  const is_content =
    inParams.length > 0 || outParams.length > 0 || (resultIds.length > 0 && !has_non_label_result_id_only);

  const nodeBackgroundColor = category ? NodeColors.BfNodeCategoryColors[category as BfNodeTypeCategory] : "#eee";
  const nodeHeaderClass = `node-header${!is_content ? " node-header--no-content" : ""}`;

  return (
    <div className="behavior-flow-node" ref={nodeRef}>
      {!isPreview && <Handle type="target" position={Position.Left} />}
      <div className={nodeHeaderClass} style={{ backgroundColor: nodeBackgroundColor }}>
        <div className="type-label">{typeId}</div>
        {showNodeIds && !isPreview && <div className="name-label">{nodeId}</div>}
      </div>
      {is_content && (
        <div className="node-content">
          <div className="left-column">
            {inParams.map((param: NodeParam, index: number) => (
              <div key={nodeId + index} className="param-field-section">
                <label htmlFor={`${nodeId}-in-param-text-${param.paramName}`}>{param.paramName}: </label>
                <input
                  id={`${nodeId}-in-param-text-${param.paramName}`}
                  name="rtext"
                  className="nodrag in-param-field"
                />
              </div>
            ))}
          </div>
          <div className="right-column">
            <div className="out-port-rows">
              {!has_non_label_result_id_only &&
                resultIds.map((result_id: string, index: number) => (
                  <div key={nodeId + "-port-" + result_id} className="out-port-row">
                    <span className="out-port-label">{result_id}:</span>
                    {!isPreview && (
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={result_id === "" ? SIMPLE_NODE_HANDLE_ID : result_id}
                        className="out-port"
                      />
                    )}
                  </div>
                ))}
            </div>
            {outParams.map((param: NodeParam, index: number) => (
              <div key={nodeId + index} className="param-field-section">
                <label htmlFor={`${nodeId}-out-param-text-${param.paramName}`}>{param.paramName}: </label>
                <div>
                  <input
                    id={`${nodeId}-out-param-text-${param.paramName}`}
                    name="rtext"
                    className="nodrag out-param-field"
                  />
                  <span className="out-param-dollar">$</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {has_non_label_result_id_only && !isPreview && (
        <Handle type="source" position={Position.Right} id={SIMPLE_NODE_HANDLE_ID} />
      )}
    </div>
  );
}

export default BehaviorFlowNode;
