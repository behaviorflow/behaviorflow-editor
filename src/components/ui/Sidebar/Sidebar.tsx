import "./sidebar.css";
import React, { useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";

interface SidebarProps {
  title: string;
  children: React.ReactNode;
  closeSidebarHandler: () => void;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export default function Sidebar({ title, children, closeSidebarHandler, defaultWidth = 250, minWidth = 100, maxWidth = 600 }: SidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [dragPreviousX, setDragPreviousX] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent text selection while dragging
    setIsResizing(true);
    setDragPreviousX(e.clientX);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = width + (e.clientX - dragPreviousX);
        if (newWidth <= minWidth && e.clientX < dragPreviousX) return;
        if (newWidth >= maxWidth && e.clientX > dragPreviousX) return;
        setDragPreviousX(e.clientX);
        setWidth(newWidth);
      }
    },
    [isResizing, dragPreviousX]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className={`sidebar-container ${isResizing ? "resizing" : ""}`}>
      <div className="sidebar" style={{ width: width }}>
        <div className="title-container">
          <h2 className="title">{title}</h2>
          <div className="close-button" onClick={closeSidebarHandler}>
            <ChevronLeft size={18} />
          </div>
        </div>
        <div className="sidebar-children">{children}</div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick} />
    </div>
  );
}
