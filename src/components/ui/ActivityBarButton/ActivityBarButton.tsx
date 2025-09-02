import React from "react";
import "./activity-bar-button.css";

interface ActivityBarButtonProps {
  fullName: string;
  displayName: string;
  symbol: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export default function ActivityBarButton({
  fullName,
  displayName,
  symbol,
  onClick,
  isActive,
}: ActivityBarButtonProps) {
  // Clone the symbol element and inject the style for sizing
  const styledSymbol = React.cloneElement(symbol as React.ReactElement, {
    style: { width: "100%", height: "100%" },
  });

  return (
    <button className={`activity-bar-button ${isActive ? "active" : ""}`} onClick={onClick} title={fullName}>
      <span className="symbol-container">{styledSymbol}</span>
      <span className="display-name">{displayName}</span>
    </button>
  );
}
