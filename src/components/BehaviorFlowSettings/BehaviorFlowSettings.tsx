import React, { useEffect, useState } from "react";
import "./behavior-flow-settings.css";

import ToggleSwitch from "../ui/ToggleSwitch/ToggleSwitch";

export interface ToggleSwitchConfig {
  label: string;
  isOn: boolean;
  onChange: (checked: boolean) => void;
}

interface BehaviorFlowSettingsProps {
  toggles: ToggleSwitchConfig[];
}

export default function BehaviorFlowSettings({ toggles }: BehaviorFlowSettingsProps) {
  return (
    <div className="behavior-flow-settings">
      <div className="behavior-flow-settings-list">
        {toggles.map((toggle, idx) => (
          <div className="behavior-flow-settings-item" key={idx}>
            <div className="toggle-switch-item">
              <span>{toggle.label}</span>
              <ToggleSwitch isOn={toggle.isOn} onChange={toggle.onChange} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
