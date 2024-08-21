import React from 'react';
import Highcharts from 'highcharts';
import variablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';

variablePie(Highcharts);

interface Options {
  maintenanceCosts: number;
  missionCosts: number;
  fuelCosts: number;
  legalCosts: number;
  employeeCosts: number;
  hseCosts: number;
}

const FleetSate: React.FC<{ options: Options }> = ({ options }) => {



  const FleetData = [
    { y: options.maintenanceCosts, label: 'Coûts de Maintenance', name: 'Maintenance' },
    { y: options.missionCosts, label: 'Coûts des Missions', name: 'Missions' },
    { y: options.fuelCosts, label: 'Coûts de Carburant', name: 'Carburant' },
    { y: options.legalCosts, label: 'Coûts Juridiques', name: 'Juridiques' },
    { y: options.employeeCosts, label: 'Coûts des Employés', name: 'Employés' },
    { y: options.hseCosts, label: 'Coûts HSE', name: 'HSE' },
  ];

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: '',
      align: 'center',
    },
    tooltip: {
      pointFormat: '<b>{point.label}</b>: {point.y} DZD',
    },
    plotOptions: {
      pie: {
        startAngle: 40,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.label} - {point.percentage:.1f} %',
        },
        showInLegend: true,
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemMarginTop: 10,
      itemMarginBottom: 10,
      labelFormatter: function (this: Highcharts.Point): string {
        return `${this.name}`;
      }
    },
    series: [
      {
        name: 'Répartition des Coûts',
        colorByPoint: true,
        data: [
          { y: options.maintenanceCosts, label: 'Coûts de Maintenance', name: 'Maintenance' },
          { y: options.missionCosts, label: 'Coûts des Missions', name: 'Missions' },
          { y: options.fuelCosts, label: 'Coûts de Carburant', name: 'Carburant' },
          { y: options.legalCosts, label: 'Coûts Juridiques', name: 'Juridiques' },
          { y: options.employeeCosts, label: 'Coûts des Employés', name: 'Employés' },
          { y: options.hseCosts, label: 'Coûts HSE', name: 'HSE' },
        ],
      },
    ],
  };

  return <div className='card'>
    <div className="" style={{ padding: "20px" }}>
      <h6 className="box-title">
        <i className="las la-file-invoice-dollar" style={{ fontSize: "24px" }}></i>  Répartition des Coûts TCO
      </h6>
    </div>
    <HighchartsReact class highcharts={Highcharts} options={chartOptions} />
  </div>;
};

export default FleetSate;
