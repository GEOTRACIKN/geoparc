import React, { useEffect, useState } from "react";
import { useTranslate } from "../../components/LanguageProvider";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

interface ApiDataType {
  immatriculation: {
    immatriculation_vehicule: string;
    date_creation: string;
    date_debut: string;
    date_fin: string;
  }[];
  repportDatas: {
    x: string;
    y: number;
    speed_range: string;
    duration: string;
    percent: string;
    start: string;
  }[];
}

const Report12: React.FC<Props> = ({ id_report, turn }) => {
  const [data, setData] = useState<ApiDataType | null>(null);

  const { translate } = useTranslate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/report12/${id_report}`);
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données depuis l'API.", error);
      }
    };

    fetchData();
  }, [id_report]);

  const hasNoData = !(data && data.repportDatas && data.repportDatas.length > 0);

  const debutDate = data?.immatriculation && data?.immatriculation[0]?.date_debut ? new Date(data?.immatriculation[0]?.date_debut).toLocaleString() : "";
const finDate = data?.immatriculation && data?.immatriculation[0]?.date_fin ? new Date(data?.immatriculation[0]?.date_fin).toLocaleString() : "";
const imatriculation = data?.immatriculation[0]?.immatriculation_vehicule ;


 // Create Highcharts series configuration
  const extractedSeriesData = data?.repportDatas.map((item) => ({ y: item.y, name: item.speed_range }));
  const extractedCategories = data?.repportDatas.map((item) => item.x);
    

  let contentToRender;
  if (hasNoData) {
    contentToRender = <p>{translate('No data available')}.</p>;
  } else {
    const options: Highcharts.Options = {
      chart: {
        type: "bar"
      },
      title: {
        text: `${translate('Tour Number')}: ${turn} / ${translate('Vehicle')}: ${imatriculation}`,
        align: 'left',
        verticalAlign: 'top',
        margin: 20
      },
      xAxis: {
        categories: extractedCategories,
        title: {
          text: `${translate("Speed range (km/h)")}`
        },
        gridLineWidth: 1,
        lineWidth: 1,
        labels: {}
      },
      yAxis: {
        min: 0,
        title: {
          text: `${translate("Percentage of time spent per speed range")}`
        },
        labels: {
          overflow: "justify"
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: "%"
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          dataLabels: {
            enabled: true,
            formatter() {
              return `${this.y} %`;
            },
          },
          groupPadding: 0
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: "bar",
          name: `${translate("Speed Statistics")}`,
          data: extractedSeriesData
        }
      ]
    };

    contentToRender = <HighchartsReact highcharts={Highcharts} options={options} />;
  }

  return (
    <div className="w-full h-[30rem] p-4 bg-white shadow rounded-lg sm:p-6 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between gap-x-4">
      <h6 className="col-sm-6 col-md-6">
              <i className="las la-chart-bar" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Speed reports")} {translate('From')} {' '}
              <span style={{ color: '#3468C0' }}>{debutDate}</span> {translate('To')} {' '}
              <span style={{ color: '#3468C0' }}>{finDate}</span>
            </h6>
    
      </div>
        
      {contentToRender}
    </div>
  );
};

export default Report12;