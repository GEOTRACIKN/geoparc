import React from 'react';
import Highcharts from 'highcharts';
import variablePie from 'highcharts/modules/variable-pie';
import HighchartsReact from 'highcharts-react-official';
import { useTranslate } from '../../hooks/LanguageProvider';

variablePie(Highcharts);

interface VehicleState {
  etat_vehicule: string;
  total: number;
}

interface Props {
  vehicleStates: VehicleState[];
}

const StateVehicule: React.FC<Props> = ({ vehicleStates }) => {
  const { translate } = useTranslate(); // Récupération de la fonction translate

  // Couleurs correspondantes aux états
  const stateColors = {
    
  } as const;

  // Formatage des données pour Highcharts
  const chartData = vehicleStates.map(state => ({
    y: state.total,
    name: translateState(state.etat_vehicule),
    color: stateColors[state.etat_vehicule as keyof typeof stateColors],      
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
      name: translate("Vehicle states"), // Traduction du titre
      colorByPoint: true,
      data: chartData
    }]
  };

  // Fonction de traduction avec translate
  function translateState(state: string) {
    const translations: { [key: string]: string } = {
      "HS": translate("Out of service"),
      "En panne": translate("Broken down"),
      "En réparation": translate("Under repair"),
      "Disponible": translate("Available")
    };
    return translations[state] || state;
  }

  return (
    <div className='card'>
      <div style={{ padding: "20px" }}>
        <h6 className="box-title">
          <i className="las la-car-side" style={{ fontSize: "24px" }}></i> 
          <b>{translate(" Fleet status")}</b>
        </h6>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default StateVehicule;
