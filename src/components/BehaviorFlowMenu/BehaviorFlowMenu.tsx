import "./behavior-flow-menu.css";

export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface BehaviorFlowMenuProps {
  menuItems: MenuItem[];
}

export default function BehaviorFlowMenu({ menuItems }: BehaviorFlowMenuProps) {
  return (
    <nav className="behavior-flow-menu">
      <ul className="behavior-flow-menu-list">
        {menuItems.map((item) => (
          <li key={item.label}>
            <button className="behavior-flow-menu-item" onClick={item.onClick}>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
