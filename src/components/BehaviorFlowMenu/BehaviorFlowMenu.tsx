import React from "react";
import "./behavior-flow-menu.css";

export interface MenuItem {
  id: string;
  label: string;
  onClick: () => void;
}

export interface BehaviorFlowMenuProps {
  items?: MenuItem[];
}

const defaultItems: MenuItem[] = [
  {
    id: "new",
    label: "New Project",
    onClick: () => console.log("New Project clicked"),
  },
  {
    id: "open",
    label: "Open Project",
    onClick: () => console.log("Open Project clicked"),
  },
  {
    id: "save",
    label: "Save",
    onClick: () => console.log("Save clicked"),
  },
  {
    id: "export",
    label: "Export",
    onClick: () => console.log("Export clicked"),
  },
];

export default function BehaviorFlowMenu({ items = defaultItems }: BehaviorFlowMenuProps) {
  return (
    <nav className="behavior-flow-menu">
      <ul className="behavior-flow-menu-list">
        {items.map((item) => (
          <li key={item.id}>
            <button className="behavior-flow-menu-item" onClick={item.onClick}>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
