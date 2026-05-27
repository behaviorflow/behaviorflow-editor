import React from "react";
import "./radio-group.css";

export interface RadioOption {
  value: string;
  label?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <div className="radio-group">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
            />
            <span>{option.label ?? option.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
