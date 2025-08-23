import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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

  const bodyStyle = {
    padding: "16px",
  };

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          transition: "opacity 0.2s",
        }}
        onClick={onClose}
      />

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          maxWidth: "448px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}>
        <
          div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
          }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              margin: 0,
            }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: "4px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );

  // Render modal content into document.body using portal
  return createPortal(modalContent, document.body);
};

export default Modal;
