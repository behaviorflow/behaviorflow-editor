import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export type TerminalNode = Node<{label: string;}>;

function TerminalNode(props: NodeProps<TerminalNode>) {
  const { label } = props.data;
  return (
    <div className="behavior-flow-node">
      <div className="terminal-node">
        <div className="name-label">{label}</div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
      />
    </div>
  );
}

export default TerminalNode;
