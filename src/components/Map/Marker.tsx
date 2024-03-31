import { DivIcon } from 'leaflet';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';

interface MarkerComponentProps {
  position: [number, number];
  text: string;
  icon:DivIcon
}

const MarkerComponent: React.FC<MarkerComponentProps> = ({ position, text,icon }) => {
  return (
    <Marker position={position} icon={icon}>
      <Popup>{text}</Popup>
    </Marker>
  );
};

export default MarkerComponent;
