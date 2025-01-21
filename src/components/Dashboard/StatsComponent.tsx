import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import { useTranslate } from "../../hooks/LanguageProvider";

import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
import { MoonLoader } from "react-spinners"; // Importez MoonLoader

// Initialisez les modules Highcharts nécessaires
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface StatsData {
  stats: {
    maxVitesse: number;
    moyVitesse: number;
    distance: number;
  };
  sog: {
    vitesse: number;
  }[];
}

interface StatsComponentProps {
  psn: string; // Ajoutez une prop pour le PSN
}

const StatsComponent: React.FC<StatsComponentProps> = ({ psn }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { translate } = useTranslate();

  useEffect(() => {
    fetchData();
  }, [psn]); // Re-fetch data when PSN changes

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const currentDate = new Date();
    const dateD = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0).toISOString();
    const dateF = currentDate.toISOString();

    try {
      const response = await axios.post<StatsData>(`${backendUrl}/api/getStats`, {
        dateD: dateD,
        dateF: dateF,
        PSN: psn // Utilisez le PSN fourni
      });
      setStats(response.data);
    } catch (error: any) {
      setError(error.message || 'Internal Server Error');
    }

    setLoading(false);
  };

  const renderChart = () => {
    if (!stats) return null;
  
    const gaugeOptions: Highcharts.Options = {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text: translate("Speedometer"),
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 0 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%'
        }]
      },
      yAxis: {
        min: 0,
        max: 200, // Définissez la valeur maximale pour votre jauge
        stops: [[0.1, '#55BF3B'], [0.5, '#DDDF0D'], [0.9, '#DF5353']],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: 'auto',
        tickAmount: 2,
        title: {
          // text:"Speedometer",
          y: -70
        },
        labels: {
          y: 16
        }
      },
      series: [{
        type: 'solidgauge', // Ajoutez cette ligne
        name: 'Speed',
        data: [{
          y: stats.sog[0]?.vitesse || 0,
          color: '#55BF3B'
        }],
        tooltip: {
          valueSuffix: ' km/h'
        }
      }]
    };
  
    return <HighchartsReact highcharts={Highcharts} options={gaugeOptions} />;
  };

  return (
    <div className='container'>
      {loading && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MoonLoader size={50} color={"#36D7B7"} loading={loading} />
      </div>}
      {error && <div>Error: {error}</div>}
      {stats && (
        <div className="bg-light rounded p-3 shadow-sm">
          <h2 style={{ fontSize: '18px', color: '#000000', fontWeight: 700 }}>{translate("Statistiques")} :  <i className="las la-sync" onClick={fetchData} style={{ cursor: 'pointer' }}></i></h2> 
               
          <p style={{ fontSize: '14px', color: '#000000', display: 'flex', alignItems: 'center' }}>
            {translate("Max")} {translate("Vitesse")} :  {stats.stats.maxVitesse ? stats.stats.maxVitesse.toFixed(2) : 'N/A'} {translate("km/h")} 
          </p>
          <p style={{ fontSize: '14px', color: '#000000', display: 'flex', alignItems: 'center' }}>
            {translate("Avg")} {translate("Vitesse")} :  {stats.stats.moyVitesse ? stats.stats.moyVitesse.toFixed(2) : 'N/A'} {translate("km/h")}
          </p>
          <p style={{ fontSize: '14px', color: '#000000', display: 'flex', alignItems: 'center' }}> 
            <i className="las la-route"></i> : {stats.stats.distance ? stats.stats.distance / 1000 : 'N/A'} {translate("km")}
          </p>
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default StatsComponent;
