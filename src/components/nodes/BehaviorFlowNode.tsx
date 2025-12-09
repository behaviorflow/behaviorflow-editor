import { useEffect, useRef, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { BfNodeAttributes, BfNodeTypeAttributes, NodeParam } from "../../types";

export type BehaviorFlowNodeProps = {
  nodeAttributes: BfNodeAttributes;
  nodeTypeAttributes: BfNodeTypeAttributes;
};

export type BehaviorFlowNode = Node<BehaviorFlowNodeProps>;

function BehaviorFlowNode(props: NodeProps<BehaviorFlowNode>) {
  const { nodeId, nodeTypeId } = props.data.nodeAttributes || {};
  if (!nodeId || !nodeTypeId) {
    return <div className="behavior-flow-node error">Invalid node data</div>;
  }
  const { typeId, inParams, outParams, outPorts } = props.data.nodeTypeAttributes || {};
  if (!typeId) {
    return <div className="behavior-flow-node error">Unknown node type: {nodeTypeId}</div>;
  }
  const has_non_label_out_port_only = outPorts && outPorts.length == 1 && outPorts[0].length == 0;
  const is_content =
    (inParams && inParams.length > 0) ||
    (outParams && outParams.length > 0) ||
    (outPorts && outPorts.length > 0 && !has_non_label_out_port_only);

  const nodeHeaderClass = `node-header${!is_content ? " node-header--no-content" : ""}`;

  return (
    <div className="behavior-flow-node">
      <Handle type="target" position={Position.Left} />
      <div className={nodeHeaderClass}>
        <div className="name-label">{typeId}</div>
        {/* <div className="type-label">{nodeType}</div> */}
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
              {outPorts.map((port: string, index: number) => (
                <div key={nodeId + "-port-" + port} className="out-port-row">
                  <span className="out-port-label">{port}:</span>
                  <Handle type="source" position={Position.Right} id={`${nodeId}-port-${port}`} className="out-port" />
                </div>
              ))}
            </div>
            {!has_non_label_out_port_only &&
              outParams.map((param: NodeParam, index: number) => (
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
      {has_non_label_out_port_only && <Handle type="source" position={Position.Right} id={`${nodeId}-port-0`} />}
    </div>
  );
}

export default BehaviorFlowNode;
