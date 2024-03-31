import React, { useEffect, useState } from "react";
import GanttChart, { GanttChartData } from "../Charts/Ganttchart";
import { useTranslate } from "../LanguageProvider";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  Distance,
  formatToTimestamp,
  toTimestamp,
} from "../../utilities/functions";
import Linecharts, { ChartData } from "../Charts/Linecharts";

interface VehicleWidgetProps {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

interface RecapItem {
  datetime: string;
  AVGHUM: string;
  AVGTEMP: number;
  LAT: number;
  LNG: number;
}

interface RecapData {
  date_debut: string;
  date_fin: string;
  immatriculation_vehicule: string;
  avg_temperature: number;
  avg_humidity: number;
  max_temperature: number;
  max_humidity: number;
  min_temperature: number;
  min_humidity: number;
}





interface toChartData {
  x: number; // Assurez-vous que la fonction ToUTCTime retourne une chaîne
  y: number;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Report19: React.FC<VehicleWidgetProps> = ({
  type_report,
  turn,
  id_report,
}) => {
  const { translate } = useTranslate();
  const [loading, setLoading] = useState(true);
  const [lineChartOptions, setChartOptions] = useState({});
  const [recapData, setRecapData] = useState<RecapData[]>([]);
  const [Temperature, settemperature] = useState<toChartData[]>([]);
  const [Humidity, sethumidity] = useState<toChartData[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${backendUrl}/api/Report19/${id_report}`, {
          mode: "cors",
        });

        const reportData = await res.json();
        const recap = reportData["repport"];
        const Data = reportData["repportDatas"];

        setRecapData(
          recap.map((item: any) => {
            return {
              immatriculation_vehicule: item["immatriculation_vehicule"],
              date_debut: item["date_end"],
              date_fin: item["date_start"],
              avg_temperature: item["avg_temperature"],
              avg_humidity: item["avg_humidity"],
              max_temperature: item["max_temperature"],
              max_humidity: item["max_humidity"],
              min_temperature: item["min_temperature"],
              min_humidity: item["min_humidity"],
            };
          })
        );






        const temperature: toChartData[] = Data.map((item: any) => ({
          x: ToUTCTime(item.datetime),
          y: parseFloat(item.temperature) ,
        }));



        const humidity: toChartData[] = Data.map((item: any) => ({
          x: ToUTCTime(item.datetime),
          y: parseFloat(item.humidity),
        }));



        settemperature(temperature);
        sethumidity(humidity);



        setChartOptions({
          chart: {
            zoomType: "x",
          },
          title: {
            text: translate(""),
            align: "center",
          },
          subtitle: {
            text: translate("Data values are averaged per period. Zoom to view more data"),
            align: "center",
          },
          xAxis: [
            {
              gridLineWidth: 1,
              type: "datetime",
              crosshair: true,
            },
          ],
          yAxis: [
            {
              labels: {
                format: "{value} C°",
                style: {
                  color: "#fd1e0d",
                },
              },
              title: {
                text: translate("Temperature"),
                style: {
                  color: "#fd1e0d",
                },
              },
              opposite: true,
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Humidity"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} %",
                style: {
                  color: "#0080FF",
                },
              },
            },
          ],
          tooltip: {
            shared: true,
          },
          legend: {
            layout: "horizontal",
            align: "center",
            x: 0,
            verticalAlign: "bottom",
            y: 21,
            floating: true,
          },
          series: [
            {
              name: translate("Temperature"),
              type: "spline",
              olor: "#41b346", // Typo: should be "color" instead of "olor"
              yAxis: 0, // Assuming this should be yAxis index 0 for Temperature
              data: temperature, // Using state variable Temperature
              tooltip: {
                valueSuffix: " C°",
              },
            },
            {
              name: translate("Humidity"),
              type: "spline",
              color: "#41b346", // Typo: should be a different color than the first series
              yAxis: 1, // Assuming this should be yAxis index 1 for Humidity
              data: humidity, // Using state variable Humidity 
              tooltip: {
                valueSuffix: " %",
              },
            },
          ],

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    floating: false,
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                  },
                  yAxis: [
                    {
                      labels: {
                        align: "right",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      labels: {
                        align: "left",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      visible: false,
                    },
                  ],
                },
              },
            ],
          },
        });


      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_report]);

  function ToUTCTime(isoDateString: string): number {
    const dateComponents = isoDateString.split(/[-T:.Z]/);
    const start_date = dateComponents.map((component) =>
      parseInt(component, 10)
    );

    return Date.UTC(
      start_date[0],
      start_date[1] - 1,
      start_date[2],
      start_date[3],
      start_date[4],
      start_date[5],
      0
    );
  }



  const round = (value: number, decimals: number) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  };

  return (
    <>
      {loading ? (
        <div className="text-center">
          <PropagateLoader color={"#123abc"} loading={loading} size={20} />
        </div>
      ) : (
        <>
          <div className="row">
            <h4 className="col-sm-6 col-md-6">
              <i
                className="las la-chart-bar"
                data-rel="bootstrap-tooltip"
                title="Increased"
              ></i>{" "}
              {translate("[RHT] Temperature diagram")} 
            </h4>
            <div className="col-sm-6 col-md-6 ">
              <div
                id="DataTables_Table_0_filter"
                className="float-right dataTables_filter mr-3"
              >
                <a href="#" className="btn btn-outline-info ">
                  <i className="las la-file-excel"></i>
                  {translate("Download")} Excel
                </a>
              </div>
            </div>
          </div>
          <div className="table-responsive">
        
            <table className="table table-condensed" style={{fontSize: "16px" }}> 
              <thead>
                <tr>
                <th colSpan={4} style={{ textAlign: 'left' }}>  {`Nr. Tournée: ${turn} ,  ${recapData[0]["immatriculation_vehicule"]}`}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ textAlign: 'left' }}>Capteur: {recapData[0]["immatriculation_vehicule"]}</th>
                  <th style={{ textAlign: 'right' }}>Min</th>
                  <th style={{ textAlign: 'right' }}>Max</th>
                  <th style={{ textAlign: 'right' }}>Moyenne</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>Température</td>
                  <td style={{ textAlign: 'right' }}>{recapData[0]["min_temperature"]} °C</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{recapData[0]["max_temperature"]} °C</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{recapData[0]["avg_temperature"]} °C</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>Humidité</td>
                  <td style={{ textAlign: 'right' }}>{recapData[0]["min_humidity"]} %</td>
                  <td style={{ textAlign: 'right' }}>{recapData[0]["max_humidity"]} %</td>
                  <td style={{ textAlign: 'right' }}>{recapData[0]["avg_humidity"]} %</td>
                </tr>
              </tbody>
            </table>
          </div> 
          <div className="table-responsive">
            <HighchartsReact
              highcharts={Highcharts}
              options={lineChartOptions}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Report19;
