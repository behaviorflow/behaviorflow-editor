import React, { useState, useEffect, useCallback } from "react";
import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import Modal from "../ui/Modal/Modal";
import ErrorList from "../ui/ErrorList/ErrorList";
import { importGraphFromJsonFile } from "../../utils";
import { BfNodeTypeAttributes, ResultWithErrorMsgs } from "../../types";
import "./import-graph-modal.css";

interface ImportGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateGraph: (
    nodes: ReactFlowNode[],
    edges: ReactFlowEdge[],
    start_node_id: string,
    nodeTypes: BfNodeTypeAttributes[],
  ) => ResultWithErrorMsgs;
  promptConfirmation?: boolean; // Whether to show the user query modal warning about overwriting existing graph and node types. Defaults to true.
}

enum GraphImportState {
  Inactive,
  Importing,
  PromptConfirmation,
  Error,
}

export default function ImportGraphModal({
  isOpen,
  onClose,
  updateGraph,
  promptConfirmation = true,
}: ImportGraphModalProps) {
  const [errorData, setErrorData] = useState<{ errors: string[] }>({ errors: [] });
  const [importState, setImportState] = useState<GraphImportState>(GraphImportState.Inactive);
  const [pendingImport, setPendingImport] = useState<{
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
    start_node_id: string | null;
    nodeTypes: BfNodeTypeAttributes[];
    filename?: string;
  } | null>(null);

  const resetAndExit = useCallback(() => {
    setErrorData({ errors: [] });
    setImportState(GraphImportState.Inactive);
    setPendingImport(null);
    onClose();
  }, [onClose]);

  const setError = (errors: string[]) => {
    setErrorData({ errors });
    setImportState(GraphImportState.Error);
  };

  useEffect(() => {
    // Run whenever opening
    if (!isOpen) return;
    let cancelled = false;
    setImportState(GraphImportState.Importing);
    importGraphFromJsonFile().then(({ result, nodes, edges, start_node_id, nodeTypes, filename }) => {
      if (cancelled) return;
      let nodeTypesArr = nodeTypes instanceof Map ? Array.from(nodeTypes.values()) : nodeTypes;
      setPendingImport({ nodes, edges, nodeTypes: nodeTypesArr, start_node_id, filename });
      if (!result.success) {
        setError(result.errors);
        return;
      }
      setImportState(GraphImportState.PromptConfirmation);
    }); // no need to catch, handled in the function
    return () => {
      // If isOpen becomes false before the import finishes, this will be set to true, and the output of the import will be ignored
      cancelled = true;
    };
  }, [isOpen]);

  const handleImport = useCallback(() => {
    if (!pendingImport) return;
    const result = updateGraph(pendingImport.nodes || [], pendingImport.edges || [], pendingImport.start_node_id || "", pendingImport.nodeTypes || []);
    if (!result.success) {
      setError(result.errors);
      return;
    }
    resetAndExit();
  }, [pendingImport, updateGraph, resetAndExit]);

  // If promptConfirmation is false and we reach PromptConfirmation state, auto-import as if user pressed Yes
  useEffect(() => {
    if (isOpen && importState === GraphImportState.PromptConfirmation && !promptConfirmation && pendingImport) {
      handleImport();
    }
  }, [isOpen, importState, promptConfirmation, pendingImport, handleImport]);

  return (
    <div>
      <ErrorImportingGraphModal
        isOpen={importState === GraphImportState.Error}
        onClose={resetAndExit}
        errors={errorData?.errors || []}
        filename={pendingImport?.filename}
      />
      {promptConfirmation && (
        <PromptConfirmationModal
          isOpen={importState === GraphImportState.PromptConfirmation}
          onClose={resetAndExit}
          onImport={handleImport}
          filename={pendingImport?.filename}
        />
      )}
    </div>
  );
}

function ErrorImportingGraphModal({
  isOpen,
  onClose,
  errors,
  filename,
}: {
  isOpen: boolean;
  onClose: () => void;
  errors: string[];
  filename?: string;
}) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} title={`Failed to import graph from '${filename || ""}'`}>
        <ErrorList errors={errors} />
      </Modal>
    </div>
  );
}

function PromptConfirmationModal({
  isOpen,
  onClose,
  onImport,
  filename,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  filename?: string;
}) {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Import '${filename || "unknown file"}'? Your existing graph and node types will be overwritten.`}>
        <div className="modal-buttons">
          <button
            onClick={() => {
              onImport();
            }}>
            Yes
          </button>
          <button
            onClick={() => {
              onClose();
            }}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
