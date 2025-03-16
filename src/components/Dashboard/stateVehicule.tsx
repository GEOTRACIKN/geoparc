import React from 'react';
import Highcharts from 'highcharts';
import variablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';

variablePie(Highcharts);

interface VehicleState {
  etat_vehicule: string;
  total: number;
}

interface Props {
  vehicleStates: VehicleState[];
}

const StateVehicule: React.FC<Props> = ({ vehicleStates }) => {
  // Couleurs correspondantes aux états
  const stateColors = {
    "HS": "#FFC107",
    "En panne": "#DC3545",
    "En réparation": "#17A2B8",
    "Disponible": "#28A745"
  } as const; // Ajout de 'as const' pour le typage littéral


  // Formatage des données pour Highcharts
  const chartData = vehicleStates.map(state => ({
    y: state.total,
    name: state.etat_vehicule,
    color: stateColors[state.etat_vehicule as keyof typeof stateColors], // Assertion de type ici        
    label: translateState(state.etat_vehicule)
  }));

  const chartOptions = {
    chart: {
      type: 'pie',
      height: '400px'
    },
    title: { text: '' },
    tooltip: {
      pointFormat: '<b>{point.label}</b>: {point.y} véhicules'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.label}<br>{point.percentage:.1f} %'
        },
        showInLegend: true
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { fontSize: '12px' }
    },
    series: [{
      name: 'États des véhicules',
      colorByPoint: true,
      data: chartData
    }]
  };

  // Fonction de traduction simplifiée
  function translateState(state: string) {
    const translations: { [key: string]: string } = {
      "HS": "Hors service",
      "En panne": "En panne",
      "En réparation": "En réparation",
      "Disponible": "Disponible"
    };
    return translations[state] || state;
  }

  return (
    <div className='card'>
      <div style={{ padding: "20px" }}>
        <h6 className="box-title">
          <i className="las la-car-side" style={{ fontSize: "24px" }}></i> 
           État du parc automobile
        </h6>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default StateVehicule;