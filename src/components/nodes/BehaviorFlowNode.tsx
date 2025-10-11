import { useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { BfNodeAttributes, BfNodeTypeAttributes, NodeParam } from "../../types";

export type BehaviorFlowNodeProps = {
  nodeAttributes: BfNodeAttributes;
  getNodeTypeById: (typeId: string) => BfNodeTypeAttributes | undefined;
};

export type BehaviorFlowNode = Node<BehaviorFlowNodeProps>;

function BehaviorFlowNode(props: NodeProps<BehaviorFlowNode>) {
  const { nodeId, nodeTypeId } = props.data.nodeAttributes || {};
  if (!nodeId || !nodeTypeId) {
    return <div className="behavior-flow-node error">Invalid node data</div>;
  }
  const nodeType = props.data.getNodeTypeById(nodeTypeId);
  if (!nodeType) {
    return <div className="behavior-flow-node error">Unknown node type: {nodeTypeId}</div>;
  }

  return (
    <div className="behavior-flow-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <div className="name-label">{nodeType.typeId}</div>
        {/* <div className="type-label">{nodeType}</div> */}
      </div>
      <div className="node-content">
        <div className="left-column">
          {nodeType.inParams.map((param: NodeParam, index: number) => (
            <div key={nodeId + index} className="param-field-section">
              <label htmlFor={`${nodeId}-in-param-text-${index}`}>{param.paramName}: </label>
              <input id={`${nodeId}-in-param-text-${index}`} name="rtext" className="nodrag in-param-field" />
            </div>
          ))}
        </div>
        <div className="right-column">
          <div className="out-port-rows">
            {nodeType.outPorts.map((port: string, index: number) => (
              <div key={nodeId + index} className="out-port-row">
                <span className="out-port-label">{port}:</span>
                <Handle type="source" position={Position.Right} id={`${nodeId}-port-${index}`} className="out-port" />
              </div>
            ))}
          </div>
          {nodeType.outParams.map((param: NodeParam, index: number) => (
            <div key={nodeId + index} className="param-field-section">
              <label htmlFor={`${nodeId}-out-param-text-${index}`}>{param.paramName}: </label>
              <div>
                <input id={`${nodeId}-out-param-text-${index}`} name="rtext" className="nodrag out-param-field" />
                <span className="out-param-dollar">$</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BehaviorFlowNode;
