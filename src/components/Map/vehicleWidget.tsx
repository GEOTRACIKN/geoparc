import React from 'react';
import Card from 'react-bootstrap/Card';
import { formatToTimestamp, engineStat, engineStatClass, Distance } from '../../utilities/functions';
import { Row } from 'react-bootstrap';
import { useTranslate } from "../LanguageProvider";


interface VehicleWidgetProps {
  id: number;
  matriculation: string;
  LAT: number;
  LON: number;
  SOG: number;
  COG: number;
  timestamp: string;
  enginestat: number;
  gpsdist: number;
  detail: string;
  PSN: string;
  onClose: (matriculation: any) => void;
  handleItineraryClick: (PSN: any) => void;
  handleDistanceSpeedClick: (PSN: any) => void;
  handleFuelTankClick: (PSN: any) => void;
  handleTemperatureDiagramClick: (PSN: any) => void;
}


const VehicleWidget: React.FC<VehicleWidgetProps> = ({ id, matriculation, timestamp, SOG, LAT, LON, enginestat, gpsdist, detail, onClose, PSN, handleItineraryClick, handleTemperatureDiagramClick, handleFuelTankClick, handleDistanceSpeedClick }) => {


  const { translate } = useTranslate();


  return (
    <>
      <Card id={`v-${id.toString()}`} className={`map-card ${engineStatClass(enginestat, SOG)}`} style={{ width: '90%', marginBottom: "10px" }}>
        <Card.Body style={{ padding: "0.25rem" }}>
          <Card.Title style={{ fontSize: "17px" }}> <img src={engineStat(enginestat, SOG, translate).iconState} alt="" />  {matriculation} <i className='las la-chevron-left return-to-list' onClick={(event) => { event.stopPropagation(); onClose(matriculation) }} ></i></Card.Title>
          <Card.Subtitle style={{ fontSize: "14px" }} className="mb-2 text-muted"> <i className="las la-clock map-icon-orange" data-rel="bootstrap-tooltip" title="Address"></i> {formatToTimestamp(timestamp)} </Card.Subtitle>
          <Card.Text style={{ marginBottom: "4px" }}><i className="las la-map-marker map-icon-orange" data-rel="bootstrap-tooltip" title="Address"></i> {LAT} , {LON}</Card.Text>
          <Row className='row'>
            <span className='col-6'>
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted">
                <i className="las la-tachometer-alt map-icon-orange" style={{ fontSize: "20px" }} data-rel="bootstrap-tooltip" title="Speed"></i> Speed
              </p>
              <span>
                {SOG} km/h
              </span>
            </span>

            <span className='col-6'>
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted" >
                <i className="las lar la-road map-icon-orange" data-rel="bootstrap-tooltip" title="Distence"></i> Odometer
              </p>
              <span>
                {Distance(gpsdist)}
              </span>
            </span>
          </Row>
          <Row className='row' style={{ display: detail, padding: '10px 0', transition: " box-shadow 0.3s, transform 0.3s" }}>
           
           
          <span className='col-6'>
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted" >
                <i className="las lar la-temperature-low map-icon-orange" data-rel="bootstrap-tooltip" title="Distence"></i> Temperature 
              </p>
              <span>
                19 °C  
              </span>
            </span>


            <span className='col-6'>
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted" >
                <i className="las lar la-user-friends map-icon-orange" data-rel="bootstrap-tooltip" title="Distence"></i> Group 
              </p>
              <span style={{fontSize: "13px"}}> 
                Dellil  chafik
              </span>
            </span>
           
           
           
           
           
            <span className='col-12' style={{ margin: "5px 0" }} >
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted" >
                <i className="las lar la-tag map-icon-orange" style={{ fontSize: "22px" }} data-rel="bootstrap-tooltip" title="Distence"></i> BELOUZA MOHAMED
              </p>

            </span>

            <span className='col-12'>
              <p style={{ fontSize: "13px", margin: "0" }} className="text-muted">
                <i className="las la-home map-icon-orange" style={{ fontSize: "22px" }} data-rel="bootstrap-tooltip" title="Speed"></i> Axe Routier Alrar In Amenas , Ville : Illizi , Pays : Algeria .
              </p>
            </span>


            <h6>{translate("Report & Statistics")}</h6>
            <div className='col-6' style={{ cursor: 'pointer', textAlign: "center" }} onClick={() => handleItineraryClick(PSN)}>
              <p style={{ border: '1px solid rgb(221, 221, 221)', borderRadius: '5px', padding: '10px' }}>
                <i className="las la-Itinerary reconstitution" style={{ fontSize: '28px' }}></i>
                <img src="asset/images/icon-report/1.png" style={{ width: '32px', marginRight: '5px' }} alt="Icon" />
                <p style={{ margin: "0px" }}>{translate("Itinerary reconstitution")}</p>
              </p>
            </div>

            <div className='col-6' style={{ cursor: 'pointer', textAlign: "center" }} onClick={() => handleDistanceSpeedClick(PSN)}>
              <p style={{ border: '1px solid rgb(221, 221, 221)', borderRadius: '5px', padding: '10px' }}>
                <i className="las la-Itinerary reconstitution" style={{ fontSize: '28px' }}></i>
                <img src="asset/images/icon-report/4.png" style={{ width: '32px', marginRight: '5px' }} alt="Icon" />
                <p style={{ margin: "0px" }}>{translate("Diagramme de distance")}</p>
              </p>
            </div>

            <div className='col-6' style={{ cursor: 'pointer', textAlign: "center" }} onClick={() => handleFuelTankClick(PSN)}>
              <p style={{ border: '1px solid rgb(221, 221, 221)', borderRadius: '5px', padding: '10px' }}>
                <i className="las la-Itinerary reconstitution" style={{ fontSize: '28px' }}></i>
                <img src="asset/images/icon-report/5.png" style={{ width: '32px', marginRight: '5px' }} alt="Icon" />
                <p style={{ margin: "0px" }}>{translate("Fuel Tank (IO) Diagram")}</p>
              </p>
            </div>

            <div className='col-6' style={{ cursor: 'pointer', textAlign: "center" }} onClick={() => handleTemperatureDiagramClick(PSN)}>
              <p style={{ border: '1px solid rgb(221, 221, 221)', borderRadius: '5px', padding: '10px' }}>
                <i className="las la-Itinerary reconstitution" style={{ fontSize: '28px' }}></i>
                <img src="asset/images/icon-report/19.png" style={{ width: '32px', marginRight: '5px' }} alt="Icon" />
                <p style={{ margin: "0px" }}>{translate("Temperature diagram")}</p>
              </p>
            </div>

          </Row>
        </Card.Body>
      </Card>
    </>
  );

};

export default VehicleWidget;


