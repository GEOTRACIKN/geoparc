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
  date_debut: string;
  date_fin: string;
  total_odometer: string;
  total_fuel_lvl: number;
  total_fuel: number;
}

interface RecapData {
  date_debut: string;
  date_fin: string;
  immatriculation_vehicule?: string;
  total_odometer: string;
  total_fuel_lvl: number;
  total_fuel: number;
}

interface toChartData {
  x: number; // Assurez-vous que la fonction ToUTCTime retourne une chaîne
  y: number;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Report45: React.FC<VehicleWidgetProps> = ({
  type_report,
  turn,
  id_report,
}) => {
  const { translate } = useTranslate();
  const [loading, setLoading] = useState(true);
  const [lineChartOptions, setChartOptions] = useState({});
  const [recapData, setRecapData] = useState<RecapData[]>([]);
  const [Distance, setDistance] = useState<toChartData[]>([]);
  const [FuelUsage, setFuelUsagee] = useState<toChartData[]>([]);
  const [FuelLevel, setFuelLevel] = useState<toChartData[]>([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${backendUrl}/api/report8/${id_report}`, {
          mode: "cors",
        });

        const reportData = await res.json();
        const recap = reportData["repport"];
        const Data = reportData["repportDatas"];

        setRecapData(
          recap.map((item: any) => {
            return {
              immatriculation_vehicule: item["immatriculation_vehicule"],
              date_debut: item["date_debut"],
              date_fin: item["date_fin"],
              total_odometer: item["total_odometer"],
              total_fuel_lvl: item["total_fuel_lvl"],
              total_fuel: item["total_fuel"],
            };
          })
        );

         const distance: toChartData[] = Data.map((item: any) => ({
          x: ToUTCTime(item.datetime),
          y: parseFloat(item.Odometer) / 1000,
        }));

        const fuelUsage: toChartData[] = Data.map((item: any) => ({
          x: ToUTCTime(item.datetime),
          y: parseFloat(item.TFUEL),
        }));

       

        const fuelLevel: toChartData[] = Data.map((item: any, index: number, array: any[]) => {
          const currentFuelLevel = parseFloat(item.FUELLVL);
          const initialFuelLevel = parseFloat(array[0].FUELLVL);
        
          // Calculate CO2 emissions based on the difference between the first and current fuel levels
          const co2Emissions = Math.abs((currentFuelLevel - initialFuelLevel) / 0.84);
        
          return {
            x: ToUTCTime(item.datetime),
            y: co2Emissions,
          };
        });
        
        
        
  
        setDistance(distance);
        setFuelUsagee(fuelUsage);
        setFuelLevel(fuelLevel); 
    

        setChartOptions({
          chart: {
            zoomType: "x",
          },
          title: {
            text: translate("Empreinte carbone (CO2)"), 
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
                format: "{value} Kg",
                style: {
                  color: "#fd1e0d",
                },
              },
              title: {
                text: translate("Co2"),
                style: {
                  color: "#fd1e0d",
                },
              },
              opposite: true,
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Odometer"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} Km",
                style: {
                  color: "#0080FF",
                },
              },
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Fuel consumption"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} L",
                style: {
                  color: "#0080FF",
                },
              },
              opposite: true,
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
              name: translate("Odometer"),
              type: "spline",
              olor: "#41b346",
              yAxis: 1,
              data: distance,
              tooltip: {
                valueSuffix: " Km",
              },
            },
            {
              name:  translate("Fuel consumption"),
              type: "spline",
              color: "#41b346",
              yAxis: 2,
              data: fuelUsage,
              /*marker: { 
                    enabled: true
                },*/
              // dashStyle: 'shortdot',
              tooltip: {
                valueSuffix: " L", 
              },
            },
            {
              name: translate("Co2"),
              type: "line",
              color: "#fd1e0d",
              data: fuelLevel,
              tooltip: {
                valueSuffix: "Kg",
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

        console.log(lineChartOptions);
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

  const calculateFuelConsumption = () => {
    const odometerDifference = Distance[Distance.length - 1].y - Distance[0].y;
    const fuelDifference = FuelUsage[FuelUsage.length - 1].y - FuelUsage[0].y;
   
  
    if (odometerDifference !== 0) {
      const fuelConsumption = (100 * fuelDifference) / odometerDifference;
      return round(fuelConsumption, 2);
    } else {
      return 0;
    }
  };

  const calculateCO2Emissions = () => {
    const lastFuelLevel = FuelLevel[FuelLevel.length - 1].y;
    const firstFuelLevel = FuelLevel[0].y;
  
    if (lastFuelLevel !== firstFuelLevel) {
      const emissionsCO2 = Math.abs((lastFuelLevel - firstFuelLevel) / 0.84);
      return round(emissionsCO2, 2);
    } else {
      return 0;
    }
  };

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
        <h6 className="col-sm-6 col-md-6">
        <i className="las la-cloud" data-rel="bootstrap-tooltip" title="Nuage de CO2"></i> Rapport de calcul de l'empreinte carbone (CO2) du{' '}
            <span style={{ color: '#3468C0' }}>{formatToTimestamp(recapData[0].date_debut)}</span> au{' '}
            <span style={{ color: '#3468C0' }}>{formatToTimestamp(recapData[recapData.length - 1].date_fin)}</span>
        </h6>
        <div className="col-sm-6 col-md-6 " style={{ padding: '10px' }} >
            <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
                <a href="#" className="btn btn-outline-success ">
                <i className="las la-file-excel"></i> 
                Download Excel
                </a> 
            </div>
        </div>
        </div>
          <div className="table-responsive">
            <table
              className="table table-condensed"
              style={{ fontSize: "16px" }}
            >
              <thead  className="bg-white">
                <tr className="ligth ligth-data">
                <th colSpan={8} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}> 
                <div style={{ float: 'left' }}>
                 {translate("No. Tour")}: {turn} /  {translate("Vehicle")} :  {recapData[0]["immatriculation_vehicule"]}
                </div>
                <div style={{ float: 'right' }}>
                {formatToTimestamp(recapData[0].date_debut)}
                </div>
                </th>
            </tr >
                <tr  className="ligth ligth-data" style={{ textAlign: "left" }}>
                  <th style={{ textAlign: "left" }}>{translate('Date')}/{translate('Time')}</th>
                  <th style={{ textAlign: "left" }}> {translate('Fuel type')}</th>
                  <th style={{ textAlign: "left" }}>{translate('Tank capacity')} (L) </th>
                  <th style={{ textAlign: "left" }}>{translate('Odometer')}</th>
                  
                  <th style={{ textAlign: "right" }}>
                    {translate('Total fuel used')} 
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                    {formatToTimestamp(recapData[0].date_debut)}
                  </td>
                  <td > Diesel</td>
                  <td > 360</td>
                  <td style={{ textAlign: "left" }}> {Distance[0].y} Km</td>
                  <td style={{ textAlign: "right" }}>{FuelUsage[0].y} L</td>
                </tr> 
                <tr>
                <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                  {formatToTimestamp(recapData[recapData.length - 1].date_fin)}
                </td>
                  <td style={{ textAlign: "right" }}> </td>
                  <td style={{ textAlign: "right" }}></td>

                  <td style={{ textAlign: "left" }}> {Distance[Distance.length-1].y} Km</td>
                 
                  <td style={{ textAlign: "right" }}>{ FuelUsage[FuelUsage.length-1].y} L</td>
                </tr>
              </tbody>
              <tfoot>
                <tr> 
                  <td style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                    <strong>{translate('Difference')} </strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>{round((Distance[Distance.length-1].y-Distance[0].y),4) *1000} km</strong>
                  </td>
                  
                  <td style={{ textAlign: "right" }}>
                    <strong>{round(( FuelUsage[FuelUsage.length-1].y-FuelUsage[0].y ),2)} L</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", whiteSpace: "nowrap" }}> 
                    <strong>{translate('Fuel consumption')}</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>&nbsp;</td>
                  <td style={{ textAlign: "right" }}>&nbsp;</td>
                  <td style={{ textAlign: "right" }}>
                    <strong>{calculateFuelConsumption()/1000} L/100 km</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", whiteSpace: "nowrap" }}> 
                    <strong>Emission de CO2</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>&nbsp;</td>
                  <td style={{ textAlign: "right" }}>&nbsp;</td>
                  <td style={{ textAlign: "right" }}>
                    <strong>{calculateCO2Emissions()} (Kg)</strong>
                  </td>
                </tr>
              </tfoot>
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

export default Report45;
