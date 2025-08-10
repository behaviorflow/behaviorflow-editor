import React, { useState } from "react";
import { GripVertical } from "lucide-react";
import { BfNodeAttributes } from "../types";

interface DraggableNodeCardProps {
  nodeType: string;
  nodeAttributes: BfNodeAttributes;
  isSelected?: boolean;
}

export default function DraggableNodeCard({ nodeType, nodeAttributes, isSelected = false }: DraggableNodeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
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
    </div>
  );
}
