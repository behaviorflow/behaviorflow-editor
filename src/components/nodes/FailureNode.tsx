import { Handle, Position, NodeProps, Node } from "@xyflow/react";

export type FailureNode = Node<{}>;

function FailureNode(props: NodeProps<FailureNode>) {
  return (
    <div className="behavior-flow-node">
      <div className="failure-node">
        <div className="name-label">Failure</div>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default FailureNode;