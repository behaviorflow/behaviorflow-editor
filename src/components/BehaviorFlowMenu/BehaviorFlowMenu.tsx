import "./behavior-flow-menu.css";

export interface MenuItem {
  label: string;
  onClick: () => void;
  children?: React.ReactNode;
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
            {item.children && <div>{item.children}</div>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
