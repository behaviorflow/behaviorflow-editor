import "./activity-bar.css";
import ActivityBarButton from "../ActivityBarButton/ActivityBarButton.tsx";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar.tsx";

interface ActivityBarItem {
  itemName: string;
  nameDisplay: string;
  symbol: React.ReactNode;
  content: React.ReactNode;
}

export interface ActivityBarProps {
  activityBarItems: ActivityBarItem[];
}

export default function ActivityBar({ activityBarItems }: ActivityBarProps) {
  const [activeItemName, setActiveItemName] = useState<string | null>(null);

  const onClickCallback = (item: ActivityBarItem) => {
    if (activeItemName === item.itemName) {
      setActiveItemName(null);
    } else {
      setActiveItemName(item.itemName);
    }
  };

  const activeItem = activeItemName ? activityBarItems.find((item) => item.itemName === activeItemName) : null;

  return (
    <div className="activity-bar-container">
      <div className="activity-bar">
        {activityBarItems.map((item) => (
          <ActivityBarButton
            key={item.itemName}
            fullName={item.itemName}
            displayName={item.nameDisplay}
            symbol={item.symbol}
            onClick={() => onClickCallback(item)}
            isActive={activeItemName === item.itemName}
          />
        ))}
      </div>
      <div className="activity-bar-sidebar">
        {activeItem && <Sidebar title={activeItem.itemName} closeSidebarHandler={() => setActiveItemName(null)}>{activeItem.content}</Sidebar>}
      </div>
    </div>
  );
}
