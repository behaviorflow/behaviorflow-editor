import "./activity-bar.css";
import "../ActivityBarButton/ActivityBarButton.tsx";
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
  const [activeItem, setActiveItem] = useState<ActivityBarItem | null>(null);

  const onClickCallback = (item: ActivityBarItem) => {
    if (activeItem?.itemName === item.itemName) {
      setActiveItem(null);
    } else {
      setActiveItem(item);
    }
  };

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
            isActive={activeItem?.itemName === item.itemName}
          />
        ))}
      </div>
      <div className="activity-bar-sidebar">
        {activeItem && <Sidebar title={activeItem.itemName}>{activeItem.content}</Sidebar>}
      </div>
    </div>
  );
}
