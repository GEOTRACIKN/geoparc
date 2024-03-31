import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import PropagateLoader from "react-spinners/PropagateLoader";
import { useTranslate } from "../../components/LanguageProvider";
import { formatDuration, convertDurationToSeconds } from "../../utilities/functions";
import * as XLSX from 'xlsx';
import { getAdressesFromCoords } from "../../utilities/functions";

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

const Report10: React.FC<VehicleWidgetProps> = ({ id_report, turn }) => {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { translate } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/report2/${id_report}`);
        const data: ApiResponse = await response.json();

        if (data) {
          const locations = data.repportDatas.map((report: ReportData, index: number) => {
            return {
              id: index,
              lat: report.LAT,
              lon: report.LNG
            }
          })
        
          const addresses = await getAdressesFromCoords(locations);

          data.repportDatas.forEach((report: ReportData, index: number) => {
            report.address = addresses[index].address;
          });
          
          setApiResponse(data);
        } else {
          console.error('Error retrieving report: No data received from the API.');
        }
      } catch (error) {
        console.error('Error retrieving report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_report]);

  const groupDataByDay = (data: ReportData[]) => {
    return data.reduce((acc, report) => {
      const tripDate = new Date(report.trip_date).toLocaleDateString();
      if (!acc[tripDate]) {
        acc[tripDate] = [];
      }
      acc[tripDate].push(report);
      return acc;
    }, {} as Record<string, ReportData[]>);
  };

  const handleDownloadExcel = () => {
    if (apiResponse) {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
      const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        apiResponse.repportDatas.map(report => ({
          "Start Time": new Date(report.start).toLocaleTimeString(),
          "End Time": new Date(report.end).toLocaleTimeString(),
          "Address": report.address,
          "Distance": report.distance,
          "Duration": report.duration,
          "Status": report.ENGINESTAT === 1 ? 'Running' : 'Stopped'
        }))
      );
  
      XLSX.utils.book_append_sheet(wb, ws1, 'Report Data');
  
      // Create a new worksheet for statistics
      // const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
      //   { "Total Distance": totalDistance, "Total Duration": totalDurationFormatted },
      //   { "Max Speed": dayReports.reduce((maxSpeed, report) => Math.max(maxSpeed, report.max_speed), 0) || 0, "Drive Duration": drivingDurationFormatted },
      //   { "Average Speed": averageSpeedText, "Parking Duration": totalStopDurationFormatted }
      // ]);
  
      // Add the statistics worksheet to the workbook
      // XLSX.utils.book_append_sheet(wb, ws2, 'Statistics');
  
      XLSX.writeFile(
        wb,
        `Proximity report ${id_report} ${turn} ${new Date().toLocaleString()}.xlsx`
      );
    }
  };
  
  

  const renderStatisticsTable = (day: string, dayReports: ReportData[]) => {
    const totalDistance = dayReports.filter(
      (report) => !(report.ENGINESTAT === 1 && report.SOG <= 5)
    ).reduce((acc, report) => acc + report.distance, 0) || 0;

    const totalDurationInSeconds = dayReports.reduce((acc, report) => {
      const durationInSeconds = convertDurationToSeconds(
        report.duration || `${translate('0h 0m 0s')}`
      );
      return acc + durationInSeconds;
    }, 0) || 0;

    const totalDurationFormatted = formatDuration(totalDurationInSeconds);

    const SOGdiffzero = dayReports.filter((report) => report.SOG > 5);
    const totalSOG = SOGdiffzero.reduce((sum, report) => sum + report.SOG, 0) || 0;
    const averageSOG = SOGdiffzero.length !== 0
      ? totalSOG / SOGdiffzero.length
      : 0;
    const averageSpeedText = `${averageSOG.toFixed(2)} km/h`;

    const drivingDurationInSeconds = dayReports.reduce((acc, report) => {
      if (report.ENGINESTAT === 1 && report.SOG > 5) {
        const durationInSeconds = convertDurationToSeconds(
          report.duration || `${translate('0h 0m 0s')}`
        );
        return acc + durationInSeconds;
      }
      return acc;
    }, 0) || 0;

    const drivingDurationFormatted = formatDuration(drivingDurationInSeconds);

    const totalStopDurationInSeconds = dayReports.reduce((acc, report) => {
      if (report.ENGINESTAT === 0) {
        const stopDurationInSeconds = convertDurationToSeconds(
          report.duration || `${translate('0h 0m 0s')}`
        );
        return acc + stopDurationInSeconds;
      }
      return acc;
    }, 0) || 0;

    const totalStopDurationFormatted = formatDuration(totalStopDurationInSeconds);

    

    return (
      <Table>
        <thead className="bg-white text-uppercase">
          <tr className="ligth ligth-data">
            <th
              colSpan={8}
              style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}
            >
              {translate("Statistics for Day")} {day}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h6>{translate("Total Distance")}</h6>
            </td>
            <td>{totalDistance} {translate('KM')}</td>
            <td>
              <h6>{translate("Total Duration")}</h6>
            </td>
            <td>{totalDurationFormatted}</td>
          </tr>
          <tr>
            <td>
              <h6>{translate("Max Speed")}</h6>
            </td>
            <td>
              <span
                style={{
                  color: dayReports.some((report) => report.max_speed >= 90)
                    ? 'red'
                    : 'green',
                }}
              >
                {dayReports.reduce(
                  (maxSpeed, report) => Math.max(maxSpeed, report.max_speed),
                  0
                ) || 0}
                {translate('km/h')}
              </span>
            </td>
            <td>
              <h6>{translate("Drive Duration")}</h6>
            </td>
            <td>{drivingDurationFormatted}</td>
          </tr>
          <tr>
            <td>
              <h6>{translate("Average Speed")}</h6>
            </td>
            <td>{averageSpeedText}</td>
            <td>
              <h6>{translate("Parking Duration")}</h6>
            </td>
            <td>{totalStopDurationFormatted}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    );
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
              <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Proximity report")} {translate("From")} {' '}
              {/* <span style={{ color: '#3468C0' }}>{startDate}</span> {translate('To')} {' '}
              <span style={{ color: '#3468C0' }}>{endDate}</span> */}
            </h6>
            <div className="col-sm-6 col-md-6 " style={{ padding: '10px' }} >
              <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
                <button className="btn btn-outline-info mt-2" onClick={handleDownloadExcel}>
                  <i className="las la-file-excel"></i> 
                  {translate('Download Excel')}
                </button> 
              </div>
            </div>
          </div>
          {apiResponse &&
            Object.entries(groupDataByDay(apiResponse.repportDatas)).map(
              ([day, dayReports]) => (
                <div key={day}>
                  <Table>
                    <thead className="bg-white">
                      <tr className="ligth ligth-data">
                        <th
                          colSpan={8}
                          style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}
                        >
                          <div style={{ float: 'left' }}>
                            {" "}
                            {translate("Turn Number")}: {turn}{" "}
                            /{" "}
                            {translate("vehicle registration number")}:{" "}
                            {apiResponse?.immatriculation || "Loading..."}{" "}
                          </div>
                          <div style={{ float: 'right' }}>
                            {" "}
                            {translate("Report for")} {day}{" "}
                          </div>
                        </th>
                      </tr>
                      <tr className="ligth ligth-data">
                        <th></th>
                        <th>{translate("Start Time")}</th>
                        <th>{translate("End Time")}</th>
                        <th>{translate("Address")}</th>
                        <th>{translate("Distance")}</th>
                        <th>{translate("Duration")}</th>
                        <th>{translate("Status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayReports.map((report, index) => (
                        <tr key={index}>
                          <td></td>
                          <td>{new Date(report.start).toLocaleTimeString()}</td>
                          <td>{new Date(report.end).toLocaleTimeString()}</td>
                          <td>{report.address} </td>
                          {report.ENGINESTAT === 1 && report.SOG <= 5 ? (
                            <td
                              style={{
                                backgroundColor: '#E48F45',
                                color: '#fff',
                              }}
                            >
                              {translate('Stopped with Engine Running')}
                            </td>
                          ) : (
                            <td>{report.distance} {translate('KM')}</td>
                          )}
                          <td>{report.duration}</td>
                          <td className='text-center'>
                            {report.ENGINESTAT === 1 ? (
                              <i
                                className="fa fa-play"
                                style={{ color: 'green' }}
                                title="Running"
                              ></i>
                            ) : (
                              <i
                                className="fa fa-stop"
                                style={{ color: 'blue' }}
                                title="Stopped"
                              ></i>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <hr style={{ border: '1px solid #191919', margin: '20px 0' }} />

                  {/* Tableau de statistiques */}
                  {renderStatisticsTable(day, dayReports)}
                </div>
              )
            )}
        </>
      )}
    </>
  );
};

Report10.propTypes = {
  id_report: PropTypes.string,
  turn: PropTypes.string,
};

export default Report10;
