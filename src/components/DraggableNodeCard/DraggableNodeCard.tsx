import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { BfNodeAttributes } from "../../types";
import { BehaviorFlowNode } from "../nodes/BehaviorFlowNode";
import "./draggable-node-card.css";

interface DraggableNodeCardProps {
  nodeType: string;
  nodeAttributes: BfNodeAttributes;
  isSelected?: boolean;
}

export default function DraggableNodeCard({ nodeType, nodeAttributes, isSelected = false }: DraggableNodeCardProps) {
  const [showCallout, setShowCallout] = useState(false);
  const calloutTimer = useRef<number | null>(null);
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify(nodeAttributes));
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
        <span className="draggable-node-card-text">{nodeType}</span>
      </div>
      {showCallout && (
        <div className="draggable-node-card-callout">
          <div className="draggable-node-card-callout-title">{nodeType}</div>
          <div className="draggable-node-card-callout-content">
            <div className="draggable-node-card-callout-section">
              <strong>In Params:</strong>{" "}
              {nodeAttributes.inParams.length > 0 ? nodeAttributes.inParams.map((p) => p.paramName).join(", ") : "None"}
            </div>
            <div className="draggable-node-card-callout-section">
              <strong>Out Params:</strong>{" "}
              {nodeAttributes.outParams.length > 0
                ? nodeAttributes.outParams.map((p) => p.paramName).join(", ")
                : "None"}
            </div>
            <div className="draggable-node-card-callout-section">
              <strong>Out Ports:</strong>{" "}
              {nodeAttributes.outPorts.length > 0 ? nodeAttributes.outPorts.join(", ") : "None"}
            </div>
            {/* <BehaviorFlowNode> nodeId=nodeAttributes.nodeId, nodeType, inParams, outParams, outPorts </BehaviorFlowNode> */}
          </div>
        </div>
      )}
    </div>
  );
}
