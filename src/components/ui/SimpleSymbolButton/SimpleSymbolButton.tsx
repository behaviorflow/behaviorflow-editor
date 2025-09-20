import React from "react";
import "./simple-symbol-button.css";

interface SimpleSymbolButtonProps {
  onClick: () => void;
  buttonName: string;
  symbol: React.ReactNode;
  isEnabled?: boolean;
}

export default function SimpleSymbolButton({ onClick, buttonName, symbol, isEnabled = true }: SimpleSymbolButtonProps) {
  const onClickHandler = () => {
    if (isEnabled) {
      onClick();
    }
  };
  return (
    <button
      className={`simple-symbol-button ${isEnabled ? "enabled" : ""}`}
      onClick={onClickHandler}
      title={buttonName}
      data-active={isEnabled}>
      <span className="symbol-container">{symbol}</span>
    </button>
  );
}
