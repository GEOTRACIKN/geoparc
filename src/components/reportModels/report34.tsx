import React, { useEffect, useState } from 'react';
import {Table } from 'react-bootstrap';
import PropagateLoader from "react-spinners/PropagateLoader";
import { useTranslate } from "../../components/LanguageProvider";
import { convertDurationToSeconds, formatDuration, formatDurationWithDays, getAdressesFromCoords } from '../../utilities/functions';



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
    trip_date: string;
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
  

const Report34: React.FC<VehicleWidgetProps> = ({ id_report , turn }) => {

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
            const addressData = await getAdressesFromCoords(locations);
      
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

const startDate = apiResponse?.repportDatas.length ? new Date(apiResponse.repportDatas[0].start).toLocaleString() : '';
const endDate = apiResponse?.repportDatas.length ? new Date(apiResponse.repportDatas[apiResponse.repportDatas.length - 1].end).toLocaleString() : '';


function groupDataByDay(data: ReportData[]): Record<string, ReportData[]> {
    return data.reduce((acc, report) => {
      const tripDate = new Date(report.trip_date).toLocaleDateString();
      if (!acc[tripDate]) {
        acc[tripDate] = [];
      }
      acc[tripDate].push(report);
      return acc;
    }, {} as Record<string, ReportData[]>);
}


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
            <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Trip report")} Du{' '}  
            <span style={{ color: '#3468C0' }}>{startDate}</span> au{' '}
            <span style={{ color: '#3468C0' }}>{endDate}</span>
      </h6>
      <div className="col-sm-6 col-md-6 " style={{ padding: '10px' }} >
            <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
              <a href="#" className="btn btn-outline-success ">
                <i className="las la-file-excel"></i> 
                {translate("Download Excel")}
              </a> 
            </div>
      </div>
      </div>
  
      {apiResponse &&
          Object.entries(groupDataByDay(apiResponse.repportDatas)).map(([day, dayReports]) => {
            // Calcul des statistiques pour chaque journée
            const totalDistance = dayReports
              .filter(report => !(report.ENGINESTAT === 1 && report.SOG <= 5))
              .reduce((acc, report) => acc + report.distance, 0) || 0;
  
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
  
            return (
              <div key={day}>
                <Table>
                  <thead className="bg-white">
                    <tr className="ligth ligth-data">
                      <th colSpan={9} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}> 
                        <div style={{ float: 'left' }}>
                        {translate("No. Tour")} : {turn} /  {translate("Vehicles")} : {apiResponse?.immatriculation || 'Chargement...'}   
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
                      <th>{translate("Time")}</th>
                      <th>{translate("Average speed")}</th>  
                      <th>{translate("Maximum speed")}</th>
                      <th>{translate("State")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayReports.map((report, index) => (
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
                        <td>{report.SOG !== 0 ? report.SOG.toFixed(2) + ' Km/h' : '-'}</td>
                        <td>{report.max_speed !== 0 ? Math.round(report.max_speed) + ' Km/h' : '-'}</td>
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
                    ))}
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
                      <td>{totalDistance} KM</td>
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
                      <span style={{ color: dayReports.some(report => report.max_speed >= 90) ? 'red' : 'green' }}>
                        {dayReports.reduce((maxSpeed, report) => Math.max(maxSpeed, report.max_speed), 0) || 0} km/h
                      </span>
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
                        <h6>{translate("Parking duration")} ({translate("Engine on")}) </h6>
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
                  <h6>{translate("Parking duration")} ({translate("Engine on")})</h6>
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


export default Report34;