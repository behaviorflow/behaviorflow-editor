import { useRef, useLayoutEffect } from "react";
import { Handle, Position, NodeProps, useReactFlow, Node } from "@xyflow/react";
import { NodeColors } from "../../constants.ts";

export type StartNodeData = {
  measuredWidth?: number;
  measuredHeight?: number;
  // Todo: Hack. Same prop names as BehaviorFlowNode.
};

function StartNode(props: NodeProps<Node<StartNodeData>>) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { updateNode } = useReactFlow();

  useLayoutEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (props.data?.measuredWidth !== rect.width || props.data?.measuredHeight !== rect.height) {
      updateNode(props.id, {
        data: { ...props.data, measuredWidth: rect.width, measuredHeight: rect.height },
      });
    }
  }, [props.id, updateNode, props.data]);

  return (
    <div className="behavior-flow-node" ref={nodeRef}>
      <div className="start-node" style={{ backgroundColor: NodeColors.StartNodeColor }}>
        <div className="type-label">Start</div>
      </div>
      <Handle type="source" position={Position.Right} id="start-node-out" />
    </div>
  );
}

export default StartNode;
