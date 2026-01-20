import React from "react";
import "./activity-bar-button.css";

interface ActivityBarButtonProps {
  fullName: string;
  displayName: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export default function ActivityBarButton({
  fullName,
  displayName,
  icon,
  onClick,
  isActive,
}: ActivityBarButtonProps) {
  // Clone the icon element and inject the style for sizing
  const styledIcon = React.cloneElement(icon as React.ReactElement, {
    style: { width: "100%", height: "100%" },
  });

  return (
    <button className={`activity-bar-button ${isActive ? "active" : ""}`} onClick={onClick} title={fullName}>
      <span className="icon-container">{styledIcon}</span>
      <span className="display-name">{displayName}</span>
    </button>
  );
}
