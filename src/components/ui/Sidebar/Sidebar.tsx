import "./sidebar.css";
import React, { useState } from "react";

interface SidebarProps {
  title: string;
  children: React.ReactNode;
  defaultWidth?: number;
}

export default function Sidebar({ title, children, defaultWidth = 250 }: SidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [dragPreviousX, setDragPreviousX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent text selection while dragging
    setIsResizing(true);
    setDragPreviousX(e.clientX);
  };

  const handleDoubleClick = () => {
    setWidth(defaultWidth);
  };

  React.useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isResizing) {
        const newWidth = width + (e.clientX - dragPreviousX);
        setDragPreviousX(e.clientX);
        setWidth(newWidth);
      }
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className={`sidebar-container ${isResizing ? "resizing" : ""}`}>
      <div className="sidebar" style={{ width: width }}>
        <h2 className="title">{title}</h2>
        <div>{children}</div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick} />
    </div>
  );
}
