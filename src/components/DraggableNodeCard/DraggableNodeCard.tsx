import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { BfNodeTypeAttributes } from "../../types";
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import "./draggable-node-card.css";

interface DraggableNodeCardProps {
  nodeType: BfNodeTypeAttributes;
  isSelected?: boolean;
}

export default function DraggableNodeCard({ nodeType, isSelected = false }: DraggableNodeCardProps) {
  const [showCallout, setShowCallout] = useState(false);
  const calloutTimer = useRef<number | null>(null);
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify(nodeType.typeId));
    if (calloutTimer.current) {
      window.clearTimeout(calloutTimer.current);
    }
    setShowCallout(false);
  };
  const handleMouseEnter = () => {
    calloutTimer.current = window.setTimeout(() => {
      setShowCallout(true);
    }, 1000);
  };
  const handleMouseLeave = () => {
    if (calloutTimer.current) {
      window.clearTimeout(calloutTimer.current);
    }
    setShowCallout(false);
  };
  return (
    <div>
      <div
        className={`draggable-node-card ${isSelected ? "selected" : ""}`}
        draggable={true}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <GripVertical className="draggable-node-card-grip" />
        <span className="draggable-node-card-text">{nodeType.typeId}</span>
      </div>
      {showCallout && (
        <div className="draggable-node-card-callout">
          <BehaviorFlowNode
            id={nodeType.typeId + "callout"}
            data={{
              nodeAttributes: {
                nodeId: nodeType.typeId + "callout",
                nodeTypeId: nodeType.typeId,
              },
              getNodeTypeById: (typeId: string) => nodeType,
            }}
            type="behaviorFlowNode"
            dragging={false}
            zIndex={1}
            isConnectable={false}
            positionAbsoluteX={0}
            positionAbsoluteY={0}
          />
        </div>
      )}
    </div>
  );
}
