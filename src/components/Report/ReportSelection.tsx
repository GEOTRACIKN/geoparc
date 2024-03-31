import React from 'react';
import ListeReports from './ListeReports';


interface ReportSelectionProps {
  selectedReports: number[];
  onReportSelect: (reports: number[]) => void;
}

const ReportSelection: React.FC<ReportSelectionProps> = ({ selectedReports, onReportSelect }) => {
  return (
    <div>
      <ListeReports
        selectedReports={selectedReports}
        onReportsChange={(reports) => onReportSelect(reports)}
      />
    </div>
  );
}

export default ReportSelection;

// Ajouter une déclaration d'exportation vide
export {};