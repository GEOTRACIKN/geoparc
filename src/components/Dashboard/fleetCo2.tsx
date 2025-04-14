import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Assurez-vous que `Highcharts` est correctement importé et les modules nécessaires sont installés
const FleetCo2: React.FC = () => {
  const options: Highcharts.Options = {
    chart: {
      type: 'column'
    },

    title: {
      text: '',
      align: 'left'
    },

    xAxis: {
      categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
      title: {
        text: 'Mois'
      }
    },

    yAxis: [
      {
        min: 0,
        title: {
          text: 'Consommation de Carburant (L)',
          style: {
            color: "red"
          }
        },
        labels: {
          format: '{value} L'
        }
      },
      {
        title: {
          text: 'Distance Parcourue (km)',
          style: {
            color: "blue"
          }
        },
        labels: {
          format: '{value} km'
        },
        opposite: true
      },
      {
        title: {
          text: 'Émissions de CO2 (kg)',
          style: {
            color: "green"
          }
        },
        labels: {
          format: '{value} kg'
        },
        opposite: true
      }
    ],

    tooltip: {
      shared: true,
      formatter: function () {
        if (!this.points) return '';
        let tooltip = `<b>${this.x}</b><br>`;
        this.points.forEach(point => {
          if (point.series) {
            tooltip += `<span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}<br>`;
          }
        });
        return tooltip;
      }
    },

    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },

    series: [
      {
        type: 'column', // Assurez-vous que le type de série est spécifié
        name: 'Consommation de Carburant',
        data: [120, 150, 170, 160, 180, 190],
        yAxis: 0,
        stack: 'carburant'
      },
      {
        type: 'column',
        name: 'Distance Parcourue',
        data: [1000, 1100, 1200, 1150, 1300, 1400],
        yAxis: 1,
        stack: 'distance'
      },
      {
        type: 'column',
        name: 'Émissions de CO2',
        data: [200, 220, 250, 240, 260, 270],
        yAxis: 2,
        stack: 'co2'
      }
    ]
  };

  return  <div className='card'>
      <div className="" style={{ padding: "20px" }}>
      <h6 className="box-title">
        <i className="las la-gas-pump" style={{ fontSize: "24px" }}></i>  Consommation de Carburant, Distance Parcourue et Émissions de CO2
      </h6>
    </div>
    <HighchartsReact highcharts={Highcharts} options={options} />
    </div>;
};

export default FleetCo2;
