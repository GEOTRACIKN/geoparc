import React from "react";
import { MissionOrder } from "./types";

interface MissionOrderPreviewProps {
  show: boolean;
  onHide: () => void;
  missionOrder: MissionOrder;
}

const MissionOrderPreview: React.FC<MissionOrderPreviewProps> = ({ show, onHide, missionOrder }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Mission Order Preview</h2>
        <p><strong>Object:</strong> {missionOrder.object_mission}</p>
        <p><strong>Fuel Type:</strong> {missionOrder.fuel_type_mission}</p>
        <p><strong>Expenses:</strong> {missionOrder.expenses_mission}</p>
        <p><strong>Driver:</strong> {missionOrder.driver_mission}</p>
        <button onClick={onHide}>Close Preview</button>
      </div>
    </div>
  );
};

export default MissionOrderPreview;
