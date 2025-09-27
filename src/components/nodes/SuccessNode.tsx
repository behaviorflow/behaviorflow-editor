import { Handle, Position, NodeProps, Node } from "@xyflow/react";

export type SuccessNode = Node<{}>;

function SuccessNode(props: NodeProps<SuccessNode>) {
  return (
    <div className="behavior-flow-node">
      <div className="success-node">
        <div className="name-label">Success</div>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default SuccessNode;