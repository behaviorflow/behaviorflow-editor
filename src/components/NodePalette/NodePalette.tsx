import { useState } from "react";
import DraggableNodeCard from "../DraggableNodeCard/DraggableNodeCard";
import SimpleSymbolButton from "../ui/SimpleSymbolButton/SimpleSymbolButton";
import { BfNodeAttributes } from "../../types";
import { CirclePlus, Wrench, FolderPlus } from "lucide-react";
import "./node-palette.css";

import NewNodeTypeModal from "../NewNodeTypeModal/NewNodeTypeModal";

export interface NodePaletteProps {
  nodes: BfNodeAttributes[];
}

export default function NodePalette({ nodes }: NodePaletteProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewNodeTypeModalOpen, setIsNewNodeTypeModalOpen] = useState(false);

  const handleItemClick = (nodeType: string) => {
    setActiveItem(nodeType);
  };
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <div className="node-palette-controls">
        <SimpleSymbolButton
          onClick={() => setIsNewNodeTypeModalOpen(true)}
          buttonName="New Node Type"
          symbol={<CirclePlus />}
        />
        <SimpleSymbolButton
          onClick={() => console.log("Button clicked")}
          buttonName="New Node Group"
          symbol={<FolderPlus />}
        />
        <SimpleSymbolButton
          onClick={() => console.log("Button clicked")}
          buttonName="Edit Node Type"
          symbol={<Wrench />}
          isEnabled={activeItem != null}
        />
      </div>
      <input
        className="node-palette-search"
        type="text"
        placeholder="Filter nodes..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      {nodes.map((node) => (
        <div key={node.nodeType} className="node-palette-item" onClick={() => handleItemClick(node.nodeType)}>
          <DraggableNodeCard nodeType={node.nodeType} nodeAttributes={node} isSelected={activeItem == node.nodeType} />
        </div>
      ))}
      <NewNodeTypeModal isOpen={isNewNodeTypeModalOpen} onClose={() => setIsNewNodeTypeModalOpen(false)} />
    </div>
  );
}
