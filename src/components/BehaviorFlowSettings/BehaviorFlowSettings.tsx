import React, { useEffect, useState } from "react";
import "./behavior-flow-settings.css";
import ToggleSwitch from "../ui/ToggleSwitch/ToggleSwitch";
import useLocalStorage from "use-local-storage";

interface BehaviorFlowSettingsProps {
  setTheme: (theme: string) => void;
  themeStatus: string;
  showMiniMapStatus: boolean;
  setShowMiniMap: (status: boolean) => void;
}

export default function BehaviorFlowSettings({
  setTheme,
  themeStatus,
  setShowMiniMap,
  showMiniMapStatus,
}: BehaviorFlowSettingsProps) {
  return (
    <div className="behavior-flow-settings">
      <div className="behavior-flow-settings-list">
        <div className="behavior-flow-settings-item">
          <div className="toggle-switch-item">
            <span>Dark Theme</span>
            <ToggleSwitch isOn={themeStatus === "dark"} onChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </div>
        </div>
        <div className="behavior-flow-settings-item">
          <div className="toggle-switch-item">
            <span>Hide Mini Map</span>
            <ToggleSwitch isOn={!showMiniMapStatus} onChange={(checked) => setShowMiniMap(!checked)} />
          </div>
        </div>
      </div>
    </div>
  );
}
