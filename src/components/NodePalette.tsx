import React, { useState } from "react";
import DraggableNodeCard from "./DraggableNodeCard";
import SidebarButton from "./SidebarButton";
import { BfNodeAttributes } from "../types";
import { CirclePlus, Wrench, FolderPlus } from "lucide-react";

interface NodePaletteProps {
  //   onDragEnd: (event: React.DragEvent, nodeAttributes: BfNodeAttributes) => void;
  nodes: BfNodeAttributes[];
}

export default function NodePalette({ nodes }: NodePaletteProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleItemClick = (nodeType: string) => {
    setActiveItem(nodeType);
  };
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div
      style={{
        width: "300px",
        height: "100vh",
        backgroundColor: "#8d8d8dff",
        borderRight: "1px solid #ddd",
        padding: "10px",
      }}>
      <h2 style={{ textAlign: "left", marginBottom: "5px", padding: "5px", color: "#151515ff" }}>Node Pallette</h2>
      <div style={{ textAlign: "center", marginBottom: "10px", alignItems: "center", display: "flex", gap: "0.2em" }}>
        <SidebarButton
          onClick={() => console.log("Button clicked")}
          buttonName="New Node Type"
          symbol={<CirclePlus />}></SidebarButton>
        <SidebarButton
          onClick={() => console.log("Button clicked")}
          buttonName="New Node Group"
          symbol={<FolderPlus />}></SidebarButton>
        <SidebarButton
          onClick={() => console.log("Button clicked")}
          buttonName="Edit Node Type"
          symbol={<Wrench />}
          isActive={activeItem != null}
        />
      </div>
      <input
        style={{ backgroundColor: "white", width: "90%", marginBottom: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc", color: " black" }}
        type="text"
        placeholder="Filter nodes..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      {nodes.map((node) => (
        <div key={node.nodeType} style={{ textAlign: "left" }} onClick={() => handleItemClick(node.nodeType)}>
          <DraggableNodeCard nodeType={node.nodeType} nodeAttributes={node} isSelected={activeItem == node.nodeType} />
        </div>
      ))}
    </div>
  );
}
