import { DivIcon } from 'leaflet';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Popup } from 'react-leaflet';

interface MarkerComponentProps {
  position: [number, number];
  text: string;
  icon:DivIcon
}
 
const PopUp: React.FC<MarkerComponentProps> = ({ position, text,icon }) => {
  return (
      <Popup>
        <Container fluid className="marker-description" style={{ textAlign: 'left' }}>
          <Row>
            <Col>
              <h1 style={{ fontWeight: 'bold' }}>
                <img
                  style={{ marginBottom: 0, transform: 'rotate(83.19deg)' }}
                  src="https://idegps.net/img/mapicon/direction-icon.png"
                  alt="Marker Icon"
                />
                Démarré
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="popup-val">
                <i className="fa fa-clock-o" title="Start, durée" style={{ marginRight: '0.2em', fontSize: '16px' }}></i> 2024-01-21 08:19:43
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="popup-val">
                <i className="fa fa-tachometer" title="Speed" style={{ marginRight: '0.2em', fontSize: '16px' }}></i>
                <span className="">79.59</span>
                <span> km/h </span>
                <span className="">green</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="popup-val">
                <i className="fa fa-map-marker" title="Location" style={{ marginRight: '0.2em', fontSize: '16px' }}></i> 36.1698 , 5.63143
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="popup-val">
                <i className="fa fa-home" title="Adresse" style={{ marginRight: '0.2em', fontSize: '16px' }}></i> <span id="id-marker-undefined"></span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="popup-val">
                <i className="fa fa-road" title="Distance" style={{ marginRight: '0.2em', fontSize: '16px' }}></i> 143 km
              </p>
            </Col>
          </Row>
        </Container>
      </Popup>
  );
};

export default PopUp;
