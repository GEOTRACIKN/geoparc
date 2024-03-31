import React from 'react';
import Card from 'react-bootstrap/Card';
import { formatToTimestamp, engineStat, engineStatClass, Distance } from '../../utilities/functions';
import { Row } from 'react-bootstrap';

interface itinereyWidgetgetProps {
  id:number;
  start:string;
  end: string;
  ENGINESTAT: number;
  duration: number;
  Odometer: number;
  distance: number;
  max_speed: number;
  LAT: number;
  LNG: number;
  SOG: number;
  trip_date: string;
  
}

const ItinereyWidget: React.FC<itinereyWidgetgetProps> = ({id,start,SOG,LAT,LNG,ENGINESTAT,Odometer,distance }) => {

    
  return (
    <>
    <Card id={`v-${id.toString()}`} className={`map-card ${engineStatClass(ENGINESTAT,SOG)}`} style={{ width: '90%', marginBottom: "10px" }}> 
    <Card.Body style={{padding: "0.25rem"}}>
      <Card.Title style={{fontSize: "17px"}}><img src={engineStat(ENGINESTAT,SOG).toString()} /> {id}</Card.Title>
      <Card.Subtitle style={{fontSize: "14px"}} className="mb-2 text-muted"> <i className="las la-clock map-icon-gray" data-rel="bootstrap-tooltip" title="Address"></i> {formatToTimestamp(start)} </Card.Subtitle>
      <Card.Text  style={{ marginBottom: "4px" }}><i className="las la-map-marker map-icon-gray" data-rel="bootstrap-tooltip" title="Address"></i> {LAT} , {LNG}</Card.Text>
      <Row className='row'>
        <span className='col-6'> 
          <p style={{fontSize: "13px",margin: "0"}} className="text-muted"> 
            <i className="las la-tachometer-alt map-icon-orange" data-rel="bootstrap-tooltip" title="Speed"></i> Speed
          </p>
          <span> 
            {SOG} km/h
          </span>
        </span>

        <span className='col-6'> 
          <p style={{fontSize: "13px",margin: "0"}} className="text-muted" > 
            <i className="las lar la-road map-icon-orange" data-rel="bootstrap-tooltip" title="Distence"></i> Odometer
          </p>
          <span>
            {Distance(distance)}
          </span>
        </span>
     </Row>
    </Card.Body>
  </Card>
  </>
  );

};

export default ItinereyWidget;


