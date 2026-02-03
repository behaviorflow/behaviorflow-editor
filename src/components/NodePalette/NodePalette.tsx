import { useState, useEffect, useRef, useMemo } from "react";
import DraggableNodeCard from "../DraggableNodeCard/DraggableNodeCard";
import SimpleButtonWithIcon from "../ui/SimpleButtonWithIcon/SimpleButtonWithIcon";
import { BfNodeTypeAttributes, BfNodeTypeCategory, ResultWithErrorMsgs } from "../../types";
import { useNodeTypesContext } from "../../contexts";
import { Plus, Trash2 } from "lucide-react";
import "./node-palette.css";

import NewNodeTypeModal from "../NewNodeTypeModal/NewNodeTypeModal";

export default function NodePalette() {
  const { getOrderedNodeTypes, addNodeType, deleteNodeType } = useNodeTypesContext();
  const [activeItem, setActiveItem] = useState<BfNodeTypeAttributes | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewNodeTypeModalOpen, setIsNewNodeTypeModalOpen] = useState(false);
  const nodePaletteRef = useRef<HTMLDivElement>(null);
  const nodeTypes = getOrderedNodeTypes();
  const filteredNodeTypes = useMemo(() => filterNodeTypes(nodeTypes, { searchTerm }), [nodeTypes, searchTerm]);
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

  // Attempts to add a new node type.
  const newNodeTypeCallback = (
    nodeTypeName: string,
    outPorts: string[],
    category: BfNodeTypeCategory,
  ): ResultWithErrorMsgs => {
    const newNodeType: BfNodeTypeAttributes = {
      typeId: nodeTypeName,
      inParams: [],
      outParams: [],
      outPorts: outPorts,
      isReadOnly: false,
      category: category,
    };
    return addNodeType(newNodeType);
  };

  return (
    <div className="node-palette" onClick={handleBackgroundClick} ref={nodePaletteRef}>
      <div className="node-palette-controls">
        <SimpleButtonWithIcon
          onClick={() => setIsNewNodeTypeModalOpen(true)}
          buttonName="New Node Type"
          icon={<Plus />}
        />
        <SimpleButtonWithIcon
          onClick={() => {
            if (isEditableNodeSelected) {
              deleteNodeType(activeItem.typeId);
              setActiveItem(null);
            }
          }}
          buttonName="Delete Node Type"
          icon={<Trash2 />}
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
        {filteredNodeTypes.length === 0 && searchTerm.trim() !== "" ? (
          <div className="node-palette-no-results">No matching nodes found</div>
        ) : (
          filteredNodeTypes.map((nodeType) => (
            <div key={nodeType.typeId} className="node-palette-item" onClick={() => handleItemClick(nodeType)}>
              <DraggableNodeCard
                nodeType={nodeType}
                isReadOnly={nodeType.isReadOnly}
                isSelected={activeItem?.typeId === nodeType.typeId}
              />
            </div>
          ))
        )}
      </div>
      <NewNodeTypeModal
        isOpen={isNewNodeTypeModalOpen}
        onClose={() => setIsNewNodeTypeModalOpen(false)}
        onCreateNodeType={newNodeTypeCallback}
      />
    </div>
  );
}

interface NodeTypeFilterCriteria {
  searchTerm?: string;
}

function filterNodeTypes(nodeTypes: BfNodeTypeAttributes[], criteria: NodeTypeFilterCriteria): BfNodeTypeAttributes[] {
  return nodeTypes.filter((nodeType) => {
    if (!criteria.searchTerm?.trim()) {
      return true;
    }
    const term = criteria.searchTerm.toLowerCase();
    return nodeType.typeId.toLowerCase().includes(term);
  });
}
