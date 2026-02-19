import Modal from "../ui/Modal/Modal";
import "./export-graph-modal.css";
import React, { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";

interface ExportGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportGraph: (fileName: string) => void;
}

const DEFAULT_FILE_NAME = "behavior-flow-graph.json";
const ExportGraphModal = ({ isOpen, onClose, onExportGraph }: ExportGraphModalProps) => {
  const [fileName, setFileName] = useLocalStorage("exportFileName", DEFAULT_FILE_NAME);
  const inputRef = useRef<HTMLInputElement>(null);
  // Select input text when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const value = inputRef.current.value;
          const ext = ".json";
          const extIndex = value.endsWith(ext) ? value.length - ext.length : value.length;
          inputRef.current.setSelectionRange(0, extIndex);
        }
      }, 0);
    }
  }, [isOpen]);

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const [error, setError] = useState("");

  const resetAndExit = () => {
    setError("");
    onClose();
  };

  const handleExport = () => {
    if (fileName.trim()) {
      onExportGraph(fileName);
      resetAndExit();
    } else {
      setError("Empty file name.");
    }
  };

  const handleCancel = () => {
    resetAndExit();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleCancel} title="Export Graph as JSON">
        <div>
          <label className="modal-field-label">File Name: </label>
          <input
            className="modal-input"
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={handleNameInputChange}
            ref={inputRef}
          />
        </div>
        {error && <div className="modal-error-message">{error}</div>}
        <div className="modal-buttons">
          <button onClick={handleExport} disabled={!fileName.trim()}>
            Export
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ExportGraphModal;
