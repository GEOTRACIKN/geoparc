import React from 'react';
import Highcharts, { Options, ChartOptions, SeriesLineOptions, SeriesSplineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export interface SeriesData {
  name: string;
  unit: string,
  description: string;
  data:  { x: number, y: number }[];
  color?: string; // Nouvelle propriété pour la couleur de la série
  type?: string; // Nouvelle propriété pour le type de série
  yAxis?: number;
 
  yAxisState?: boolean;
  labels?: {
    format?: string;
    style?: {
      color?: string;
    };
  };
}
 
export interface ChartData {
  chartTitle: string;
  chartTitleAlign: Highcharts.AlignValue | undefined | string;
  series: SeriesData[];
  enabledLegend?: boolean;
  height?: number;
  
}

const Linecharts: React.FC<ChartData> = ({ chartTitle, chartTitleAlign, series, enabledLegend, height }) => {
  const options: Options = {
    chart: {
      type: 'spline',
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      borderWidth: 0,
      height: height, // Set the height of the chart to 100% of its container
      
    },
    title: {
      text: chartTitle,
      align: chartTitleAlign as Highcharts.AlignValue | undefined,
      style: {
        color: '#333',
        fontSize: '16px',
      },
    },

    
    
    xAxis: [{
      gridLineWidth: 1,
      type: 'datetime',
      crosshair: true,
      labels: {
        style: {
          color: '#333',
        },
      },
    }],
    yAxis: series.map((serie, index) => ({
      title: {
        text: serie.description,
        style: {
          color: serie.color || '#000',
        },
      },
      opposite: index % 2 === 0, // Alternating opposite for each yAxis
      labels: serie.labels,
      visible: serie.yAxisState,
    })),
    tooltip: {
      shared: true,
    },
    
    
    
    series: series.map((serie, index) => ({
      name: serie.name,
      type: serie.type || 'line', // Assurez-vous que le type est défini comme 'line' par défaut
      data: serie.data,
      yAxis: index, // Utilisez un index unique pour chaque yAxis
      color: serie.color,
      tooltip: {
        valueSuffix: serie.unit,
      },
    } as SeriesLineOptions | SeriesSplineOptions)),
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1000,
          },
          chartOptions: {
            legend: {
              floating: false,
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              enabled: false,
            },
            yAxis: series.map((serie) => ({
              labels: {
                align: serie.yAxis !== undefined ? 'right' : 'left',
                x: 0,
                y: -6,
              },
              showLastLabel: false,
            })),
          },
        },
      ],
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: 1800, // Adjust the width of the exported chart
          height: 1200, // Adjust the height of the exported chart
        },
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};


export default Linecharts;
