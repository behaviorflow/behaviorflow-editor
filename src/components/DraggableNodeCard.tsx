import React, { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { BfNodeAttributes } from "../types";
import { BehaviorFlowNode } from "../nodes/BehaviorFlowNode";

interface DraggableNodeCardProps {
  nodeType: string;
  nodeAttributes: BfNodeAttributes;
  isSelected?: boolean;
}

export default function DraggableNodeCard({ nodeType, nodeAttributes, isSelected = false }: DraggableNodeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  const calloutTimer = useRef<number | null>(null);
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify(nodeAttributes));
    e.currentTarget.style.cursor = "grabbing";
  };
  const handleDragEnd = (e) => {
    e.currentTarget.style.cursor = "grab";
  };
  const handleDrag = (e) => {
    e.currentTarget.style.cursor = "grabbing";
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    calloutTimer.current = window.setTimeout(() => {
      setShowCallout(true);
    }, 1000);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (calloutTimer.current) {
      window.clearTimeout(calloutTimer.current);
    }
    setShowCallout(false);
  };
  const handleMouseUp = (e) => {
    e.currentTarget.style.cursor = "grab";
  };
  const elementStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: isSelected ? "#6f8a91ff" : isHovered ? "#757575ff" : "#8d8d8dff", // todo: bad
    border: isSelected? "0.08em solid #0c6b88ff" : "none",
    borderRadius: "0.25em",
    color: "black",
    padding: "0.14em",
    // border: "0.1em solid",
    borderColor: "black",
    cursor: "grab",
  };

  // onMouseDown={(e) => {e.currentTarget.style.cursor = 'grabbing';}}
  return (
    <div>
      <div
        style={elementStyle}
        draggable={true}
        onDragStart={handleDragStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}>
        <GripVertical style={{ width: '1.0em', height: '1.0em', color: 'black', verticalAlign: 'middle' }} />
        <span
          style={{
            fontWeight: "normal",
            fontSize: "0.9em",
            paddingLeft: "0.1em",
            verticalAlign: "middle",
          }}>
          {nodeType}
        </span>
      </div>
      {showCallout && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            marginTop: "5px",
            width: "200px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
          }}>
          <strong>{nodeType}</strong>
          <div style={{ marginTop: "5px", fontSize: "0.9em" }}>
            <div><strong>In Params:</strong> {nodeAttributes.inParams.length > 0 ? nodeAttributes.inParams.map((p) => p.paramName).join(", ") : "None"}</div>
            <div><strong>Out Params:</strong> {nodeAttributes.outParams.length > 0 ? nodeAttributes.outParams.map((p) => p.paramName).join(", ") : "None"}</div>
            <div><strong>Out Ports:</strong> {nodeAttributes.outPorts.length > 0 ? nodeAttributes.outPorts.join(", ") : "None"}</div>
            {/* <BehaviorFlowNode> nodeId=nodeAttributes.nodeId, nodeType, inParams, outParams, outPorts </BehaviorFlowNode> */}
          </div>
        </div>
      )}
    </div>
  );
}
