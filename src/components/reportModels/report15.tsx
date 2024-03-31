import React, { useEffect, useState } from "react";
import GanttChart, { GanttChartData } from "../Charts/Ganttchart";
import { useTranslate } from "../LanguageProvider";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highcharts-gantt";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Distance, formatToTimestamp, toTimestamp } from "../../utilities/functions";


interface VehicleWidgetProps {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

interface RecapDataType {
  avg_speed: number;
  date_end: string;
  date_start: string;
  driving_duration: string;
  immatriculation_vehicule?: string;
  max_speed: string;
  parking_duration: string;
  total_distance: number;
  total_duration: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Report15: React.FC<VehicleWidgetProps> = ({ type_report, turn, id_report }) => {
  const { translate } = useTranslate();
  const [loading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] =useState({});
  const [recapData, setRecapData] = useState<RecapDataType[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 

        const res = await fetch(
          `${backendUrl}/api/report15/${id_report}`,
          { mode: 'cors' }
        );

        const reportData = await res.json();
        const data = reportData["repportDatas"];
        const recap = reportData["repport"];

       setRecapData(recap.map((item: any) => {

          return {
            avg_speed: item["avg_speed"],
            date_end: item["date_end"],
            date_start: item["date_start"],
            driving_duration: item["driving_duration"],
            immatriculation_vehicule: item["immatriculation_vehicule"],
            max_speed: item["max_speed"],
            parking_duration: item["parking_duration"],
            total_distance: item["total_distance"],
            total_duration: item["total_duration"],
          };

        }));

        
        Highcharts.setOptions({
          lang: {
            months: [translate('January'), translate('February'), translate('March'), translate('April'), translate('May'), translate('June'), translate('July'), translate('August'), translate('September'), translate('October'), translate('November'), translate('December') ],
            weekdays: [translate('Sunday'), translate('Monday'), translate('Tuesday'), translate('Wednesday'), translate('Thursday'), translate('Friday'), translate('Saturday')]
          }
        });

        const seriesData = data.map((item:any) => {

          const start_date = ToUTCTime(item["start"]);
          const end_date = ToUTCTime(item["end"]);
          const color = item["name"] === "Moteur arrêté" ? "#4c4cff" : "#33b219";

          return {
            start: start_date,
            end: end_date,
            color: color,
            name: item["name"]
          };
          
        });

        setChartOptions(    {
          chart: {
            
            height:  400, 
          },
          title: {
            text: "",
        },
      
        yAxis: {
            uniqueNames: true,
        },
      
        navigator: {
            enabled: true,
            liveRedraw: true,
            series: {
                type: "gantt",
                pointPlacement: 0.5,
                pointPadding: 0.25,
                accessibility: {
                    enabled: true,
                },
            },
            yAxis: {
                min: 0,
                max: 3,
                reversed: true,
                categories: [],
            },
        },
      
        scrollbar: {
            enabled: true,
        },
      
        rangeSelector: {
            enabled: true,
            selected: 0,
        },
      
        accessibility: {
            point: {
                descriptionFormatter: function (point:any) {
                    var completedValue = point.completed ? point.completed.amount || point.completed : null,
                        completed = completedValue ? " Task " + Math.round(completedValue * 1000) / 10 + "% completed." : "";
                    return Highcharts.format("{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.", { point, completed });
                },
            },
            series: {
                descriptionFormatter: function (series:any) {
                    return series.name;
                },
            }, 
        },
      
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: "The chart has a two-part X axis showing time in both week numbers and days.",
                    yAxisDescriptionPlural: "The chart has one Y axis showing task categories.",
                },
            },
        },
        series: [
            {
                name: "",
                data: seriesData,
            },
        ],
        });



   
      } catch (error) {
        console.error(error);
        // Handle the error, e.g., display a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_report]);

function ToUTCTime(isoDateString: string): number {
  const dateComponents = isoDateString.split(/[-T:.Z]/);
  const start_date = dateComponents.map(component => parseInt(component, 10));

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

  return (
    <>
       {loading ? (
          <div className="text-center">
            <PropagateLoader color={'#123abc'} loading={loading} size={20} />
          </div>
        ) : (
        <>
      <div className="row">
        <h4 className="col-sm-6 col-md-6">
         <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate('Gantt chart on contact')} 
        </h4>
        <div className="col-sm-6 col-md-6 " >
          <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
            <a href="#" className="btn btn-outline-info ">
              <i className="las la-file-excel"></i> 
              {translate('Download')} Excel
            </a> 
          </div>
        </div>
    </div>
    <div className="table-responsive" >
      <table className="table table-condensed" style={{  fontSize: '14px', width: '100%' }}>
        <thead>
          <tr>
            <th colSpan={4} style={{ textAlign: 'left' }}>  {`Nr. Tournée: ${turn} ,  ${recapData[0]["immatriculation_vehicule"]}`}</th>
          </tr>
        </thead> 
        <tbody>
          <tr>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Total distance')}</strong>
            </td>
            <td>{Distance(recapData[0]["total_distance"])}</td>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Total duration')}</strong>
            </td>
            <td>{recapData[0]["total_duration"]}</td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Maximum speed')}</strong>
            </td>
            <td>{recapData[0]["max_speed"]} km/h</td>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Driving time')}</strong>
            </td>
            <td>{recapData[0]["driving_duration"]}</td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Average speed')}</strong>
            </td>
            <td>{recapData[0]["avg_speed"]} km/h</td>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Parking duration')}</strong>
            </td>
            <td>{recapData[0]["parking_duration"]}</td>
          </tr>
          <tr>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('Start date')}</strong>
            </td>
            <td>{toTimestamp(recapData[0]["date_start"])}</td>
            <td>
              <i className="fa fa-caret-right"></i>
              <strong>{translate('End date')}</strong>
            </td>
            <td>{toTimestamp(recapData[0]["date_end"])}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="table-responsive">
        <HighchartsReact constructorType="ganttChart" highcharts={Highcharts}  options={chartOptions} />
    </div>
    </> )}
    </>
  );
};

export default Report15;
