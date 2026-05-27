import Modal from "../ui/Modal/Modal";
import "../ui/Modal/modal.css";
import RadioGroup, { RadioOption } from "../ui/RadioGroup/RadioGroup";
import React, { useState } from "react";
import ErrorList from "../ui/ErrorList/ErrorList";
import "./new-node-type-modal.css";
import { ResultWithErrorMsgs } from "../../types";
import { ResultTypeSets } from "../../constants";

interface NewNodeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNodeType: (nodeTypeId: string, resultIds: string[]) => ResultWithErrorMsgs;
}

interface CategoryConfig {
  id: string;
  label: string;
  resultIds: string[];
}

const CategoryConfigs: CategoryConfig[] = [
  { id: "Simple", label: "Simple Process", resultIds: ResultTypeSets.Simple },
  { id: "Decision", label: "Decision (Yes/No)", resultIds: ResultTypeSets.Decision },
];

const DefaultCategory = CategoryConfigs[0];

const NewNodeTypeModal = ({ isOpen, onClose, onCreateNodeType }: NewNodeTypeModalProps) => {
  const [nodeTypeId, setNodeTypeId] = useState("");
  const [nodeCategoryId, setNodeCategoryId] = useState(DefaultCategory.id);

  const handleIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeTypeId(event.target.value);
  };

  const [errors, setErrors] = useState<string[]>([]);

  const resetAndExit = () => {
    setNodeTypeId("");
    setNodeCategoryId(DefaultCategory.id);
    setErrors([]);
    onClose();
  };

  const handleCreate = () => {
    if (nodeTypeId.trim()) {
      const category = CategoryConfigs.find((c) => c.id === nodeCategoryId) || DefaultCategory;
      const result = onCreateNodeType(nodeTypeId, category.resultIds);
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
        <div className="modal-section">
          <label className="modal-field-label">Node Type ID: </label>
          <input
            className="modal-input"
            type="text"
            placeholder="Enter node type ID"
            value={nodeTypeId}
            onChange={handleIdInputChange}
          />
        </div>
        <div className="modal-section">
          <label className="modal-field-label">Category: </label>
          <RadioGroup
            name="nodeCategory"
            options={CategoryConfigs.map((c) => ({ value: c.id, label: c.label }))}
            value={nodeCategoryId}
            onChange={setNodeCategoryId}
          />
        </div>
        <div className="modal-section">{errors.length > 0 && <ErrorList errors={errors} />}</div>
        <div className="modal-buttons">
          <button onClick={handleCreate} disabled={!nodeTypeId.trim()}>
            Create
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default NewNodeTypeModal;
