import React, { useState } from "react";

interface SidebarButtonProps {
  onClick: () => void;
  buttonName: string;
  symbol: React.ReactNode;
  isActive?: boolean;
}

export default function SidebarButton({ onClick, buttonName, symbol, isActive = true }: SidebarButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const onClickHandler = () => {
    if (isActive) {
      onClick();
    }
  }
  return (
    <button
      style={{
        width: "30px",
        height: "30px",
        backgroundColor: isHovered && isActive ? "#7b7b7bff" : "#8d8d8dff", // todo: bad
        color: isActive ? "#181818ff" : "#636363ff",
        border: "none",
        // border: "0.1em solid",
        // borderRadius: "0.25em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        padding: "0",
      }}
      onClick={onClickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={buttonName}>
      {React.isValidElement(symbol)
        ? React.cloneElement(symbol as React.ReactElement, { size: 18 })
        : symbol}
    </button>
  );
}
