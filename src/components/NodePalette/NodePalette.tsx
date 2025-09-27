import { useState } from "react";
import DraggableNodeCard from "../DraggableNodeCard/DraggableNodeCard";
import SimpleSymbolButton from "../ui/SimpleSymbolButton/SimpleSymbolButton";
import { BfNodeTypeAttributes } from "../../types";
import { CirclePlus, Wrench, FolderPlus } from "lucide-react";
import "./node-palette.css";

import NewNodeTypeModal from "../NewNodeTypeModal/NewNodeTypeModal";

export interface NodePaletteProps {
  nodeTypes: BfNodeTypeAttributes[];
}

export default function NodePalette({ nodeTypes }: NodePaletteProps) {
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
      {nodeTypes.map((node) => (
        <div key={node.typeId} className="node-palette-item" onClick={() => handleItemClick(node.typeId)}>
          <DraggableNodeCard nodeType={node} isSelected={activeItem == node.typeId} />
        </div>
      ))}
      <NewNodeTypeModal isOpen={isNewNodeTypeModalOpen} onClose={() => setIsNewNodeTypeModalOpen(false)} />
    </div>
  );
}
