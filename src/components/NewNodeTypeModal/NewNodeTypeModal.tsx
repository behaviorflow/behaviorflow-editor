import Modal from "../ui/Modal/Modal";
import "../ui/Modal/modal.css";
import RadioGroup, { RadioOption } from "../ui/RadioGroup/RadioGroup";
import React, { useState } from "react";
import { CircleX } from "lucide-react";
import "./new-node-type-modal.css";
import { BfNodeTypeCategory, ResultWithErrorMsgs } from "../../types";

interface NewNodeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNodeType: (nodeTypeName: string, outPorts: string[], category: BfNodeTypeCategory) => ResultWithErrorMsgs;
}

interface CategoryConfig {
  id: string;
  label: string;
  outPorts: string[];
  category: BfNodeTypeCategory;
}

const CategoryConfigs: CategoryConfig[] = [
  { id: "Simple", label: "Simple", outPorts: [""], category: BfNodeTypeCategory.Simple },
  { id: "Boolean", label: "Boolean (True/False)", outPorts: ["True", "False"], category: BfNodeTypeCategory.Condition },
  {
    id: "Action",
    label: "Action (Success/Failure)",
    outPorts: ["Success", "Failure"],
    category: BfNodeTypeCategory.Action,
  },
]; // todo: These should be more global designators for coloring, etc.

const DefaultCategory = CategoryConfigs[0];

const NewNodeTypeModal = ({ isOpen, onClose, onCreateNodeType }: NewNodeTypeModalProps) => {
  const [nodeTypeName, setNodeTypeName] = useState("");
  const [nodeCategoryId, setNodeCategoryId] = useState(DefaultCategory.id);

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeTypeName(event.target.value);
  };

  const [errors, setErrors] = useState<string[]>([]);

  const resetAndExit = () => {
    setNodeTypeName("");
    setNodeCategoryId(DefaultCategory.id);
    setErrors([]);
    onClose();
  };

  const handleCreate = () => {
    if (nodeTypeName.trim()) {
      const category = CategoryConfigs.find((c) => c.id === nodeCategoryId) || DefaultCategory;
      const result = onCreateNodeType(nodeTypeName, category.outPorts, category.category);
      if (result.success) {
        resetAndExit();
      } else {
        setErrors(result.errors.length > 0 ? result.errors : ["Failed to create node type."]);
      }
    }
  };

  const handleCancel = () => {
    resetAndExit();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleCancel} title="New Node Type">
        <div>
          <label className="modal-field-label">Node Type Name: </label>
          <input
            className="modal-input"
            type="text"
            placeholder="Enter node type name"
            value={nodeTypeName}
            onChange={handleNameInputChange}
          />
        </div>
        <RadioGroup
          label="Category:"
          name="nodeCategory"
          options={CategoryConfigs.map((c) => ({ value: c.id, label: c.label }))}
          value={nodeCategoryId}
          onChange={setNodeCategoryId}
        />
        {errors.length > 0 && (
          <div>
            {errors.map((e) => (
              <div className="modal-error-message" key={e}>
                <CircleX size={14.5} /> {e}
              </div>
            ))}
          </div>
        )}
        <div className="modal-buttons">
          <button onClick={handleCreate} disabled={!nodeTypeName.trim()}>
            Create
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default NewNodeTypeModal;
