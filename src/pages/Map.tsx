import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup, FeatureGroupProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-leaflet';
import { useTranslate } from '../components/LanguageProvider';
import IconMarker from '../components/Map/Icon';
import { Col, Row } from 'react-bootstrap';
import '../components/Map/map.css';
import VehicleWidget from '../components/Map/vehicleWidget';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import Slider from "react-slick";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { engineStat, engineStatClass } from '../utilities/functions';
import { useSpring, animated } from 'react-spring';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Map: React.FC = () => {
  const center: [number, number] = [30.5670197, 4.6911217];
  const zoom: number = 5;
  const { translate } = useTranslate();
  const userID = localStorage.getItem('userID');

  const [list_markers, setMarkers] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [baseMap, setBaseMap] = useState<string>('google_roadmap');  
  const [listLayout, setlistLayout] = useState('layoutfloat');
  const [mapLayout, setMapLayout] = useState('col-12');
  const [vehicleDetail, setVehicleDetail] = useState<string>("none");


  const [DistanceSpeedData, setDistanceSpeed] = useState<any>([]);
  const [TemperaturetData, setTemperature] = useState<any>([]);
  const [FuelTankData, setFuelTank] = useState<any>([]);
  const [ItinerarytData, setItineraryData] = useState<any>([]);

  const [clicked, setClicked] = useState(false);
  const [slideState, setSlideState] = useState<string>("slide-state");
  const [ungroupMarker, setUngroupMarker] = useState<boolean>(true);

  const [Driving, setDriving] = useState(0);
  const [Parcking, setParcking] = useState(0);
  const [ParkingEngineRunning, setParkingEngineRunning] = useState(0);
  const [LastTransmission, setLastTransmission] = useState(0);

  interface toChartData {
    x: number;
    y: number;
  }

  // Remplacez la déclaration de GroupComponent par ceci 
  var GroupComponent: React.ComponentType<any> = ungroupMarker
    ? MarkerClusterGroup
    : FeatureGroup;

  interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
    LAT: number;
    LON: number;
    SOG: number;
    COG: number;
    ENGINESTAT: number;
    TIMESTAMP: string;
    GPSDIST: number;
    PSN: string;
  }


  // Définir l'animation de clic avec react-spring
  const animationProps = useSpring({
    transform: clicked ? 'scale(1.1)' : 'scale(1)',
    overflow: 'hidden',
    marginTop: clicked ? "55px" : "10px"
  });

  function ToUTCTime(isoDateString: string): number {
    if (!isoDateString) {
      return 0; // Ou une valeur par défaut appropriée
    }

    const dateComponents = isoDateString.split(/[-T:.Z]/);
    const start_date = dateComponents.map((component) =>
      parseInt(component, 10)
    );

    return Date.UTC(
      start_date[0],
      start_date[1] - 1,
      start_date[2],
      start_date[3],
      start_date[4],
      start_date[5],
      0
    );
  }


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  const getReportBytype = async (type: number, PSN: string) => {
    try {

      const res = await fetch(`${backendUrl}/api/map/reports/${type}/${PSN}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération du véhicule");
        return;
      }

      const data = await res.json();

      console.log(data);


      if (type == 1) setItineraryData(data.data);
      if (type == 4) {




        setSlideState("");

        const Distance: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.GPSDIST) / 1000,
        }));



        const Speed: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.SOG),
        }));




        const EngineStat: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.ENGINESTAT),
        }));



        setDistanceSpeed({
          chart: {
            zoomType: "x",
            height: 120,
            width: null,
          },
          title: {
            text: "",
            align: "center",
          },
          subtitle: {
            text: "",
            align: "center",
          },
          xAxis: [
            {
              gridLineWidth: 1,
              type: "datetime",
              crosshair: true,
            },
          ],
          yAxis: [
            {
              labels: {
                format: "{value} Km/h",
                style: {
                  color: "#fd1e0d",
                },
              },
              title: {
                text: translate("Odometer"),
                style: {
                  color: "#fd1e0d",
                },
              },
              opposite: true,
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Speed"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} Km/h",
                style: {
                  color: "#0080FF",
                },
              },
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Contact"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} ",
                style: {
                  color: "#0080FF",
                },
              },
              opposite: true,
            },
          ],
          tooltip: {
            shared: true,
          },
          legend: {
            layout: "horizontal",
            align: "center",
            x: 0,
            verticalAlign: "bottom",
            y: 21,
            floating: true,
          },
          series: [
            {
              name: translate("Odometer"),
              type: "spline",
              olor: "#41b346",
              yAxis: 1,
              data: Distance,
              tooltip: {
                valueSuffix: " Km",
              },
            },
            {
              name: translate("Contact"),
              type: "spline",
              color: "#41b346",
              yAxis: 2,
              data: EngineStat,
              tooltip: {
                valueSuffix: " ",
              },
            },
            {
              name: translate("Speed"),
              type: "line",
              color: "#fd1e0d",
              data: Speed,
              tooltip: {
                valueSuffix: " km/h",
              },
            },
          ],

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    floating: false,
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                  },
                  yAxis: [
                    {
                      labels: {
                        align: "right",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      labels: {
                        align: "left",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      visible: false,
                    },
                  ],
                },
              },
            ],
          },
        });



      }
      if (type == 8) {
        setFuelTank(data.data);

        setSlideState("");

        const TFUEL: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.TFUEL),
        }));



        const VEHDIST: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.VEHDIST) / 1000,
        }));




        const FUELLVL: toChartData[] = data.data.map((item: any) => ({
          x: ToUTCTime(item.TIMESTAMP),
          y: parseFloat(item.FUELLVL),
        }));




        setFuelTank({
          chart: {
            zoomType: "x",
            height: 120,
            width: null,
          },
          title: {
            text: "",
            align: "center",
          },
          subtitle: {
            text: "",
            align: "center",
          },
          xAxis: [
            {
              gridLineWidth: 1,
              type: "datetime",
              crosshair: true,
            },
          ],
          yAxis: [
            {
              labels: {
                format: "{value} Km",
                style: {
                  color: "#fd1e0d",
                },
              },
              title: {
                text: translate("Odometer"),
                style: {
                  color: "#fd1e0d",
                },
              },
              opposite: true,
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Tank level"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} %",
                style: {
                  color: "#0080FF",
                },
              },
            },
            {
              gridLineWidth: 0,
              title: {
                text: translate("Fuel consumption"),
                style: {
                  color: "#0080FF",
                },
              },
              labels: {
                format: "{value} L",
                style: {
                  color: "#0080FF",
                },
              },
              opposite: true,
            },
          ],
          tooltip: {
            shared: true,
          },
          legend: {
            layout: "horizontal",
            align: "center",
            x: 0,
            verticalAlign: "bottom",
            y: 21,
            floating: true,
          },
          series: [
            {
              name: translate("Odometer"),
              type: "spline",
              olor: "#41b346",
              yAxis: 1,
              data: VEHDIST,
              tooltip: {
                valueSuffix: " Km",
              },
            },
            {
              name: translate("Tank level"),
              type: "spline",
              color: "#41b346",
              yAxis: 2,
              data: FUELLVL,
              tooltip: {
                valueSuffix: " ",
              },
            },
            {
              name: translate("Fuel consumption"),
              type: "line",
              color: "#fd1e0d",
              data: TFUEL,
              tooltip: {
                valueSuffix: " L",
              },
            },
          ],

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    floating: false,
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                  },
                  yAxis: [
                    {
                      labels: {
                        align: "right",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      labels: {
                        align: "left",
                        x: 0,
                        y: -6,
                      },
                      showLastLabel: false,
                    },
                    {
                      visible: false,
                    },
                  ],
                },
              },
            ],
          },
        });


      }
      if (type == 19) setItineraryData(data.data);




    } catch (error) {
      console.error("Erreur lors de la récupération du véhicule", error);
    }
  };



  const MapContent: React.FC = () => {
    const map = useMap();

    useEffect(() => {

      if (selectedItem) {

        console.log(selectedItem.id_vehicule);

        const { LAT, LON } = selectedItem;
        map.flyTo([LAT, LON], 15, {
          // animate: false,  
          duration: 1
        });


      }

    }, [map, selectedItem, 15, {
      // animate: false, 
      duration: 1
    }]);

    return null;
  };
 
  const [selectedItem, setSelectedItem] = useState<Vehicle | null>(null);
 
  const basemapOptions = [ 
    { value: 'google_roadmap', label: 'Google Roadmap', icon: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}' }, 
    { value: 'osm', label: 'OSM', icon: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
    { value: 'hot', label: 'OSM HOT', icon: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' },
    { value: 'dark', label: 'DARK', icon: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png' },
    { value: 'cycle', label: 'CYCLE MAP', icon: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png' },
    { value: 'google_traffic', label: 'Google Traffic', icon: 'https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}' },
    { value: 'google_satellite', label: 'Google Satellite', icon: 'https://www.google.com/maps/vt?lyrs=s@189&gl=us&x={x}&y={y}&z={z}' },
    { value: 'google_terrain', label: 'Google Terrain', icon: 'https://www.google.com/maps/vt?lyrs=p@189&gl=us&x={x}&y={y}&z={z}' },
    { value: 'mapbox', label: 'Mapbox', icon: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWRlbmV0IiwiYSI6ImNqeGs0dHAzbTFlb3UzeXFkOWk1ZWQ5cDIifQ.lpPl03eDGutSjsd0fLaPkw' },
  ];  

  useEffect(() => {
    const getMarkers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/map/find/${userID}`, { mode: 'cors' });
        if (response.ok) {
          const data = await response.json();
          setMarkers(data);

                   // Calcul du nombre de véhicules en démarrage, en stationnement, et en stationnement avec moteur démarré
                   const startingVehicles = data.filter(
                    (vehicle: Vehicle) => vehicle.ENGINESTAT == 1 && vehicle.SOG > 5
                  );
        
                  const parkingVehicles = data.filter(
                    (vehicle: Vehicle) => vehicle.ENGINESTAT == 0
                  );
        
                  const runningVehicles = data.filter(
                    (vehicle: Vehicle) => vehicle.ENGINESTAT == 1 && vehicle.SOG < 5
                  );
        
                  const filteredVehicles = data.filter((vehicle: Vehicle) => {
                    const lastTransmissionHours = calculateHoursDifference(
                      new Date().toISOString(),
                      vehicle.TIMESTAMP
                    );
                    return lastTransmissionHours > 1; 
                  });
        
                  setDriving(startingVehicles.length);
                  setParcking(parkingVehicles.length);
                  setParkingEngineRunning(runningVehicles.length);
                  setLastTransmission(filteredVehicles.length);



        } else {
          console.error('Failed to fetch vehicle data');
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    getMarkers();

    // Définir un intervalle pour rafraîchir toutes les minutes
    const refreshInterval = setInterval(() => {
      getMarkers();
    }, 6000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(refreshInterval);


  }, [userID]);

  const filteredItems = list_markers.filter((item) =>
    item.immatriculation_vehicule.toLowerCase().includes(searchTerm.toLowerCase())
  );
 

    // Fonction pour calculer la différence en heures entre deux timestamps
    function calculateHoursDifference(
      timestamp1: string,
      timestamp2: string
    ): number {
      const diffInMilliseconds =
        new Date(timestamp1).getTime() - new Date(timestamp2).getTime();
      return diffInMilliseconds / (1000 * 60 * 60);
    }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setVehicleDetail("none");
  };

  const handleItemClick = (item: Vehicle) => {
    console.log(item);

    setVehicleDetail("flex");

    setSearchTerm(item.immatriculation_vehicule);

    setSelectedItem(item);

    setClicked(true);

  };


  const handleOnCloseWidget = () => {
    console.log("item");

    setVehicleDetail("none");

    setSearchTerm("");

    setSlideState("slide-state");

    setClicked(false);

  };


  const handleItineraryClick = (PSN: string) => {
    console.log("Type: 1");

    getReportBytype(1, PSN);

  };

  const handleDistanceSpeedClick = (PSN: string) => {
    console.log("Type: 4");

    getReportBytype(4, PSN);

  };

  const handleFuelTankClick = (PSN: string) => {
    console.log("Type: 8");

    getReportBytype(8, PSN);

  };

  const handleTemperatureDiagramClick = (PSN: string) => {
    console.log("Type: 19");

    getReportBytype(19, PSN);

  };

  const handleGroupMarker = () => {
    
    ungroupMarker==false ? setUngroupMarker(true) :setUngroupMarker(false) 
  };


  interface BasemapsDict {
    google_roadmap: string;
    osm: string;
    hot: string;
    dark: string;
    cycle: string;
    google_traffic: string;
    google_satellite: string;
    google_terrain: string;
    mapbox: string;
    [key: string]: string;
  }

  const basemapsDict: BasemapsDict = {
    google_roadmap:'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    hot: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
    cycle: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    google_traffic: 'https://mt0.google.com/vt?lyrs=h@221097413,traffic&x={x}&y={y}&z={z}',
    google_satellite: 'https://www.google.com/maps/vt?lyrs=s@189&gl=us&x={x}&y={y}&z={z}',
    google_terrain: 'https://www.google.com/maps/vt?lyrs=p@189&gl=us&x={x}&y={y}&z={z}',
    mapbox: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWRlbmV0IiwiYSI6ImNqeGs0dHAzbTFlb3UzeXFkOWk1ZWQ5cDIifQ.lpPl03eDGutSjsd0fLaPkw',
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const step = 50;

    switch (event.key) {
      case 'ArrowUp':
        container.scrollTop -= step;
        break;
      case 'ArrowDown':
        container.scrollTop += step;
        break;
      default:
        break;
    }
  };

  const mapLayoutClick = () => {

    listLayout == "layoutfloat" ? setlistLayout("layoutleft") : setlistLayout("layoutfloat");
    mapLayout == "col-12" ? setMapLayout("col-9") : setMapLayout("col-12");

    console.log('Clic sur map-layout');
  };


  const [vehicleState, setVehicleState] = useState<string | null>(null);

  const handleMarker = (state: string) => {
    if (vehicleState === state) {
      setVehicleState(null); // If the filter is already selected, clear the filter
    } else {
      setVehicleState(state); // Otherwise, apply the filter
    }
  };


  return (
    <>
      <Row>
        <div className={`${listLayout} col-3`} style={{ zIndex: 9999, paddingLeft: '30px', margin: ' 20px 0' }}>
          <div style={{margin: "0px 0 15px 0"}} className="">
            <button type="button" data-toggle="tooltip" className={`btn btn-default btn-sm pull-left act ${ vehicleState !== "move" ? "active" : "" }`} id="act_moving" onClick={()=>handleMarker("move")}  title="Engine running">
              <span>{Driving} </span>
              <i className="la la-play-circle" style={{ color: 'green',fontSize: "20px" }}></i>
            </button>
            <button type="button" data-toggle="tooltip" className={`btn btn-delault btn-sm pull-left act ${ vehicleState !== "pause" ? "active" : "" }`} id="act_pause" onClick={()=>handleMarker("pause")}  title="Parking with engine started">
              <span>{ParkingEngineRunning} </span>
              <i className="la la-pause-circle" style={{ color: 'red',fontSize: "20px" }}></i>
            </button>
            <button type="button" data-toggle="tooltip" className={`btn btn-delault btn-sm pull-left act ${ vehicleState !== "stop" ? "active" : "" }`} id="act_stoping" onClick={()=>handleMarker("stop")}  title="Parking">
              <span>{Parcking} </span>
              <i className="las la-stop-circle" style={{ color: 'blue',fontSize: "20px" }}></i>
            </button>
            <button type="button" data-toggle="tooltip" className={`btn btn-delault btn-sm pull-left act ${ vehicleState !== "absence" ? "active" : "" }`} id="act_absence" onClick={()=>handleMarker("absence")}  title="Last transmission">
              <span>{LastTransmission} </span> 
              <i className="la la-history" style={{ color: '#000',fontSize: "20px" }}></i>
            </button> 
            <button type="button" data-toggle="tooltip" className="btn btn-delault btn-sm pull-left act" id="act_regrouper"  onClick={()=>handleGroupMarker()} title="Group or ungroup vehicles">
              <i className="la la-object-ungroup" style={{ color: '#000',fontSize: "20px" }}> </i> 
            </button>
          </div>
          <span className="map-search">
            
            <input type="text" placeholder="Search vehicle, driver..." value={searchTerm} onChange={handleSearchChange} /> ({list_markers.length}) <i className="las la-search"></i>
          </span> 
          <span className='map-layout' onClick={mapLayoutClick}>
            <i className="las la-list" data-rel="bootstrap-tooltip" title="Increased" style={{ fontSize: "24px" }}></i>
          </span>
          <animated.div className="map-list" ref={containerRef} onWheel={handleWheelScroll} tabIndex={0} style={animationProps}>
            {filteredItems.map((item) => ( 
              (vehicleState === null || vehicleState === engineStatClass(item.ENGINESTAT, item.SOG)) && (<div key={item.id_vehicule} id={item.id_vehicule.toString()} onClick={() => handleItemClick(item)} className={`VehicleWidget ${engineStatClass(item.ENGINESTAT, item.SOG)}`} >
                <VehicleWidget
                  id={item.id_vehicule}
                  matriculation={item.immatriculation_vehicule}
                  timestamp={item.TIMESTAMP}
                  SOG={item.SOG} 
                  LAT={item.LAT}
                  LON={item.LON}
                  COG={item.COG}
                  enginestat={item.ENGINESTAT}
                  gpsdist={item.GPSDIST}
                  detail={vehicleDetail}
                  PSN={item.PSN}
                  handleItineraryClick={handleItineraryClick}
                  handleDistanceSpeedClick={handleDistanceSpeedClick}
                  handleFuelTankClick={handleFuelTankClick}
                  handleTemperatureDiagramClick={handleTemperatureDiagramClick}
                  onClose={handleOnCloseWidget}
                />
              </div>
            )))}
          </animated.div>
        </div>
        <div className={mapLayout} style={{ padding: "0px" }}>
          <MapContainer center={center} zoom={zoom} style={{ padding: 0, margin: 0, height: '86vh', width: '100%', zIndex: 1 }}>
            <MapContent />

            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url={basemapsDict[baseMap]} />
            <div className="basemaps-container">
              <select
                value={baseMap}
                onChange={(e) => setBaseMap(e.target.value)}
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}asset/images/mapicon/layers.png)`,
                  appearance: 'none',
                  backgroundSize: '22px',
                  backgroundPosition: ' center center',
                  backgroundRepeat: 'no-repeat',
                  border: 'none',
                  color: 'transparent',
                  outline: 'none', 
                }}
              >
                {basemapOptions.map((option) => (
                  <option  key={option.value} value={option.value} style={{ color: 'black' }}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <GroupComponent>
              {list_markers.map((item) => (
                <Marker
                  key={item.id_vehicule}
                  position={[item.LAT, item.LON]}
                  icon={IconMarker(item.COG, "asset/images/mapicon/car.svg", () => handleItemClick(item))}
                >
                  <Popup><span onClick={() => handleItemClick(item)}> <img src={engineStat(item.ENGINESTAT, item.COG, translate).iconState} alt="" /> {item.immatriculation_vehicule}</span></Popup>
                </Marker>
              ))}
            </GroupComponent>
            <FullscreenControl position="topright" title="Show me the fullscreen map" forceSeparateButton={false} />

          </MapContainer>
        </div>
        <div className="layoutfloat" style={{ zIndex: 9999, background: " #fff", bottom: "0px", border: " 1px solid #ddd; ", padding: "0" }}>

          <Slider {...settings} className={`${slideState}`}>
            <div className="dvc">
              <i className="las la-times" style={{ position: "absolute", zIndex: 9999, border: "1px solid #ddd", borderRadius: "19px", padding: "6px" }} onClick={() => { setSlideState("slide-state") }}></i>

              <Row>
                <Col xs={3} style={{ padding: " 7px 5px 0 20px", }} >
                  <div style={{ backgroundColor: '#fff', padding: "inherit", margin: '5px' }}>
                    <h5>Rapport distance, vitesse et contact</h5>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-play" style={{ marginBottom: "7px", color: "green" }}></i>
                        <span id="duration-play"> 00h 46m</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-stop" style={{ marginBottom: "7px", color: "blue" }}></i>
                        <span id="duration-stop"> 00h 21m</span>
                      </span>
                    </div>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt red" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="max-speed"> Max 94.62 km/h</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt green" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="average-speed">Moy 45.59 km/h</span>
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xs={9}>
                  {DistanceSpeedData && Object.keys(DistanceSpeedData).length > 0 ? ( // Vérifie si DistanceSpeedData n'est pas vide 
                    <div style={{ backgroundColor: '#fff', padding: '0', margin: '8' }}>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={DistanceSpeedData}
                      />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fff', padding: '16px', margin: '8px', textAlign: "center" }}>
                      Aucune donnée à afficher  Aucune donnée à afficher pour le distance, vitesse et contact
                    </div>
                  )}
                </Col>
              </Row>

 
            </div>
            <div className="dvc">
              <i className="las la-times" style={{ position: "absolute", zIndex: 9999, border: "1px solid #ddd", borderRadius: "19px", padding: "6px" }} onClick={() => { setSlideState("slide-state") }}></i>

              <Row>
                <Col xs={3} style={{ padding: " 7px 5px 0 20px", }} >
                  <div style={{ backgroundColor: '#fff', padding: "inherit", margin: '5px' }}>
                    <h5>Rapport carburant</h5>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-play" style={{ marginBottom: "7px", color: "green" }}></i>
                        <span id="duration-play"> 00h 46m</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-stop" style={{ marginBottom: "7px", color: "blue" }}></i>
                        <span id="duration-stop"> 00h 21m</span>
                      </span>
                    </div>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt red" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="max-speed"> Max 94.62 km/h</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt green" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="average-speed">Moy 45.59 km/h</span>
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xs={9}>
                  {FuelTankData && Object.keys(FuelTankData).length > 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '0', margin: '8' }}>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={FuelTankData}
                      />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fff', padding: '16px', margin: '8px', textAlign: "center" }}>
                      Aucune donnée à afficher pour le graphique du réservoir de carburant.
                    </div>
                  )}
                </Col>

              </Row>
            </div>
            <div className="dvc">
              <i className="las la-times" style={{ position: "absolute", zIndex: 9999, border: "1px solid #ddd", borderRadius: "19px", padding: "6px" }} onClick={() => { setSlideState("slide-state") }}></i>

              <Row>
                <Col xs={3} style={{ padding: " 7px 5px 0 20px", }} >
                  <div style={{ backgroundColor: '#fff', padding: "inherit", margin: '5px' }}>
                    <h5>Rapport temperature</h5>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-play" style={{ marginBottom: "7px", color: "green" }}></i>
                        <span id="duration-play"> 00h 46m</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="fa fa-stop" style={{ marginBottom: "7px", color: "blue" }}></i>
                        <span id="duration-stop"> 00h 21m</span>
                      </span>
                    </div>
                    <div className="row wait-mitrics-speed" style={{ display: "block" }}>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt red" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="max-speed"> Max 94.62 km/h</span>
                      </span>
                      <span className="col-sm-6 col-xs-6">
                        <i className="las la-tachometer-alt green" style={{ marginBottom: "7px", fontSize: "23px" }}></i>
                        <span id="average-speed">Moy 45.59 km/h</span>
                      </span>
                    </div>
                  </div>
                </Col>
                <Col xs={9}>
                  {TemperaturetData && Object.keys(TemperaturetData).length > 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '0', margin: '8' }}>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={TemperaturetData}
                      />
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fff', padding: '16px', margin: '8px', textAlign: "center" }}>
                      Aucune donnée à afficher pour le graphique temperature.
                    </div>
                  )}
                </Col>
              </Row>
            </div>

          </Slider>

        </div>
      </Row>

    </>
  );
};

export default Map;
