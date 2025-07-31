import React, { useState } from "react";
import { GripVertical } from "lucide-react";

export default function DraggableNodeCard({ nodeType, nodeAttributes }) {
  const [isHovered, setIsHovered] = useState(false);
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
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseUp = (e) => {
    e.currentTarget.style.cursor = "grab";
  };
  const elementStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: isHovered ? "navy" : "white",
    color: isHovered ? "white" : "black",
    padding: "0.14em",
    border: "0.1em solid",
    borderColor: "black",
    // borderRadius: "0.85em",
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
        {/* <GripVertical style={{ width: '1.6em', height: '1.6em', color: 'gray', verticalAlign: 'middle' }} /> */}
        <span
          style={{
            fontWeight: "medium",
            fontSize: "0.9em",
            paddingLeft: "0.1em",
            verticalAlign: "middle",
          }}>
          {nodeType}
        </span>
      </div>
    </div>
  );
}
