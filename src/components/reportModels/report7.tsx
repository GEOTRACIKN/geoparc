import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Linecharts, { ChartData } from "../Charts/Linecharts";
import { getReportName } from "../../utilities/functions";
import { useTranslate } from "../../components/LanguageProvider";

const backendUrl = process.env.REACT_APP_BACKEND_URL;





interface Report7Props {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

const Report7: React.FC<Report7Props> = ({ type_report, turn, id_report }) => {
  const [reportData, setReportData] = useState<any>({});
  const { translate } = useTranslate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/Rapport7/${id_report}`
        );
        const data = await response.json();

        console.log("Données récupérées de l'API :", data);

        setReportData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données API :",
          error
        );
        setReportData({
          success: false,
          message: "Erreur lors de la récupération des données API.",
        });
      }
    };

    fetchData();
  }, [type_report, turn, id_report]);

  const apiData = reportData.data || [];

  const transformedQuery2ResultData = apiData.query2Result
  ? apiData.query2Result.map((item: any) => ({
      datetime: new Date(item.datetime).getTime(),
      speed_engine: item.speed_engine,
      rotation_engine: item.rotation_engine,
      temperature_engine: item.temperature_engine,
      acceleration_engine: item.acceleration_engine,
    }))
  : [];

  const sampleData: ChartData = {
    chartTitle: translate('Données du moteur'),
    chartTitleAlign: 'center',
    enabledLegend: true,
    height: 400,
    series: [
      {
        name: translate('Vitesse moteur'),
        unit: translate(' km/h'),
        description:  translate('Vitesse moteur'),
        data: transformedQuery2ResultData.map((item: any) => [
          item.datetime,
          item.speed_engine,
        ]),
        color: '#41b346',
        type: 'spline',
        yAxisState: true,
        labels: {
          format: '{value}',
          style: {
            color: '#41b346',
          },
        },
      },
      {
        name: translate('Régime moteur'),
        unit: translate(' rot/min'),
        description:  translate('Régime moteur'),
        data: transformedQuery2ResultData.map((item: any) => [
          item.datetime,
          item.rotation_engine,
        ]),
        color: '#EB1D36',
        type: 'spline',
        yAxisState: true,
        labels: {
          format: '{value}',
          style: {
            color: '#EB1D36',
          },
        },
      },
      {
        name: translate('Température moteur'),
        unit: ' °C',
        description: translate('Température moteur'),
        data: transformedQuery2ResultData.map((item: any) => [
          item.datetime,
          item.temperature_engine,
        ]),
        color: '#0080FF',
        type: 'spline',
        yAxisState: true,
        labels: {
          format: '{value}',
          style: {
            color: '#0080FF',
          },
        },
      },
      {
        name: translate('Accélération moteur'),
        unit: ' %',
        description: translate('Accélération moteur'),
        data: transformedQuery2ResultData.map((item: any) => [
          item.datetime,
          item.acceleration_engine,
        ]),
        color: '#FFD700',
        type: 'spline',
        yAxisState: true,
        labels: {
          format: '{value}',
          style: {
            color: '#FFD700',
          },
        },
      },
    ],
  };

  return (
    <>
      {apiData.query1Result && apiData.query1Result.length > 0 && (
        <>
          <h5>
            <i
              className="las la-chart-bar"
              data-rel="bootstrap-tooltip"
              title="Increased"
            ></i>{" "}
            {translate("Rapport Du")}{" "}
            {new Date(apiData.query1Result[0].date_start).toLocaleString()} {translate("Au")}{" "}
            {new Date(apiData.query1Result[0].date_end).toLocaleString()}
          </h5>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h5>{[
                      `[${apiData.query1Result[0].type_report}] ${getReportName(
                        apiData.query1Result[0].type_report,translate
                      )}`,
                    ]}</h5>
            <a className="btn btn-default btn-lg">
              <i className="las la-file-excel la-lg"></i>
            </a>
            <p>
            {translate("Date de création")} :{" "}
              {new Date(apiData.query1Result[0].date_creation).toLocaleString()}
            </p>
          </div>

          <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th
                  colSpan={8}
                  style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}
                >
                  {translate("Immatriculation du véhicule")} :{" "}
                  {apiData.query1Result[0].immatriculation_vehicule || "N/A"},
                  {translate("Turn Report")} : {apiData.query1Result[0].turn_report || "N/A"}
                </th>
              </tr>
            </thead>
            <tr className="ligth">
              <th>{translate("Date/Heure")}</th>
              <th> </th>
              <th>{translate("Vitesse")}</th>
              <th>{translate("Régime moteur")}</th>
              <th>{translate("Température moteur")}</th>
              <th>{translate("Accélération moteur")}</th>
            </tr>

            <tbody key="Drivers" className="ligth">
              {apiData.query1Result.map((item: any) => (
                <tr key={item.id_report}>
                  <td>
                    {new Date(item.date_start).toLocaleString()}
                    <br />
                    {new Date(item.date_end).toLocaleString()}
                  </td>
                  <td>
                   {translate(" Min")} :
                    <br />
                    {translate("Max")} :
                    <br />
                    {translate("Avg")} :
                  </td>
                  <td>
                    {item.min_speed_engine} km/h
                    <br />
                    {item.max_speed_engine} km/h
                    <br />
                    {item.avg_speed_engine} km/h
                  </td>
                  <td>
                    {item.min_rotation_engine} {translate("rot/min")}
                    <br />
                    {item.max_rotation_engine} {translate("rot/min")}
                    <br />
                    {item.avg_rotation_engine} {translate("rot/min")}
                  </td>
                  <td>
                    {item.min_temperature_engine} °C
                    <br />
                    {item.max_temperature_engine} °C
                    <br />
                    {item.avg_temperature_engine} °C
                  </td>
                  <td>
                    {item.min_acceleration_engine} %
                    <br />
                    {item.max_acceleration_engine} %
                    <br />
                    {item.avg_acceleration_engine} %
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ minHeight: "300px", border: "1px solid #000" }}>
        <Linecharts {...sampleData} />
      </div>
        </>
      )}
    </>
  );
};

export default Report7;
