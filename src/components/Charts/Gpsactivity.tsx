import React, { useEffect, useState, useLayoutEffect  } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';
import HighchartsExporting from 'highcharts/modules/exporting';
import { useTranslate } from "../LanguageProvider";
import { ClipLoader } from 'react-spinners';



const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DataPoint {
  TEMPS: string; // Remplacez par le type réel
  SOG: number;   // Remplacez par le type réel
  EtatM:number;  // Remplacez par le type réel
  cumulativeDifference: number;
}
interface StatsResult {
  maxVitesse: number;
  moyVitesse: string;
  distance: number;
}

HighchartsExporting(Highcharts);


const LineChartComponent: React.FC<{ psnDispositif: string }> = ({ psnDispositif }) => {
  const [lineChartData, setLineChartData] = useState<DataPoint[]>([] ?? []);
  const [statsResult, setStatsResult] = useState<StatsResult>({ maxVitesse: 0, moyVitesse: "", distance: 0 });
  const [tempsMarche, setTempsMarche] = useState<{ heures: number, minutes: number, secondes: number } | null>(null);
  const [tempsArret, setTempsArret] = useState<{ heures: number, minutes: number, secondes: number } | null>(null);
const [showDataTable, setShowDataTable] = useState(false);
const { translate } = useTranslate();
const [loading, setLoading] = useState(true);



  const cumulativeDifferenceSeries = {
    name: translate('Distance'),
    data: lineChartData.map((dataPoint) => dataPoint.cumulativeDifference),
    color: 'blue',
    yAxis: 2, // Utilisez un nouvel axe y pour cette série
    type: 'line',
    cursor: 'pointer',
    tooltip: {
      valueSuffix: ' km',
    },
  };
  
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const dateD = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0).toISOString();
        const dateF = currentDate.toISOString();
        const response = await fetch(`${backendUrl}/api/calculateStats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateD: dateD,
            dateF: dateF,
            PSN: psnDispositif,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
  
          setLineChartData(data.lineChart);
          setStatsResult(data.statsResult);
          setTempsMarche(data.tempsMarche);
          setTempsArret(data.tempsArret);
        } else {
          console.error('La requête a échoué avec le statut:', response.status);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données de l\'API:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData(); // Appel de la fonction asynchrone à l'intérieur de useLayoutEffect
  }, [psnDispositif]);
  

  

  const chartOptions = {
    chart: {
      type: 'line',
      zoomType: 'x',
    },
    title: {
      text: translate('Diagramme de distance, vitesse et contact'),
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen',
            'printChart',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
            'downloadCSV',
            'downloadXLS',
          ],
        },
      },
    },

    data: {
      // Spécifiez vos données supplémentaires ici
      columns: [
        { name: translate('Temps'), type: 'datetime', dateFormat: '%H:%M:%S' },
        { name: translate('Distance'), type: 'number' },
        { name: translate('Vitesse'), type: 'number' },
        { name: translate('Contact'), type: 'number' },
      ],
      rows: lineChartData.map((dataPoint) => [
        dataPoint.TEMPS,
        dataPoint.SOG,
        dataPoint.EtatM,
        dataPoint.cumulativeDifference,
      ]),
    },
    xAxis: {
      categories: lineChartData.map((dataPoint) =>dataPoint.TEMPS),
    },
   
    series: [
      {
        name: translate('Vitesse'),
        data: lineChartData.map((dataPoint) => dataPoint.SOG),
        color: 'green',
        cursor: 'pointer',           

        
      },
      {
        name: translate('Contact'),
        data: lineChartData.map((dataPoint) => dataPoint.EtatM),
        yAxis: 1, // Associer la série à l'axe y secondaire
        color: 'red',
        cursor: 'pointer',           

      },
    
    ],
    
    
    yAxis: [
      {
        title: {
          text: translate('Vitesse'),
          color: 'green',
        },
      },
      {
        title: {
          text: translate('Contact'),
          color: 'red',
        },
        opposite: true,
      },
      {
        title: {
          text: translate('Distance'),
          color: 'blue',
        },
        opposite: true,
      },
    ],
  };
  const renderMaxSpeedStatus = () => {
    if (statsResult.maxVitesse > 90) {
      return (
        <>
          <i className="las la-tachometer-alt" style={{ color: "red" }}></i>
          <span style={{ color: "red" }}> {translate("Excès de vitesse")}</span>
        </>
      );
    } else {
      return (
        <>
          <i className="las la-tachometer-alt" style={{ color: "green" }}></i>
          <span style={{ color: "green" }}>
            {" "}
            {translate("Pas d'excès de vitesse")}
          </span>
        </>
      );
    }
  };
  
  chartOptions.series.push(cumulativeDifferenceSeries);
  return (
<div className="container">
{loading && (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    )}
     {!loading && (
  <div className="row">
    <div className="col-md-3 col-sm-12"> {/* Ajusté la largeur de la colonne des statistiques sur les écrans larges */}
      <div className="border p-3">
        <h2 style={{ fontSize: '18px', color: '#000000', fontWeight: 700 }}>{translate("Statistiques")} :</h2>
        <p style={{ fontSize: '18px', color: '#000000', display: 'flex', alignItems: 'center' }}>{translate("Max")} {translate("Vitesse")} : {statsResult.maxVitesse} {translate("km/h")} </p>
        <p style={{ fontSize: '18px', color: '#000000', display: 'flex', alignItems: 'center' }}>{translate("Avg")} {translate("Vitesse")} : {statsResult.moyVitesse} {translate("km/h")}</p>
        <p style={{ fontSize: '18px', color: '#000000', display: 'flex', alignItems: 'center' }}> {renderMaxSpeedStatus()}</p>
        <p style={{ fontSize: '18px', color: '#000000', display: 'flex', alignItems: 'center' }}> <i className="las la-route"></i> : {statsResult.distance} {translate("km")}</p>
        {tempsMarche && (
          <p style={{ fontSize: '18px', color: '#4D089A', display: 'flex', alignItems: 'center' }}>
            <i className="las la-truck-moving"></i> : {tempsMarche.heures}h {tempsMarche.minutes}m {tempsMarche.secondes}s
          </p>
        )}

        {/* Afficher l'icône pour le Temps d'arrêt */}
        {tempsArret && (
          <p style={{ fontSize: '18px', color: '#323EDD', display: 'flex', alignItems: 'center' }}>
            <i className="las la-parking"></i> : {tempsArret.heures}h {tempsArret.minutes}m {tempsArret.secondes}s
          </p>
        )}
      </div>
    </div>
    <div className="col-md-9 col-sm-12" style={{border: "1px solid #000"}}> {/* Ajusté la largeur de la colonne du graphique sur les écrans larges */}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  </div>
    )}
</div>
   



  );
};
export default LineChartComponent;
