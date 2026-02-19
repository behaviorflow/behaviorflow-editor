import Modal from "../ui/Modal/Modal";
import "./export-graph-modal.css";
import React, { useState, useRef, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { ResultWithErrorMsgs } from "../../types";
import ErrorList from "../ui/ErrorList/ErrorList";

interface ExportGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportGraph: (fileName: string) => ResultWithErrorMsgs;
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

  const [errors, setErrors] = useState<string[]>([]);

  const resetAndExit = () => {
    setErrors([]);
    onClose();
  };

  const handleExport = () => {
    if (fileName.trim()) {
      const result = onExportGraph(fileName);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      resetAndExit();
    } else {
      setErrors(["Empty file name."]);
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
        {/* todo: it would be more useful in the advent of graph-related errors, to close the modal and display the errors in a banner or roll-down at the top (or bottom) of the graph editor */}
        <div className="error-list-container">{errors.length > 0 && <ErrorList errors={errors} />}</div>
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
