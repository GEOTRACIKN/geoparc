import React from 'react';
import { useParams } from 'react-router-dom';
import Report1 from "../components/reportModels/report1";
import Report2 from '../components/reportModels/report2';
import Report9 from '../components/reportModels/report9';
import Report10 from "../components/reportModels/report10";
import Report12 from '../components/reportModels/report12';
import Report25 from '../components/reportModels/report25';
import Report35 from '../components/reportModels/report35';
import Report15 from '../components/reportModels/report15';
import Report34 from '../components/reportModels/report34';
import Report8 from '../components/reportModels/report8';
import Report4 from '../components/reportModels/report4';
import Report7 from '../components/reportModels/report7';
import Report45 from '../components/reportModels/report45';
import Report11 from '../components/reportModels/report11';
import Report19 from '../components/reportModels/report19';






  const Report: React.FC = () => {
  const { type_report } = useParams<{ type_report?: string }>();
  const { turn } = useParams<{ turn?: string }>();
  const { id_report } = useParams<{ id_report?: string }>();
   
  console.log(turn);
  const renderReport = () => {
    switch (type_report) {
      case '1':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '2':
        return <Report2 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '4':
        return <Report4 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '6':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '7':
        return <Report7 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '8':
        return <Report8 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '9':
        return <Report1 id_report={id_report} turn={turn}   type_report={type_report} />;
      case '10':
        return <Report10 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '11':
        return <Report11 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '12':
        return <Report12 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '14':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '15':
        return <Report15 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '19':
        return <Report19 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '25':
        return <Report25 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '27':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '28':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report}  />;
      case '29':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '31':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '32':
        return <Report1 id_report={id_report} turn={turn} type_report={type_report} />;
      case '33':
        return <Report1 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '34':
        return <Report34 id_report={id_report} turn={turn}  type_report={type_report} />;
      case '35':
        return <Report35 id_report={id_report} turn={turn} type_report={type_report} />;
      case '36':
        return <Report1 id_report={id_report} turn={turn} type_report={type_report} />;
      case '45':
        return <Report45 id_report={id_report} turn={turn}  type_report={type_report} />;
      default:
        return <div>No report found for this type_report {type_report}</div>;
    }
  }; 
   
  return (
    <div id='main'>
      {renderReport()}
    </div>
  );
};


export default Report;
