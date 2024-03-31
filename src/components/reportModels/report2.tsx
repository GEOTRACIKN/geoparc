import React, { useEffect, useState } from 'react';
import {Button, Table } from 'react-bootstrap';
import PropagateLoader from "react-spinners/PropagateLoader";
import { useTranslate } from "../../components/LanguageProvider";
import { convertDurationToSeconds, formatDuration, formatDurationWithDays } from '../../utilities/functions';
import { getAdressesFromCoords } from "../../utilities/functions";
import ExcelJS from "exceljs";
import { Bounce, toast } from 'react-toastify';



const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface ReportData {
  start: string;
  end: string;
  ENGINESTAT: number;
  duration: string;
  Odometer: string;
  distance: number;
  max_speed: number;
  LAT: number;
  LNG: number;
  SOG: number;
  address?: string;
}

interface ApiResponse {
  immatriculation: string;
  repportDatas: ReportData[];
}

interface VehicleWidgetProps {
  type_report?: string;
  turn?: string;
  id_report?: string;
}


const Report2: React.FC<VehicleWidgetProps> = ({ id_report , turn }) => {
  
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { translate } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/report2/${id_report}`);
        const data: ApiResponse = await response.json();
        if (data) {
          // Récupération des adresses
          const locations = data.repportDatas.map((report, index) => ({
            id: index, // Utilisation de l'index comme identifiant unique
            lat: report.LAT,
            lon: report.LNG
          }));
          let addressData :any;
          try {
            addressData = await getAdressesFromCoords(locations);
          } catch (error) {
            console.error("Erreur lors de la récupération des adresses:", error);
            // En cas d'échec, utiliser les coordonnées directement
            addressData = locations.map(location => ({ address: `${location.lat}, ${location.lon}` }));
          }
  
          // Mettre à jour les données avec les adresses correspondantes
          data.repportDatas.forEach((report, index) => {
            report.address = addressData[index]?.address || ''; // Adresse ou une chaîne vide par défaut
          });
  
          setApiResponse(data);
        } else {
          console.error("Erreur lors de la récupération du rapport: Aucune donnée renvoyée par l'API");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rapport:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id_report]);
  
  

  function groupDataByDay(data: ReportData[]): Record<string, ReportData[]> {
    return data.reduce((acc, report) => {
      const tripDate = new Date(report.start).toLocaleDateString();
      if (!acc[tripDate]) {
        acc[tripDate] = [];
      }
      acc[tripDate].push(report);
      return acc;
    }, {} as Record<string, ReportData[]>);
  }

  const startDate = apiResponse?.repportDatas.length ? new Date(apiResponse.repportDatas[0].start).toLocaleString() : '';
  const endDate = apiResponse?.repportDatas.length ? new Date(apiResponse.repportDatas[apiResponse.repportDatas.length - 1].end).toLocaleString() : '';

 // Fonction pour calculer les statistiques globales à partir de toutes les données
const calculateGlobalStatistics = (allReports :any) => {
  const totalDistance = allReports.reduce((acc  :any, report  :any) => acc + report.distance, 0);
  const totalDurationInSeconds = allReports.reduce((acc  :any, report  :any) => acc + convertDurationToSeconds(report.duration || '0h 0m 0s'), 0);
  const totalStopDurationInSeconds = allReports.reduce((acc  :any, report  :any) => {
    if (report.ENGINESTAT === 0) {
      return acc + convertDurationToSeconds(report.duration || '0h 0m 0s');
    }
    return acc;
  }, 0);
  const totalDrivingDurationInSeconds = allReports.reduce((acc  :any, report  :any) => {
    if (report.ENGINESTAT === 1 && report.SOG > 5) {
      return acc + convertDurationToSeconds(report.duration || '0h 0m 0s');
    }
    return acc;
  }, 0);
  const totalStopDurationWithEngineInSeconds = allReports.reduce((acc  :any, report  :any) => {
    if (report.ENGINESTAT === 1 && report.SOG <= 5) {
      return acc + convertDurationToSeconds(report.duration || '0h 0m 0s');
    }
    return acc;
  }, 0);

  return {
    totalDistance,
    totalDuration: formatDuration(totalDurationInSeconds),
    totalStopDuration: formatDuration(totalStopDurationInSeconds),
    totalDrivingDuration: formatDuration(totalDrivingDurationInSeconds),
    totalStopDurationWithEngine: formatDuration(totalStopDurationWithEngineInSeconds)
  };
};

// Fonction pour générer et télécharger le fichier Excel
const handleDownloadExcel = () => {
  if (apiResponse) {
    const workbook = new ExcelJS.Workbook();
    
    // Créer la première feuille pour le nom du rapport et la date de création
    const firstSheet = workbook.addWorksheet('Informations');
    const titleRow = firstSheet.addRow(['Rapport de proximité']);
    titleRow.font = { bold: true, size: 16 }; // Taille de la police plus grande
    titleRow.alignment = { horizontal: 'center' };
    // Ajouter une ligne vide
    firstSheet.addRow([]);
    const dateRow = firstSheet.addRow(['Date de création', new Date().toLocaleString()]);
    dateRow.alignment = { horizontal: 'left' };
    // Ajuster la largeur des colonnes
    firstSheet.getColumn(1).width = 30;
    firstSheet.getColumn(2).width = 20;
    
    // Diviser les données par jour
    const dataByDay = groupDataByDay(apiResponse.repportDatas);
    const allReports = apiResponse.repportDatas;
    const globalStats = calculateGlobalStatistics(allReports);

   
    
    // Pour chaque jour, créer une feuille Excel avec les données de ce jour
    Object.entries(dataByDay).forEach(([day, dayReports]) => {
      const sheetName = `Rapport ${day.replace(/\//g, "-")}`;
      const secondSheet = workbook.addWorksheet(sheetName);
      // Ajouter le titre et les informations supplémentaires
      const reportTitle = `Rapport de proximité pour ${day}`;
      const tourInfo = `No. Tour : ${turn} / Véhicule : ${apiResponse?.immatriculation || 'Chargement...'}`;
      const titleRow2 = secondSheet.addRow([reportTitle]);
      titleRow2.font = { bold: true, size: 16 }; // Taille de la police plus grande
      const tourInfoRow = secondSheet.addRow([tourInfo]);
      tourInfoRow.font = { bold: true, size: 14 }; // Taille de la police plus grande
      secondSheet.addRow([]); // Ajouter une ligne vide pour séparer le titre des données
      // Ajouter les en-têtes de colonne
      const headerRow = secondSheet.addRow(['Départ', 'Arrivé', 'Adresse', 'Distance (KM)', 'Durée', 'État']);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A9A9A9' },
          bgColor: { argb: 'A9A9A9' }
        };
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'left' };
      });
      // Ajuster la largeur des colonnes
      secondSheet.columns.forEach(column => {
        column.width = 25;
      });
      
      // Ajouter les données
      dayReports.forEach(report => {
        let stateText;
        if (report.ENGINESTAT === 1 && report.SOG > 5) {
          stateText = "En marche";
        } else if (report.ENGINESTAT === 0) {
          stateText = "Arrêté";
        } else {
          stateText = "En pause";
        }
        
        const row = secondSheet.addRow([
          new Date(report.start).toLocaleTimeString(),
          new Date(report.end).toLocaleTimeString(),
          report.address,
          report.distance,
          report.duration,
          stateText
        ]);
        row.eachCell((cell, number) => {
          cell.alignment = { horizontal: 'center' };
        });
      });
      
      // Ajouter les statistiques de la journée
      const dayStats = calculateDayStatistics(dayReports);
      secondSheet.addRow([]); // Ajouter une ligne vide pour séparer les données des statistiques
      secondSheet.addRow(['Statistiques de la journée']);
      secondSheet.addRow(['Total distance (KM)', dayStats.totalDistance]);
      secondSheet.addRow(['Durée totale', dayStats.totalDuration]);
      secondSheet.addRow(['Durée de conduite', dayStats.drivingDuration]);
      secondSheet.addRow(['Durée de stationnement', dayStats.totalStopDuration]);
      secondSheet.addRow(['Durée de stationnement (Moteur allumé)', dayStats.stopDuration]);
    });

     // Ajouter une feuille pour le résumé global
      const globalSummarySheet = workbook.addWorksheet('Global Statistics');
      globalSummarySheet.mergeCells('A1:B1'); // Fusionner les cellules pour le titre
      const titleCell = globalSummarySheet.getCell('A1');
      titleCell.value = 'Global Statistics';
      titleCell.font = { bold: true, size: 16 }; // Style du titre
      titleCell.alignment = { horizontal: 'center' }; // Centrer le titre

      // Ajouter les statistiques globales avec des libellés explicites
      const globalStatsLabels = [
        ['Total Distance (KM)', globalStats.totalDistance],
        ['Total Duration', globalStats.totalDuration],
        ['Total Driving Duration', globalStats.totalDrivingDuration],
        ['Total Stop Duration', globalStats.totalStopDuration],
        ['Total Stop Duration (Engine On)', globalStats.totalStopDurationWithEngine]
      ];

      // Ajouter les données dans la feuille
      globalStatsLabels.forEach((label, index) => {
        const [statLabel, statValue] = label;
        const rowNumber = index + 2; // Commencer à la deuxième ligne après le titre
        globalSummarySheet.getCell(`A${rowNumber}`).value = statLabel;
        globalSummarySheet.getCell(`B${rowNumber}`).value = statValue;
      });

      // Ajuster la largeur des colonnes
      globalSummarySheet.getColumn('A').width = 30;
      globalSummarySheet.getColumn('B').width = 20;

    // Télécharger le fichier Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rapport2.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Afficher un toast pour indiquer que le téléchargement est terminé
      toast.success('Le fichier Excel a été téléchargé avec succès.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }).catch(error => {
      console.error('Erreur lors de la génération du fichier Excel :', error);
      // Afficher un toast pour indiquer qu'il y a eu une erreur lors de la génération du fichier Excel
      toast.error('Une erreur est survenue lors de la génération du fichier Excel.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    });
  } else {
    // Afficher un toast pour indiquer qu'il n'y a pas de données à télécharger
    toast.warn('Aucune donnée disponible pour générer le fichier Excel.', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
};


// Fonction pour calculer les statistiques de la journée
const calculateDayStatistics = (reports :any) => {
  const totalDistance = reports.reduce((acc :any, report :any) => acc + report.distance, 0);
  const totalDuration = reports.reduce((acc :any, report :any) => {
    const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
    return acc + durationInSeconds;
  }, 0);
  const drivingDuration = reports.reduce((acc :any, report :any) => {
    if (report.ENGINESTAT === 1 && report.SOG > 5) {
      const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
      return acc + durationInSeconds;
    }
    return acc;
  }, 0);
  const totalStopDuration = reports.reduce((acc :any, report :any) => {
    if (report.ENGINESTAT === 0) {
      const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
      return acc + durationInSeconds;
    }
    return acc;
  }, 0);
  const stopDuration = reports.reduce((acc :any, report :any) => {
    if (report.ENGINESTAT === 1 && report.SOG <= 5) {
      const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
      return acc + durationInSeconds;
    }
    return acc;
  }, 0);

  return {
    totalDistance,
    totalDuration: formatDuration(totalDuration),
    drivingDuration: formatDuration(drivingDuration),
    totalStopDuration: formatDuration(totalStopDuration),
    stopDuration: formatDuration(stopDuration)
  };
};
    
    
    
    
    

return (
  <>
    {loading ? (
      <div className="text-center">
        <PropagateLoader color={'#123abc'} loading={loading} size={20} />
      </div>
    ) : (
      <>
  
   <div className="row">
    <h6 className="col-sm-6 col-md-6">
          <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Proximity report")} Du{' '}  
          <span style={{ color: '#3468C0' }}>{startDate}</span> au{' '}
          <span style={{ color: '#3468C0' }}>{endDate}</span>
    </h6>
    <div className="col-sm-6 col-md-6 " style={{ padding: '10px' }} >
          <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
           
            <Button
        className="btn btn-info mt-2 mr-1"
        onClick={handleDownloadExcel}
      >
        <i className="las la-file-excel mr-3"></i>
        {translate('Download Excel')}
      </Button>
          </div>
    </div>
    </div>

    {apiResponse &&
        Object.entries(groupDataByDay(apiResponse.repportDatas)).map(([day, dayReports]) => {
          // Calcul des statistiques pour chaque journée
          const totalDistance = dayReports
          .filter(report => !(report.ENGINESTAT === 1 && report.SOG <= 5))
          .reduce((acc, report) => acc + report.distance, 0) || 0;
      
        const roundedTotalDistance = Math.round(totalDistance); // Arrondir à l'entier le plus proche

          const totalDurationInSeconds = dayReports.reduce((acc, report) => {
            const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
            return acc + durationInSeconds;
          }, 0) || 0;

          const totalDurationFormatted = formatDuration(totalDurationInSeconds);

          const SOGdiffzero = dayReports.filter(report => report.SOG > 5);
          const totalSOG = SOGdiffzero.reduce((sum, report) => sum + report.SOG, 0) || 0;
          const averageSOG = SOGdiffzero.length ? totalSOG / SOGdiffzero.length : 0;
          const averageSpeedText = `${averageSOG.toFixed(2)} km/h`;

          const drivingDurationInSeconds = dayReports
            .filter(report => report.ENGINESTAT === 1 && report.SOG > 5)
            .reduce((acc, report) => {
              const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
              return acc + durationInSeconds;
            }, 0) || 0;

          const drivingDurationFormatted = formatDuration(drivingDurationInSeconds);

          const totalStopDurationInSeconds = dayReports.reduce((acc, report) => {
            if (report.ENGINESTAT === 0) {
              const stopDurationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
              return acc + stopDurationInSeconds;
            }
            return acc;
          }, 0) || 0;

          const totalStopDurationFormatted = formatDuration(totalStopDurationInSeconds);

          const stopDurationInSeconds = dayReports.reduce((acc, report) => {
            if (report.ENGINESTAT === 1 && report.SOG <= 5) {
              const durationInSeconds = convertDurationToSeconds(report.duration || '0h 0m 0s');
              return acc + durationInSeconds;
            }
            return acc;
          }, 0) || 0;

          const stopDurationFormatted = formatDuration(stopDurationInSeconds);

          const totalMaxSpeed = dayReports.reduce((acc, report) => acc + report.max_speed, 0) || 0;
          const totalSOGGreaterThan5 = dayReports.reduce((acc, report) => {
              return report.SOG > 5 ? acc + 1 : acc;
          }, 0) || 0;
          
          let maxSpeed = 0;
          if (totalSOGGreaterThan5 > 0) {
              const sumMaxSpeeds = dayReports.reduce((acc, report) => {
                  return report.SOG > 5 ? acc + report.max_speed : acc;
              }, 0);
              maxSpeed = sumMaxSpeeds / totalSOGGreaterThan5;
          }
          


          

          return (
            <div key={day}>
              <Table>
                <thead className="bg-white">
                  <tr className="ligth ligth-data">
                    <th colSpan={8} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}> 
                      <div style={{ float: 'left' }}>
                      {translate("No. Tour")} : {turn} /   {translate("Vehicle")}  : {apiResponse?.immatriculation || 'Chargement...'} 
                      </div>
                      <div style={{ float: 'right' }}>
                      {day}
                      </div>
                    </th>
                  </tr>
                  <tr className="ligth ligth-data">
                    <th></th>
                    <th>{translate("Starting")}</th>
                    <th>{translate("Arrived")}</th>
                    <th>{translate("Address")}</th>
                    <th>{translate("Distance")}</th>
                    <th>{translate("Duration")}</th>
                    <th>{translate("State")}</th>
                  </tr>
                </thead>
                <tbody>
                {dayReports.map((report, index) => {
                      return (
                        <tr key={index}>
                          <td></td>
                          <td>{new Date(report.start).toLocaleTimeString()}</td>
                          <td>{new Date(report.end).toLocaleTimeString()}</td>
                          <td>{report.address}</td> {/* Assurez-vous que l'adresse est correctement affichée ici */}
                          {report.ENGINESTAT === 1 && report.SOG <= 5 ? (
                            <td style={{ backgroundColor: '#f7ac34', color: '#fff' }}>{translate("Stopping with the engine on")}</td>
                          ) : (
                            <td>{report.distance} KM</td>
                          )}
                          <td>{report.duration}</td>
                          <td>
                            {report.ENGINESTAT === 1 && report.SOG > 5 ? (
                              <i className="fa fa-play" style={{ color: 'green' }} title="En marche"></i>
                            ) : report.ENGINESTAT === 0 ? (
                              <i className="fa fa-stop" style={{ color: 'blue' }} title="Arrêté"></i>
                            ) : (
                              <i className="fa fa-pause" style={{ color: '#b94a48' }} title="En pause"></i>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
              </Table>

              <hr style={{ border: '1px solid #191919', margin: '20px 0' }} />

              {/* Table for  Statistics */}
              <Table>
                <thead className="bg-white text-uppercase">
                  <tr className="ligth ligth-data">
                    <th colSpan={8} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                    {translate("Statistics of the Day")} - {day}  
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h6>{translate("Total distance")}</h6>
                    </td>
                    <td>{roundedTotalDistance} KM</td>
                    <td>
                      <h6>{translate("Total duration")}</h6>
                    </td>
                    <td>{totalDurationFormatted}</td>
                  </tr>
                  <tr>
                  <td>
                    <h6>{translate("Maximum speed")}</h6>
                  </td>
                  <td>
                  {Math.round(maxSpeed)} km/h
                    </td>
                    <td>
                      <h6>{translate("Driving time")}</h6>
                    </td>
                    <td>{drivingDurationFormatted}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>{translate("Average speed")}</h6>
                    </td>
                    <td>
                      {averageSpeedText}
                    </td>
                    <td>
                      <h6>{translate("Parking duration")}</h6>
                    </td>
                    <td>{totalStopDurationFormatted}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <h6>{translate("Parking duration")} {translate("Engine on")}</h6>
                    </td>
                    <td>{stopDurationFormatted}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
        <hr style={{ border: '1px solid #191919', margin: '20px 0' }} /> 
         {/* Section pour les statistiques globales */}
        {apiResponse && Object.keys(groupDataByDay(apiResponse.repportDatas)).length > 2 && (
          <div>
            <Table>
              <thead className="bg-white text-uppercase">
                <tr className="ligth ligth-data">
                  <th colSpan={8} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                  {translate("Global statistics")}
                  </th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <h6>{translate("Total distance")}</h6>
                </td>
                <td>
                    {apiResponse.repportDatas.reduce((acc, report) => {
                      if (report.ENGINESTAT === 1 && report.SOG > 5) {
                        return acc + report.distance;
                      }
                      return acc;
                    }, 0)} KM
                  </td>                
                  <td>
                  <h6>{translate("Total duration")}</h6>
                </td>
                <td>
                  {formatDurationWithDays(
                    apiResponse.repportDatas.reduce((acc, report) => acc + convertDurationToSeconds(report.duration || '0h 0m 0s'), 0)
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>{translate("Parking duration")}</h6>
                </td>
                <td>
                  {formatDurationWithDays(
                    apiResponse.repportDatas.reduce(
                      (acc, report) => acc + (report.ENGINESTAT === 0 ? convertDurationToSeconds(report.duration || '0h 0m 0s') : 0),
                      0
                    )
                  )}
                </td>
                <td>
                  <h6>{translate("Driving time")}</h6>
                </td>
                <td>
                  {formatDurationWithDays(
                    apiResponse.repportDatas.reduce(
                      (acc, report) => acc + (report.ENGINESTAT === 1 && report.SOG > 5 ? convertDurationToSeconds(report.duration || '0h 0m 0s') : 0),
                      0
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <h6>{translate("Parking duration")}  {translate("Engine on")}</h6>
                </td>
                <td>
                  {formatDurationWithDays(
                    apiResponse.repportDatas.reduce(
                      (acc, report) => acc + (report.ENGINESTAT === 1 && report.SOG < 5 ? convertDurationToSeconds(report.duration || '0h 0m 0s') : 0),
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>

            </Table>
          </div>
        )}
    </>
  )}
</>
);
};

export default Report2;