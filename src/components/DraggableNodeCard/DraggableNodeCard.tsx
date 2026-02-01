import { useState, useRef } from "react";
import { GripVertical, LockKeyhole } from "lucide-react";
import { BfNodeTypeAttributes } from "../../types";
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import "./draggable-node-card.css";
import { ReactFlowNodeTypes } from "../../constants";

interface DraggableNodeCardProps {
  nodeType: BfNodeTypeAttributes;
  isReadOnly: boolean;
  isSelected?: boolean;
}

const CALLOUT_DELAY_MS = 700;

export default function DraggableNodeCard({ nodeType, isReadOnly, isSelected = false }: DraggableNodeCardProps) {
  const [showCallout, setShowCallout] = useState(false);
  const calloutTimer = useRef<number | null>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(nodeType.typeId));
    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
    if (calloutTimer.current) {
      window.clearTimeout(calloutTimer.current);
    }
    setShowCallout(false);
  };
  const handleMouseEnter = () => {
    calloutTimer.current = window.setTimeout(() => {
      setShowCallout(true);
    }, CALLOUT_DELAY_MS);
  };
  const handleMouseLeave = () => {
    if (calloutTimer.current) {
      window.clearTimeout(calloutTimer.current);
    }
    setShowCallout(false);
  };
  return (
    <div>
      <div style={{ position: "fixed", top: -9999, left: -9999, pointerEvents: "none" }} ref={dragImageRef}>
        {/* Hidden drag image node */}
        <BehaviorFlowNodePreview nodeType={nodeType} nodeId="drag-image-preview" />
      </div>
      <div
        className={`draggable-node-card ${isSelected ? "selected" : ""}`}
        draggable={true}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <GripVertical className="draggable-node-card-grip" />
        <span className="draggable-node-card-text">{nodeType.typeId}</span>
        {isReadOnly && <LockKeyhole className="draggable-node-card-lock-icon" />}
      </div>
      {showCallout && <DraggableNodeCardCallout nodeType={nodeType} />}
    </div>
  );
}

function DraggableNodeCardCallout({ nodeType }: { nodeType: BfNodeTypeAttributes }) {
  return (
    <div className="draggable-node-card-callout">
      <BehaviorFlowNodePreview nodeType={nodeType} nodeId="callout-preview" />
    </div>
  );
}

function BehaviorFlowNodePreview({ nodeType, nodeId }: { nodeType: BfNodeTypeAttributes; nodeId: string }) {
  return (
    <BehaviorFlowNode
      id={nodeId}
      type={ReactFlowNodeTypes.BEHAVIOR_FLOW_NODE_REACT_FLOW_TYPE}
      data={{
        nodeAttributes: {
          nodeId,
          nodeTypeId: nodeType.typeId,
        },
      }}
      selected={false}
      dragging={false}
      zIndex={1}
      isConnectable={false}
      positionAbsoluteX={0}
      positionAbsoluteY={0}
      isPreview={true}
    />
  );
}
