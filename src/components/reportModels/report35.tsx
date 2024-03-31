import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

// Définition de l'interface pour les données de rapport
interface ReportData {
  id_repport: number;
  driver_name: string;
  ibutton_code: string;
  psn: string;
  distance: number;
  acc: number;
  brk: number;
  max_speed: number;
  duration: string;
  start: string;
  end: string;
  score: number;
  rest_time: number;
  driving_time: number;
}
interface ApiResponse {
  repportDatas: ReportData[];
}

interface Report35Props {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

const Report35: React.FC<Report35Props> = ({ type_report, turn, id_report }) => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ReportData; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL

    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/report35/${id_report}`);
        const data: ApiResponse = await response.json();
        if (data && data.repportDatas) {
          setReportData(data.repportDatas);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key: keyof ReportData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...reportData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [reportData, sortConfig]);

  
  // Function to determine the background color based on the total score
  const getScoreClass = (score: number) => {
    if (score < 2) return 'table-success';
    if (score >= 2 && score < 5) return 'table-warning';
    if (score >= 5) return 'table-danger';
    return '';
  };
    const calculateDrivingTime = (drivingTime: number, hoursAuthorized: number) => {
    let drivingExceeded = 'D: 00h 00m 00s';
    let hosPenalty = 0;
    let positive = 0;

    if (drivingTime - hoursAuthorized > 0) {
      drivingExceeded = formatDuration((drivingTime - hoursAuthorized) * 60 * 60);
      hosPenalty = (drivingTime - hoursAuthorized) * 60 / 10;
      positive = 1;
    }

    return { hosPenalty, drivingExceeded, positive };
  };

  const calculateRestTime = (restTime: number, hoursAuthorized: number) => {
    let restExceeded = 'R: 00h 00m 00s';
    let hosPenalty = 0;
    let positive = 0;

    if (hoursAuthorized - restTime > 0) {
      restExceeded = formatDuration(restTime * 60 * 60);
      hosPenalty = restTime * 60 / 10;
      positive = 1;
    }

    return { hosPenalty, restExceeded, positive };
  };

  // Fonction pour formater la durée en 'Hh Mm Ss'
  const formatDuration = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds); // spécifier la valeur en secondes
    return date.toISOString().substr(11, 8);
  };

    
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
        <th onClick={() => requestSort('ibutton_code')}>Tag</th>
          <th onClick={() => requestSort('driver_name')}>Drivers</th>
          <th onClick={() => requestSort('psn')}>Vehicles</th>
          <th onClick={() => requestSort('distance')}>Distance (Km)</th>
          <th onClick={() => requestSort('acc')}>Acceleration</th>
          <th onClick={() => requestSort('brk')}>Braking</th>
          <th onClick={() => requestSort('max_speed')}>Highest speed (km/h)</th>
          <th onClick={() => requestSort('duration')}>Speeding violation Penalty</th>
          <th onClick={() => requestSort('max_speed')}>Speeding violation Duration</th>
          <th onClick={() => requestSort('max_speed')}>Exceeding Driving Hours Penalty</th>
          <th onClick={() => requestSort('max_speed')}>Exceeding Driving Hours Duration</th>
          <th onClick={() => requestSort('driving_time')}>Rest Hours Duration</th>
          <th onClick={() => requestSort('score')}>Total score</th>
        </tr>
      </thead>
      <tbody>
        
        {sortedItems.map((data, index) => {
          // Calculer les valeurs nécessaires pour cette ligne
          const drivingResults = calculateDrivingTime(data.driving_time, 6);
          const restResults = calculateRestTime(data.rest_time, 6);

          // Ici, vous pourriez également calculer la couleur de fond de la ligne basée sur le score
          const rowClass = getScoreClass(data.score);

          return (
            <tr key={index} className={rowClass}>
              <td>{data.ibutton_code}</td>
              <td>{data.driver_name}</td>
              <td>{data.psn}</td>
              <td>{data.distance}</td>
              <td>{data.acc}</td>
              <td>{data.brk}</td>
              <td>{data.max_speed}</td>
              <td>{data.duration}</td>
              <td>{drivingResults.drivingExceeded}</td>
              <td>{restResults.restExceeded}</td>
              <td>{data.score.toFixed(2)}</td>  
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Report35;
