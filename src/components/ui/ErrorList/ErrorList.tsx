import "./error-list.css";
import { Info, TriangleAlert, CircleX } from "lucide-react";

interface ErrorListProps {
  errors: string[];
}

export default function ErrorList({ errors }: ErrorListProps) {
  return (
    <div className="error-list">
      {errors.map((error, index) => (
        <div key={index} className="error">
          <div className="error-icon">
            <CircleX />
          </div>
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
}
