import { useState, useEffect, useRef } from "react";
import DraggableNodeCard from "../DraggableNodeCard/DraggableNodeCard";
import SimpleSymbolButton from "../ui/SimpleSymbolButton/SimpleSymbolButton";
import { BfNodeTypeAttributes, BfNodeTypeCategory } from "../../types";
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
  const [activeItem, setActiveItem] = useState<BfNodeTypeAttributes | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewNodeTypeModalOpen, setIsNewNodeTypeModalOpen] = useState(false);
  const nodePaletteRef = useRef<HTMLDivElement>(null);
  const nodeTypes = getOrderedNodeTypes();
  const isEditableNodeSelected = activeItem != null && !activeItem.isReadOnly;

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

  const handleItemClick = (nodeType: BfNodeTypeAttributes) => {
    setActiveItem(nodeType);
  };
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setActiveItem(null);
    }
  };


  // Attempts to add a new node type. Returns [success, errorString].
  const newNodeTypeCallback = (
    nodeTypeName: string,
    outPorts: string[],
    category: BfNodeTypeCategory
  ): [boolean, string] => {
    if (nodeTypeName.trim() !== nodeTypeName) {
      return [false, "Node type names cannot have leading or trailing whitespace."];
    }
    if (nodeTypeName.length < 3 || nodeTypeName.length > 64) {
      return [false, "Node type names must be between 3 and 64 characters."];
    }
    if (!/^[\p{L}\p{N}_ ]+$/u.test(nodeTypeName)) {
      return [false, "Node type names can only contain letters, numbers, underscores, and spaces."];
    }
    const existing = nodeTypes.find((nt) => nt.typeId.toLowerCase() === nodeTypeName.toLowerCase());
    if (existing) {
      return [false, "A node type named '" + existing.typeId + "' already exists."];
    }
    // Consder whether special nodes names like "Start" would be an issue if repeated
    const newNodeType: BfNodeTypeAttributes = {
      typeId: nodeTypeName,
      inParams: [],
      outParams: [],
      outPorts: outPorts,
      isReadOnly: false,
      category: category,
    };
    addNodeType(newNodeType);
    return [true, ""];
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
            if (isEditableNodeSelected) {
              // TODO: Implement edit modal
              console.log("Edit node type:", activeItem.typeId);
            }
          }}
          buttonName="Edit Node Type"
          symbol={<Wrench />}
          isEnabled={isEditableNodeSelected}
        />
        <SimpleSymbolButton
          onClick={() => {
            if (isEditableNodeSelected) {
              deleteNodeType(activeItem.typeId);
              setActiveItem(null);
            }
          }}
          buttonName="Delete Node Type"
          symbol={<Trash2 />}
          isEnabled={isEditableNodeSelected}
        />
      </div>
      <input
        className="node-palette-search"
        type="text"
        placeholder="Filter nodes..."
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      <div className="node-palette-list">
        {nodeTypes.map((nodeType) => (
          <div key={nodeType.typeId} className="node-palette-item" onClick={() => handleItemClick(nodeType)}>
            <DraggableNodeCard
              nodeType={nodeType}
              isReadOnly={nodeType.isReadOnly}
              isSelected={activeItem?.typeId === nodeType.typeId}
            />
          </div>
        ))}
      </div>
      <NewNodeTypeModal
        isOpen={isNewNodeTypeModalOpen}
        onClose={() => setIsNewNodeTypeModalOpen(false)}
        onCreateNodeType={newNodeTypeCallback}
      />
    </div>
  );
}
