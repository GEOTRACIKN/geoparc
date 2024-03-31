import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-leaflet";
import { useTranslate } from "../LanguageProvider";
import IconMarker from "../Map/Icon";
import { Row } from "react-bootstrap"; 
import "../Map/map.css";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { FullscreenControl } from "react-leaflet-fullscreen";
import PopUp from "../Map/PopUp";
import { Round, toTimestamp } from "../../utilities/functions";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
interface VehicleWidgetProps {
  type_report?: string;
  turn?: string;
  id_report?: string;
}

const Report1: React.FC<VehicleWidgetProps> = ({type_report,turn, id_report,}) => {
  
  const center: [number, number] = [30.5670197, 4.6911217];
  const zoom: number = 5;
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");

  // Remplacez la déclaration de GroupComponent par ceci
  var GroupComponent: React.ComponentType<any> = true
    ? MarkerClusterGroup
    : FeatureGroup;

  interface itinerey {
    id: number;
    start: string;
    end: string;
    name: string;
    distance: number;
    ALT: number;
    LAT: number;
    LNG: number; 
    COG: number;
    SOG: number;
    ALARMS: string;
    PRIVATE_MODE:number;
  }

  const [itinereys, setItinereys] = useState<itinerey[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [baseMap, setBaseMap] = useState<string>("osm");
  const [listLayout, setlistLayout] = useState("layoutleft");
  const [mapLayout, setMapLayout] = useState("col-9");
  var day_trip=""; 
  var j=0;
  var k=0;
  var [jsxElements, setJsxElements] = useState<JSX.Element[] >([]);

  var hiddenState="show_";
  const MapContent: React.FC = () => {
    const map = useMap();

    useEffect(() => { 
      if (selectedItem) {
        console.log(selectedItem.id);

        const { LAT, LNG } = selectedItem;
        map.flyTo([LAT, LNG], 15, {
          // animate: false,
          duration: 2,
        });
      }
    }, [
      map,
      selectedItem,
      15,
      {
        // animate: false,
        duration: 2,
      },
    ]);

    return null;
  };

  const [selectedItem, setSelectedItem] = useState<itinerey | null>(null);

  const basemapOptions = [
    {
      value: "osm",
      label: "OSM",
      icon: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      value: "hot",
      label: "OSM HOT",
      icon: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    },
    {
      value: "dark",
      label: "DARK",
      icon: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    },
    {
      value: "cycle",
      label: "CYCLE MAP",
      icon: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    },
    {
      value: "Google Traffic",
      label: "Google Traffic",
      icon: "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
    },
  ];

  useEffect(() => {
    const getItinereys = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/report1/${id_report}`, { mode: "cors" });
        if (response.ok) {

          const data = await response.json();
          setItinereys(data["repportDatas"]);
         
          console.log(itinereys);  
          
          day_trip=   toTimestamp(itinereys[0]["start"]);
          
          itinereys.forEach((itinerey) => {

            const this_day = toTimestamp(itinerey.start);
          
            if (day_trip == this_day.split(' ')[0]) { 
              if (j == 0) {
                const day =  toTimestamp(itinerey.start).split(' ')[0];
             
                jsxElements.push( 
                  <div key={itinerey.id} onClick={() => handleItemClick(itinerey)}   style={{ display: "inlineBlock", minWidth: "100%" }}>
                    <div className="checkbox"> 
                      <i
                        className="fa fa-fw fa-caret-right"
                        id={`expand_${day}`}
                        style={{ visibility: "visible" }} 
                        onClick={() => showAllDay(day, itinerey.LAT, itinerey.LNG)}
                      ></i>
                      <input 
                        type="checkbox"
                        id={`chk_${day}`} 
                        name={`chk_${day}`} 
                        onClick={() => checkDay(day, itinerey.LAT, itinerey.LNG)}
                        value={day}
                        checked={k == 0 ? true : false}
                      /> 
                      <a 
                        id={`day_${day}`}
                        onClick={() => showAllDay(day, itinerey.LAT, itinerey.LNG)}
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          marginLeft: "3px", 
                          fontWeight: "bold" 
                        }}
                        >
                        {day}
                      </a> 
                    </div>
                  </div>
                   
                );
                j=1;
              }
               
              var state="stop";
              var day=itinerey.start.split(' ')[0];  

              if (itinerey.name=="Moteur arrêté") {
                
                state="stop";
         
                jsxElements.push(   
                  <div className={`trips_${day}  ${hiddenState}.${day}  ${state}` } style={{paddingLeft: "16px"}}> 
                    <div id="trip_0" className={state} style={{minWidth: "100%", float: "left", display:"inline"}}>  
                    <input type="checkbox"  className={`tchk_${day} tchk_${day}`}  onClick={() => checkTime(day)} name={`tchk_${day}`} value={day} />
                      
                    <a key={itinerey.id} onClick={() => handleItemClick(itinerey)} style={{cursor: "pointer", textDecoration: "none",marginLeft: "10px"}}>
                   
                          <i className="fa fa-pause" style={{color:"blue"}}> </i> 
                           {`${ toTimestamp(itinerey.start).split(" ")[1]} - ${ toTimestamp(itinerey.end).split(" ")[1]}`}
                        
                        <span style={{marginLeft: "3px", color: "#000", fontSize: "0.9em"}}> 
                        {`${ Round(( (itinerey["distance"]-itinereys[0]["distance"]) / 1000) , 2)} Km`} 
                        </span> 
                      </a> 

                    </div>   
                  </div>  
                  ); 
              }
              else{ 
                if (itinerey.SOG <= 5) {   
                   state="move";
                  jsxElements.push(    
                    <div className={`trips_${day}  ${hiddenState}.${day}  ${state}` } style={{paddingLeft: "16px"}}>
                      <div id="trip_0" className={state} style={{minWidth: "100%", float: "left", display:"inline"}}>
                        <input type="checkbox"  className={`tchk_${day} tchk_${day}`}  onClick={() => checkTime(day)} name={`tchk_${day}`} value={day} />
                     
                        <a key={itinerey.id} onClick={() => handleItemClick(itinerey)} style={{cursor: "pointer", textDecoration: "none",marginLeft: "10px"}}>
                   
                          <i className="fa fa-stop" style={{color:"red"}}> </i>  
                           {`${ toTimestamp(itinerey.start).split(" ")[1]} - ${ toTimestamp(itinerey.end).split(" ")[1]}`}
                         
                        <span style={{marginLeft: "3px", color: "#000", fontSize: "0.9em"}}> 
                        {`${ Round(( (itinerey["distance"]-itinereys[0]["distance"]) / 1000) , 2)} Km`} 
                        </span>  
                      </a>   
                      </div>  
                    </div>
                  ); 
                }   
              } 
            } else {
              day_trip = toTimestamp(itinerey.start).split(' ')[0];
              j=0;
              k=1;
              hiddenState = "hide_";
          
              console.log(`Perform actions for day ${day_trip}`);
            }
          }); 

          setJsxElements(jsxElements);
          
      
     

 
        } else {
          console.error("Failed to fetch vehicle data");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };
 
    getItinereys();
  }, [userID]);

  const filteredItems = itinereys.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };



  interface BasemapsDict {
    osm: string;
    hot: string;
    dark: string;
    cycle: string;
    [key: string]: string;
  }

  const basemapsDict: BasemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    google:
      "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log("Wheel event triggered");
    const container = containerRef.current;
    if (container) {
      container.scrollTop += event.deltaY;
    }
  };

 

  const mapLayoutClick = () => {
    listLayout == "layoutleft"
      ? setlistLayout("layoutleft")
      : setlistLayout("layoutfloat");
    mapLayout == "col-12" ? setMapLayout("col-9") : setMapLayout("col-12");

    console.log("Clic sur map-layout");
  };

  const showAllDay = (day: string, lat: number, lng: number) => {

     console.log(day);
  
   
  };
   

  const checkDay = (day: string, lat: number, lng: number) => { 
  
  };
  
  const checkTime = (time: string) => { 
  
};


  const handleItemClick = (item: itinerey) => {
    setSelectedItem(item);
  };




  return (

    <>
      <Row>
        <div className={`${listLayout} col-3`} style={{ zIndex: 9999, paddingLeft: "30px", margin: " 20px 0" }} >
          <span className="map-search">
            <i className="las la-search"  data-rel="bootstrap-tooltip" title="Increased" ></i>
            <input type="text"   placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            ({itinereys.length}) <i className="las la-car"></i>
          </span>
          <span className="map-layout" onClick={mapLayoutClick}>
            <i className="las la-list"  data-rel="bootstrap-tooltip"  title="Increased" style={{ fontSize: "24px" }} ></i>
          </span>
          <div className="map-list" ref={containerRef}  onWheel={handleWheelScroll} tabIndex={0} style={{ overflow: "hidden" }}>
               {jsxElements}
          </div>
        </div>
        <div className={mapLayout} style={{ padding: "0px" }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{
              padding: 0,
              margin: 0,
              height: "86vh",
              width: "100%",
              zIndex: 1,
            }}
          >
            <MapContent />

            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url={basemapsDict[baseMap]}
            />
            <div className="basemaps-container">
              <select
                value={baseMap}
                onChange={(e) => setBaseMap(e.target.value)}
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}asset/images/mapicon/layers.png)`,
                  appearance: "none",
                  backgroundSize: "22px",
                  backgroundPosition: " center center",
                  backgroundRepeat: "no-repeat",
                  border: "none",
                  color: "transparent",
                  outline: "none",
                }}
              >
                {basemapOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    style={{ color: "black" }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <GroupComponent>
              {itinereys.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.LAT, item.LNG]} 
                  icon={IconMarker(item.COG,'asset/images/mapicon/direction-icon.png',() => handleItemClick(item))}
                >
                  <PopUp position={[item.LAT, item.LNG]} text={""} icon={IconMarker(item.COG,'asset/images/mapicon/direction-icon.png',() => handleItemClick(item))}/>
                </Marker>
              ))}
            </GroupComponent>
            <FullscreenControl
              position="topright"
              title="Show me the fullscreen map"
              forceSeparateButton={false}
            />
          </MapContainer>
        </div>
      </Row>
    </>
  );
};

export default Report1;
