import React from "react";
import "./simple-button-with-icon.css";

interface SimpleButtonWithIconProps {
  onClick: () => void;
  buttonName: string;
  icon: React.ReactNode;
  isEnabled?: boolean;
}

export default function SimpleButtonWithIcon({
  onClick,
  buttonName,
  icon,
  isEnabled = true,
}: SimpleButtonWithIconProps) {
  const onClickHandler = () => {
    if (isEnabled) {
      onClick();
    }
  };
  return (
    <button
      className={`simple-button-with-icon ${isEnabled ? "enabled" : ""}`}
      onClick={onClickHandler}
      aria-label={buttonName}
      disabled={!isEnabled}
      tabIndex={0}>
      <span className="icon-container">{icon}</span>
    </button>
  );
}
