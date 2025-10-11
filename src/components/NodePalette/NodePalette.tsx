import { useState, useEffect, useRef } from "react";
import DraggableNodeCard from "../DraggableNodeCard/DraggableNodeCard";
import SimpleSymbolButton from "../ui/SimpleSymbolButton/SimpleSymbolButton";
import { BfNodeTypeAttributes } from "../../types";
import { CirclePlus, Wrench, FolderPlus, Trash2 } from "lucide-react";
import "./node-palette.css";

import NewNodeTypeModal from "../NewNodeTypeModal/NewNodeTypeModal";

export interface NodePaletteProps {
  getOrderedNodeTypes: (
    orderingFn?: (a: BfNodeTypeAttributes, b: BfNodeTypeAttributes) => number
  ) => BfNodeTypeAttributes[];
  addNodeType: (nodeType: BfNodeTypeAttributes) => void;
  deleteNodeType: (nodeTypeId: string) => void;
  editNodeType: (nodeTypeId: string, editedNodeType: BfNodeTypeAttributes) => void;
}

export default function NodePalette({
  getOrderedNodeTypes,
  addNodeType,
  deleteNodeType,
  editNodeType,
}: NodePaletteProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewNodeTypeModalOpen, setIsNewNodeTypeModalOpen] = useState(false);
  const nodePaletteRef = useRef<HTMLDivElement>(null);
  const nodeTypes = getOrderedNodeTypes();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodePaletteRef.current && !nodePaletteRef.current.contains(event.target as Node)) {
        setActiveItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (nodeType: string) => {
    setActiveItem(nodeType);
  };
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Only deselect if clicking directly on the node-palette div
    if (event.target === event.currentTarget) {
      setActiveItem(null);
    }
  };

  return (
    <div className="node-palette" onClick={handleBackgroundClick} ref={nodePaletteRef}>
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
          onClick={() => {
            if (activeItem) {
              // TODO: Implement edit modal
              console.log("Edit node type:", activeItem);
            }
          }}
          buttonName="Edit Node Type"
          symbol={<Wrench />}
          isEnabled={activeItem != null}
        />
        <SimpleSymbolButton
          onClick={() => {
            if (activeItem) {
              deleteNodeType(activeItem);
              setActiveItem(null);
            }
          }}
          buttonName="Delete Node Type"
          symbol={<Trash2 />}
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
      {nodeTypes.map((nodeType) => (
        <div key={nodeType.typeId} className="node-palette-item" onClick={() => handleItemClick(nodeType.typeId)}>
          <DraggableNodeCard nodeType={nodeType} isSelected={activeItem == nodeType.typeId} />
        </div>
      ))}
      <NewNodeTypeModal isOpen={isNewNodeTypeModalOpen} onClose={() => setIsNewNodeTypeModalOpen(false)} />
    </div>
  );
}
