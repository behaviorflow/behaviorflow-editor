import Modal from "../ui/Modal/Modal";
import React, { useState } from "react";
import "./new-node-type-modal.css";

interface NewNodeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNodeType: (nodeTypeName: string) => void;
}

const NewNodeTypeModal = ({ isOpen, onClose, onCreateNodeType }: NewNodeTypeModalProps) => {
  const [nodeTypeName, setNodeTypeName] = useState("");

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeTypeName(event.target.value);
  };

  const handleCreate = () => {
    if (nodeTypeName.trim()) {
      onCreateNodeType(nodeTypeName);
      setNodeTypeName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setNodeTypeName("");
    onClose();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleCancel} title="New Node Type">
        <div>
          <label className="field-label">Node Type Name: </label>
          <input
            className="node-type-name-input"
            type="text"
            placeholder="Enter node type name"
            value={nodeTypeName}
            onChange={handleNameInputChange}
          />
        </div>
        <div className="modal-buttons">
          <button className="create-button" onClick={handleCreate} disabled={!nodeTypeName.trim()}>
            Create
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NewNodeTypeModal;
