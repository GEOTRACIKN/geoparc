import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getReportName } from "../../utilities/functions";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import { useTranslate } from "../../components/LanguageProvider";
const backendUrl = process.env.REACT_APP_BACKEND_URL;



HighchartsExporting(Highcharts);

interface Report11Props {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

interface BarChartDataItem {
  name: string;
  y: number;
}

const Report11: React.FC<Report11Props> = ({ type_report, turn, id_report }) => {
  const [reportData, setReportData] = useState<any>({});
  const { translate } = useTranslate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/Rapport11/${id_report}`
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
  
  // Préparation des données pour le graphique à barres
  const barChartData: BarChartDataItem[] = (apiData.query2Result || []).map((item: any) => ({
    name: item.x,
    y: item.y,
  }));

  // Appliquer une échelle logarithmique à l'axe y
  const yAxisOptions: Highcharts.YAxisOptions = {
    title: {
      text: translate('Pourcentage'),
    },
    type: 'logarithmic',
  };

  // Appliquer un seuil minimal pour les valeurs
  const threshold = 10;
  const adjustedChartData = barChartData.map(item => ({
    name: item.name,
    y: item.y < threshold ? threshold : item.y,
  }));

  // Options du graphique à barres
  const barChartOptions: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: translate('Graphique à barres'),
    },
    xAxis: {
      categories: adjustedChartData.map(item => item.name),
    },
    yAxis: yAxisOptions,
    series: [{
      type: 'bar',
      name: translate('Pourcentage vitesse'),
      data: adjustedChartData.map(item => item.y),
    }],
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
            {new Date(apiData.query1Result[0].date_debut).toLocaleString()} {translate("Au")}{" "}
            {new Date(apiData.query1Result[0].date_fin).toLocaleString()}
          </h5>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h5> {[
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
                  {translate("Turn Report")}: {apiData.query1Result[0].turn_report || "N/A"}
                </th>
              </tr>
            </thead>
          </Table>

          <div style={{ minHeight: "300px", border: "1px solid #000" }}>
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          </div>
        </>
      )}
    </>
  );
};

export default Report11;
