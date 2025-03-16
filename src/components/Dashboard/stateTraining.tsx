import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { useTranslate } from '../../hooks/LanguageProvider';


interface Training {
  date_end_training: string;
}

interface Props {
  trainings: Training[];
}

const StateTraining: React.FC<Props> = ({ trainings }) => {
  // Couleurs correspondantes aux états
  const stateColors = {
    "Valide": "#28A745",
    "Invalide": "#DC3545"
  } as const;

  // Fonction de validation
  const isTrainingValid = (training: Training) => {
    const endDate = moment(training.date_end_training, 'DD/MM/YYYY');
    const today = moment().startOf('day');
    return endDate.isSameOrAfter(today);
  };
    const { translate } = useTranslate();
  

  // Calcul des statistiques
  const validCount = trainings.filter(t => isTrainingValid(t)).length;
  const invalidCount = trainings.length - validCount;

  // Formatage des données pour Highcharts
  const chartData = [
    { 
      y: validCount, 
      name: translate("Valid"), 
      color: stateColors.Valide, 
      label: translate("Valid trainings")
        },
    { 
      y: invalidCount, 
      name: translate("Invalid"), 
      color: stateColors.Invalide, 
      label: translate("Expired trainings")   
     }
  ];

  const chartOptions = {
    chart: {
      type: 'pie',
      height: '400px'
    },
    title: { text: '' },
    tooltip: {
      pointFormat: '<b>{point.label}</b>: {point.y} formations'
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
      name: 'État des formations',
      colorByPoint: true,
      data: chartData
    }]
  };

  return (
    <div className='card'>
      <div style={{ padding: "20px" }}>
        <h6 className="box-title">
          <i className="las la-certificate" style={{ fontSize: "24px" }}></i> 
          {translate("Training status")}
        </h6>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default StateTraining;