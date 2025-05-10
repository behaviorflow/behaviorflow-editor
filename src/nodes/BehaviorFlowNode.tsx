import { useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { BfNodeAttributes } from '../types';

export type BehaviorFlowNode = Node<BfNodeAttributes>;

function BehaviorFlowNode(props: NodeProps<BehaviorFlowNode>) {
  const { nodeName, nodeType, inParams, outParams, outPorts} = props.data

  return (
    <div className="behavior-flow-node">
      <Handle
        type="target"
        position={Position.Left}
      />
      <div className="node-header">
        <div className="name-label">{nodeName}</div>
        <div className="type-label">{nodeType}</div>
      </div>
      <div className="node-content">
        <div className="left-column">
          {inParams.map((param, index) => (
              <div key={nodeName+index} className="param-field-section">
                <label htmlFor={`${nodeName}-in-param-text-${index}`}>{param.paramName}: </label>
                <input id={`${nodeName}-in-param-text-${index}`} name="rtext" className="nodrag in-param-field" />
              </div>
            ))}
        </div>
        <div className="right-column">
          <div className="out-port-rows">
            {outPorts.map((port, index) => (
              <div key={nodeName+index} className='out-port-row'>
                <span className="out-port-label">{port}:</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${nodeName}-port-${index}`}
                  className="out-port"
                />
              </div>
            ))}
          </div>
          {outParams.map((param, index) => (
            <div key={nodeName+index} className="param-field-section">
              <label htmlFor={`${nodeName}-out-param-text-${index}`}>{param.paramName}: </label>
              <div>
                <input id={`${nodeName}-out-param-text-${index}`} name="rtext" className="nodrag out-param-field"/>
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
