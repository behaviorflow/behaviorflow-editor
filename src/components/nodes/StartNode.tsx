import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeColors } from "../../constants.ts";

function StartNode(props: NodeProps) {
  return (
    <div className="behavior-flow-node">
      <div className="start-node" style={{ backgroundColor: NodeColors.StartNodeColor }}>
        <div className="type-label">Start</div>
      </div>
      <Handle type="source" position={Position.Right} id="start-node-out" />
    </div>
  );
}

export default StartNode;
