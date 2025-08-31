import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./modal.css";

// Portal-based Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  // Close modal on Escape key and manage body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal">
      <div className="backdrop" onClick={onClose} />
      <div className="modal-window">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-button">
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  // Render modal content into document.body using portal
  return createPortal(modalContent, document.body);
};

export default Modal;
