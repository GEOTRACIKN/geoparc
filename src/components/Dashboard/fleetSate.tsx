import React from 'react';
import Highcharts from 'highcharts';
import { useTranslate } from "../LanguageProvider";
import variablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
// import { translate } from 'pdf-lib';


// Initialise le module variablepie
variablePie(Highcharts); 

interface Options {
  DrivingValue: number;
  ParckingValue: number;
  ParkingEngineRunningValue: number;
  LastTransmissionValue: number;
}


const FleetSate: React.FC<{ options: Options }> = ({ options }) => {

  const { translate } = useTranslate();

  const chartOptions = {
    chart: {
      type: 'variablepie',
    },
    title: {
      text: translate('Overview of your fleet'),
      align: 'center',
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        '<b>{point.y}</b> Vehicles<br/>' ,
    },
    
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 5
        },
        
        {
          enabled: true,
          distance: -100,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '16px',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [
      {
        minPointSize: 10,
        innerSize: '15%',
        zMin: 0,
        name: 'categories',
        borderRadius: 5,
        data: [
          { name: translate("Driving"), y: options.DrivingValue, z: 100 },
          { name: translate("Parcking"), y: options.ParckingValue, z: 100 },
          { name: translate("Stop with engine start"), y: options.ParkingEngineRunningValue, z: 100 },
         // { name: 'No transmission', y: options.LastTransmissionValue, z: 136 },
        ],
        colors: [
          '#00e272',
          '#2caffe',
          '#d7300c',
        //  '#343635',
        ],
        connectorWidth: 1,
        connectorColor: 'black',
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default FleetSate;
