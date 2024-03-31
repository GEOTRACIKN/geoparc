import React from 'react';
import Highcharts from 'highcharts';
import variablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';

// Initialise le module variablepie
variablePie(Highcharts); 

const FleetCo2 = () => {
  const options = {
      chart: {
          type: 'column'
      },
  
      title: {
          text: 'Surveillance des Émissions de CO2',
          align: 'left'
      },
  
      xAxis: {
          categories: ['Gold', 'Silver', 'Bronze']
      },
  
      yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
              text: 'Count medals'
          }
      },
  
      tooltip: {
          format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
              'Total: {point.stackTotal}'
      },
  
      plotOptions: {
          column: {
              stacking: 'normal'
          }
      },
  
      series: [{
          name: 'Norway',
          data: [148, 133, 124],
          stack: 'Europe'
      }, {
          name: 'Germany',
          data: [102, 98, 65],
          stack: 'Europe'
      }, {
          name: 'United States',
          data: [113, 122, 95],
          stack: 'North America'
      }, {
          name: 'Canada',
          data: [77, 72, 80],
          stack: 'North America'
      }]

  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};



export default FleetCo2;
