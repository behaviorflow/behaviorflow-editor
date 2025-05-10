import { Handle, Position } from '@xyflow/react';

function StartNode() {
  return (
    <div className="behavior-flow-node">
      <div className="start-node">
        <div className="name-label">Start</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default StartNode;
