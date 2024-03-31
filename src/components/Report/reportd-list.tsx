import React, { useState } from 'react';


interface ListProps {
  selectedReports: number[];
  onReportsChange: (selectedReports: number[]) => void;
}

const reportsData: { [key: number]: string } = {
  1: "Itinerary reconstitution",
  2: "Proximity report",
  3: "Alarms",
  4: "Diagram of distance, speed and contact",
  5: "Fuel Tank (IO) Diagram",
  6: "Diagram of GSM and GPS signal",
  7: "Engine diagram",
  8: "CAN Distance and Consumption Diagram",
  10: "Contact Report",
  11: "[CAN] RPM statistics",
  12: "[CAN] Speed statistics",
  13: "Speed statistics",
  14: "Gantt chart on proximity",
  15: "Gantt chart on contact",
  16: "System state diagram",
  17: "Mobile traffic",
  18: "Fuel tank diagram",
  19: "[RHT] Temperature diagram",
  20: "[FFS] Distance and consumption diagram",
  21: "[TCO] Tachograph diagrams",
  25: "Speeding violation report",
  26: "[QHSE] QHSE",
  27: "Driver behavior report",
  29: "Work amplitude report",
  30: "Fleet report",
  31: "Fleet report [CAN]",
  33: "HOS Hour of Service (PSN)",
  34: "Trip report",
  45: "Rapport CO2/Kg"
};

function List({ selectedReports, onReportsChange }: ListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange = (reportNumber: number) => {
    const updatedSelection = selectedReports.includes(reportNumber)
      ? selectedReports.filter((selected) => selected !== reportNumber)
      : [...selectedReports, reportNumber];

    onReportsChange(updatedSelection);
  };

  const filteredReports = Object.keys(reportsData).filter((reportNumber) =>
    reportsData[Number(reportNumber)].toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Rechercher un rapport"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2>Choisissez les rapports</h2>

      {filteredReports.map((reportNumber) => (
        <div key={reportNumber} className="list-item">
          <label>
            <input
              type="checkbox"
              value={reportNumber}
              checked={selectedReports.includes(Number(reportNumber))}
              onChange={() => handleCheckboxChange(Number(reportNumber))}
            />
            {`${reportsData[Number(reportNumber)]}`}
          </label>
        </div>
      ))}
    </div>
  );
}

export default List;
