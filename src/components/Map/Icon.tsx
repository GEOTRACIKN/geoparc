import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';


const IconMarker = (direction: number,img: string,onClick: () => void) => {  
 
  const iconStyle = {
    width: '40px',
    height: '40px',
    transform: `rotate(${direction}deg)`,
  };
 

  const htmlString = renderToString(<div style={iconStyle} >  { <img  src={img} onClick={onClick} />} </div>); 
 
  return divIcon({
    className: 'custom-icon',
    iconSize: [40, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    html: htmlString ,
  });
};

export default IconMarker;


