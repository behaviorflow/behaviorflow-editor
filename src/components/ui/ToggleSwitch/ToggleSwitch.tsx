import "./toggle-switch.css";

interface ToggleSwitchProps {
  isOn: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({ isOn, onChange }: ToggleSwitchProps) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isOn} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-switch-slider"></span>
    </label>
  );
}
