import { useState, useRef } from "react";
import { GripVertical, LockKeyhole } from "lucide-react";
import { BfNodeTypeAttributes } from "../../types";
import BehaviorFlowNode from "../nodes/BehaviorFlowNode";
import "./draggable-node-card.css";

interface DraggableNodeCardProps {
  nodeType: BfNodeTypeAttributes;
  isReadOnly: boolean;
  isSelected?: boolean;
}

export default function DraggableNodeCard({ nodeType, isReadOnly, isSelected = false }: DraggableNodeCardProps) {
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
        {isReadOnly && <LockKeyhole className="draggable-node-card-lock-icon" />}
      </div>
      {showCallout && <DraggableNodeCardCallout nodeType={nodeType} />}
    </div>
  );
}

function DraggableNodeCardCallout({ nodeType }: { nodeType: BfNodeTypeAttributes }) {
  return (
    <div className="draggable-node-card-callout">
      <div className="draggable-node-card-callout-title">{nodeType.typeId}</div>
      <div className="draggable-node-card-callout-content">
        <div className="draggable-node-card-callout-section">
          <strong>In Params:</strong>{" "}
          {nodeType.inParams.length > 0 ? nodeType.inParams.map((p) => p.paramName).join(", ") : "None"}
        </div>
        <div className="draggable-node-card-callout-section">
          <strong>Out Params:</strong>{" "}
          {nodeType.outParams.length > 0 ? nodeType.outParams.map((p) => p.paramName).join(", ") : "None"}
        </div>
        <div className="draggable-node-card-callout-section">
          <strong>Out Ports:</strong> {nodeType.outPorts.length > 0 ? nodeType.outPorts.join(", ") : "None"}
        </div>
      </div>
    </div>
  );
}
