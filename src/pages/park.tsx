import React, { useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
    
    LayersControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useParams, Link, useNavigate } from "react-router-dom";

import Selectlist from "../components/Park/Selectlist";
import { useTranslate } from "../hooks/LanguageProvider";
import { parseGeofenceAttributes, parseGeofencing, calculateSurfaceOrLength,Geofence } from "../utilities/functions";
import { toast, Bounce } from "react-toastify";
import { Button } from "react-bootstrap";


L.Icon.Default.mergeOptions({
    iconRetinaUrl: "leaflet/dist/images/mapicon/marker-engineon.png",
    iconUrl: "leaflet/dist/images/mapicon/marker-icon.png",
    shadowUrl: "leaflet/dist/images/mapicon/marker-shadow.png",
});
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const { BaseLayer } = LayersControl;

// interface Geofence {
//     id: number;
//     type: "circle" | "polygon" | "polyline" | "marker" | "rectangle";
//     center?: [number, number];
//     radius?: number;
//     positions?: [number, number][];
//     position?: [number, number];
// }

interface UserInterface {
    id_user: number;
    nom_user: string;
    prenom_user: string;
}

interface GeofenceCalcule {
    id: number;
    type: "circle" | "polygon" | "polyline" | "marker" | "rectangle";
    positions?: [number, number][]; // La propriété positions peut être optionnelle
}

interface POIInterface {
    idgeof: number;
    codegeof: string;
    namegeof: string;
    descriptiongeof: string;
    username_user?: string;
    etatgeof: string;
    areageof: string;
    datecreategeof: string;
    tolerance: number;
    userid: number;
}

const Park: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const editControlRef = useRef<any>(null);
    const featureGroupRef = useRef<any>(null);
    const [step, setStep] = useState(1);
    const { translate } = useTranslate();
    const id_user = localStorage.getItem("GeopUserID");
    const { id_poi } = useParams<{ id_poi?: string }>();
    let [POI, setPOI] = useState<POIInterface>({
        idgeof: parseInt(id_poi ?? "0", 10),
        codegeof: "",
        namegeof: "",
        descriptiongeof: "",
        etatgeof: "",
        areageof: "",
        datecreategeof: "",
        tolerance: 0,
        userid: parseInt(id_user ?? "0", 10),
    });

    const navigate = useNavigate();
    let [geofences, setGeofences] = useState<Geofence[]>([]);
    const [upadteCodegeof, setUpadtecodegeof] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([30.5670197, 4.6911217]);
    const [mapZoom, setMapZoom] = useState<number>(6);
    const [usersOptions, setUsersOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" },]);
    const [Users, setUsers] = useState<UserInterface[]>([]);
    const [user, setUser] = useState<UserInterface>({
        id_user: parseInt(id_user ?? '0', 10) || 0,
        nom_user: "",
        prenom_user: ""
    });

    let result: number = 0;
    let resultType = 'Surface';

    const verifyUsername = () => {
        // Votre logique pour vérifier le nom d'utilisateur ici
    };

    const handleCreated = (e: any) => {
        const { layerType, layer } = e;

        let newGeofence: Geofence = {
            id: layer._leaflet_id,
            type: layerType,
        };

        if (layerType === "circle") {
            const center = layer.getLatLng();
            newGeofence = {
                ...newGeofence,
                center: [center.lat, center.lng], // Convert LatLng to [number, number]
                radius: layer.getRadius(),
            };
        } else if (layerType === "polygon" || layerType === "rectangle") {
            newGeofence = {
                ...newGeofence,
                positions: layer.getLatLngs()[0].map((latlng: L.LatLng) => [latlng.lat, latlng.lng]), // Convert LatLngs to [number, number]
            };
        } else if (layerType === "polyline") {
            newGeofence = {
                ...newGeofence,
                positions: layer.getLatLngs().map((latlng: L.LatLng) => [latlng.lat, latlng.lng]), // Convert LatLngs to [number, number]
            };
        } else if (layerType === "marker") {
            const position = layer.getLatLng();
            newGeofence = {
                ...newGeofence,
                position: [position.lat, position.lng], // Convert LatLng to [number, number]
            };
        }

        setGeofences((prevGeofences) => [...prevGeofences, newGeofence]);

        //refreshPOI([newGeofence]);
    };


    const handleEdited = (e: any) => {
        const layers = e.layers;
        const updatedGeofences: Geofence[] = [];
    
        layers.eachLayer((layer: any) => {
            const layerId = layer._leaflet_id;
            let updatedGeofence: Geofence | null = null;
    
            if (layer instanceof L.Circle) {
                const center = layer.getLatLng();
                updatedGeofence = {
                    id: layerId,
                    type: "circle",
                    center: [center.lat, center.lng], // Convert LatLng to [number, number]
                    radius: parseFloat(layer.getRadius().toFixed(2)),
                };
            } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                const latlngs = layer.getLatLngs();
                if (layer instanceof L.Rectangle) {
                    // Rectangle should have two corner points
                    const corners = latlngs as L.LatLng[];
                    if (corners.length === 2) {
                        const [corner1, corner2] = corners;
                        updatedGeofence = {
                            id: layerId,
                            type: "rectangle",
                            positions: [
                                [corner1.lat, corner1.lng],
                                [corner2.lat, corner2.lng]
                            ], // Convert LatLngs to [number, number]
                        };
                    }
                } else {
                    // Handle polygons
                    updatedGeofence = {
                        id: layerId,
                        type: "polygon",
                        positions: Array.isArray(latlngs) && Array.isArray(latlngs[0])
                            ? (latlngs[0] as L.LatLng[]).map((latlng: L.LatLng) => [latlng.lat, latlng.lng]) // Convert LatLngs to [number, number]
                            : [], // Handle case where latlngs is not an array or is empty
                    };
                }
            } else if (layer instanceof L.Polyline) {
                const latlngs = layer.getLatLngs();
                updatedGeofence = {
                    id: layerId,
                    type: "polyline",
                    positions: Array.isArray(latlngs)
                        ? (latlngs as L.LatLng[]).map((latlng: L.LatLng) => [latlng.lat, latlng.lng]) // Convert LatLngs to [number, number]
                        : [], // Handle case where latlngs is not an array
                };
            } else if (layer instanceof L.Marker) {
                const position = layer.getLatLng();
                updatedGeofence = {
                    id: layerId,
                    type: "marker",
                    position: [position.lat, position.lng], // Convert LatLng to [number, number]
                };
            }
    
            if (updatedGeofence) {
                updatedGeofences.push(updatedGeofence);
            }
        });
    
        // Update geofences state with the updated geofences
        setGeofences((prevGeofences) =>
            prevGeofences.map((geofence) =>
                updatedGeofences.find((updated) => updated.id === geofence.id) || geofence
            )
        );
    
        // Call refreshPOI with the updated geofences
        refreshPOI(updatedGeofences);
    };
    

    function calculateCenter(geofences: GeofenceCalcule[]): [number, number] {
        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        geofences.forEach((geofence) => {
            if (geofence.positions) {
                geofence.positions.forEach(([lat, lng]) => {
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLng = Math.min(minLng, lng);
                    maxLng = Math.max(maxLng, lng);
                });
            }
        });

        return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
    }

    function calculateZoom(geofences: Geofence[]): number {
        const WORLD_DIM = { height: 256, width: 256 };
        const ZOOM_MAX = 21;

        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        geofences.forEach((geofence) => {
            if (geofence.positions) {
                geofence.positions.forEach(([lat, lng]) => {
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLng = Math.min(minLng, lng);
                    maxLng = Math.max(maxLng, lng);
                });
            }
        });

        const latFraction = (maxLat - minLat) / 180;
        const lngFraction = (maxLng - minLng) / 360;

        const latZoom = Math.floor(Math.log2((WORLD_DIM.height / 256) / latFraction));
        const lngZoom = Math.floor(Math.log2((WORLD_DIM.width / 256) / lngFraction));

        return Math.min(latZoom, lngZoom, ZOOM_MAX);
    }

    const getPOI = async (idPoi: string, idUser: string) => {
        try {
            const bodyData = JSON.stringify({
                id_poi: idPoi,
                id_user: idUser,
            });

            const POIResponse = await fetch(`${backendUrl}/api/poi/find`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: bodyData,
                mode: "cors",
            });

            if (!POIResponse.ok) {
                console.error("Erreur lors de la récupération du POI");
                return;
            }

            const data = await POIResponse.json();

            const mappedGeofences = data.map((item: POIInterface) => {
                return parseGeofenceAttributes(item.areageof, item.idgeof);
            });

            setPOI(data[0]);
            POI = data[0];
            if (POI) setUpadtecodegeof(POI?.codegeof)
            setGeofences(mappedGeofences);

            let center: [number, number] = [51.505, -0.09];
            let zoom: number = 13;

            const geofenceWithCenter = mappedGeofences.find((geofence: Geofence) =>
                (geofence.type === "circle" || geofence.type === "marker") && geofence.center
            );

            if (geofenceWithCenter) {
                center = geofenceWithCenter.center!;
                zoom = 16;
            } else {
                const geofenceWithPositions = mappedGeofences.find((geofence: Geofence) =>
                    (geofence.type === "polygon" || geofence.type === "polyline" || geofence.type === "rectangle") && geofence.positions
                );

                if (geofenceWithPositions) {


                    center = calculateCenter([geofenceWithPositions]);
                    zoom = calculateZoom([geofenceWithPositions]);
                }
            }

            setMapCenter(center);
            setMapZoom(zoom);



            try {
                if (POI) {
                    const geofence = parseGeofencing(POI?.areageof);
                    result = calculateSurfaceOrLength(geofence);
                    if (geofence.type === 'LINESTRING') {
                        resultType = 'Longueur';
                    }
                }
            } catch (error) {
                console.error(error);
                resultType = 'Erreur';
            }

            if (mapRef.current) {
                mapRef.current.setView(center, zoom);
            }

        } catch (error) {
            console.error(error);
        }
    };



    /*************************************************************************************************** */


    const refreshMapFromPOI = () => {
        try {
            if (POI) {
                // Analyser les géofences à partir de POI.areageof
                const mappedGeofences = parseGeofenceAttributes(POI.areageof, POI.idgeof);
    
                // Si mappedGeofences est un tableau, utilisez-le directement ; sinon, convertissez-le en tableau
                const geofencesArray = Array.isArray(mappedGeofences) ? mappedGeofences : [mappedGeofences];
    
                // Mettre à jour l'état des géofences avec les géofences du POI
                setGeofences(geofencesArray);
    
                // Déterminer le centre et le zoom de la carte en fonction des géofences
                let center: [number, number] = [51.505, -0.09];
                let zoom: number = 13;
    
                const geofenceWithCenter = geofencesArray.find((geofence: Geofence) =>
                    (geofence.type === "circle" || geofence.type === "marker") && geofence.center
                );
    
                if (geofenceWithCenter && geofenceWithCenter.center) {
                    center = geofenceWithCenter.center;
                    zoom = 16;
                } else {
                    const geofenceWithPositions = geofencesArray.find((geofence: Geofence) =>
                        (geofence.type === "polygon" || geofence.type === "polyline" || geofence.type === "rectangle") && geofence.positions
                    );
    
                    if (geofenceWithPositions && geofenceWithPositions.positions) {
                        center = calculateCenter([geofenceWithPositions]);
                        zoom = calculateZoom([geofenceWithPositions]);
                    }
                }
    
                // Mettre à jour le centre et le zoom de la carte
                setMapCenter(center);
                setMapZoom(zoom);
    
                // Mettre à jour la vue de la carte
                if (mapRef.current) {
                    mapRef.current.setView(center, zoom);
                }
    
                // Recharger les géofences sur la carte sans utiliser updateGeofencesOnMap
                if (featureGroupRef.current) {
                    // Effacer les couches existantes du groupe de fonctionnalités
                    featureGroupRef.current.clearLayers();
    
                    // Parcourir les géofences et les ajouter au groupe de fonctionnalités
                    geofencesArray.forEach((geofence) => {
                        let layer: L.Layer | null = null;
    
                        if (geofence.type === "circle" && geofence.center) {
                            layer = L.circle(geofence.center, { radius: geofence.radius });
                        } else if (geofence.type === "polygon" && geofence.positions) {
                            layer = L.polygon(geofence.positions);
                        } else if (geofence.type === "rectangle" && geofence.positions) {
                            if (geofence.positions.length === 2) {
                                const bounds: L.LatLngBoundsLiteral = [
                                    [geofence.positions[0][0], geofence.positions[0][1]],
                                    [geofence.positions[1][0], geofence.positions[1][1]],
                                ];
                                layer = L.rectangle(bounds);
                            } else {
                                layer = L.polygon(geofence.positions);
                            }
                        } else if (geofence.type === "polyline" && geofence.positions) {
                            layer = L.polyline(geofence.positions);
                        } else if (geofence.type === "marker" && geofence.position) {
                            layer = L.marker(geofence.position);
                        }
    
                        if (layer) {
                            // Ajouter le layer au groupe de fonctionnalités
                            featureGroupRef.current.addLayer(layer);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    


    const refreshPOI = (updatedGeofences: Geofence[]) => {
        // Update the state of the geofences with the new data
        setGeofences(updatedGeofences);
   

        // Convert the updated geofences into a string for the `areageof` field
        const newAreageof = convertGeofencesToAreageof(updatedGeofences);

        // Update the POI state with the new `areageof` value
        setPOI(prevPOI => {
            if (!prevPOI) {
                return {
                    // Provide default values for all properties of POIInterface
                    areageof: '',
                    idgeof: 0,
                    codegeof: '',
                    namegeof: '',
                    descriptiongeof: '',
                    username_user: '',
                    etatgeof: '',
                    datecreategeof: '',
                    tolerance: 0,
                    userid: 0,
                };
            }

            return {
                ...prevPOI,
                areageof: newAreageof,
            };
        });


        // Clear existing layers from the feature group
        if (featureGroupRef.current) {
            featureGroupRef.current.clearLayers();

            // Redraw the updated geofences on the map
            // const updateGeofencesOnMap = (updatedGeofences: Geofence[]) => {
            //     // Check if featureGroupRef is defined and the map is ready
            //     if (featureGroupRef.current) {
            //         // Iterate over each updated geofence
            //         updatedGeofences.forEach(geofence => {
            //             let layer: L.Layer | null = null;
            
            //             // Determine the type of geofence and create the appropriate layer
            //             if (geofence.type === "circle" && geofence.center) {
            //                 // Create a circle with the specified center and radius
            //                 layer = L.circle(geofence.center, { radius: geofence.radius });
            //             } else if (geofence.type === "polygon" && geofence.positions) {
            //                 // Create a polygon with the specified positions
            //                 layer = L.polygon(geofence.positions);
            //             } else if (geofence.type === "rectangle" && geofence.positions) {
            //                 // Create a rectangle with the specified corners (positions)
            //                 // Assuming `geofence.positions` is an array of two tuples: [ [lat1, lng1], [lat2, lng2] ]
            //                 if (geofence.positions.length === 2) {
            //                     // Convert positions to LatLngBoundsExpression
            //                     const bounds: L.LatLngBoundsLiteral = [
            //                         [geofence.positions[0][0], geofence.positions[0][1]], // South-West corner
            //                         [geofence.positions[1][0], geofence.positions[1][1]]  // North-East corner
            //                     ];
            //                     layer = L.rectangle(bounds);
            //                 }
            //             } else if (geofence.type === "polyline" && geofence.positions) {
            //                 // Create a polyline with the specified positions
            //                 layer = L.polyline(geofence.positions);
            //             } else if (geofence.type === "marker" && geofence.position) {
            //                 // Create a marker with the specified position
            //                 layer = L.marker(geofence.position);
            //             }
            
            //             // Add the layer to featureGroupRef if it is defined
            //             if (layer) {
            //                 featureGroupRef.current.addLayer(layer);
            //             }
            //         });
            //     }
            // };
        }
    
    };


    let newGeofences: Geofence[];

    // Supposons que vous ayez une fonction qui manipule un layer
    const saveCurrentGeofences = () => {
        const layers = featureGroupRef.current?.getLayers() || [];

        // Assigner le type `L.Layer` au paramètre `layer`
        newGeofences = layers.map((layer: L.Layer) => {
            const leafletId = L.Util.stamp(layer); // Utilisation de L.Util.stamp() pour obtenir l'ID

            // Vérification du type spécifique du layer
            if (layer instanceof L.Circle) {
                const latLng = layer.getLatLng();
                return {
                    id: leafletId,
                    type: "circle",
                    center: [latLng.lat, latLng.lng], // Assurez-vous que center est un tableau [lat, lng]
                    radius: layer.getRadius(),
                };
            } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                const latLngs = layer.getLatLngs() as L.LatLng[][]; // Peut être un tableau de tableaux
                const positions = latLngs.flat().map(latLng => [latLng.lat, latLng.lng] as [number, number]);
                return {
                    id: leafletId,
                    type: layer instanceof L.Polygon ? "polygon" : "rectangle",
                    positions,
                };
            } else if (layer instanceof L.Polyline) {
                const latLngs = layer.getLatLngs() as L.LatLng[];
                const positions = latLngs.map(latLng => [latLng.lat, latLng.lng] as [number, number]);
                return {
                    id: leafletId,
                    type: "polyline",
                    positions,
                };
            } else if (layer instanceof L.Marker) {
                const latLng = layer.getLatLng();
                return {
                    id: leafletId,
                    type: "marker",
                    position: [latLng.lat, latLng.lng], // Assurez-vous que position est un tableau [lat, lng]
                };
            }

            // Si ce n'est pas un type supporté, retourner null
            return null;
        }).filter(Boolean) as Geofence[];

        refreshPOI(newGeofences);
    }


    useEffect(() => {
        loadGeofencesToMap();
    }, [step]);

    const loadGeofencesToMap = () => {
        if (featureGroupRef.current) {
            featureGroupRef.current.clearLayers();

            geofences.forEach(geofence => {
                if (geofence.type === "circle" && geofence.center) {
                    const radius = geofence.radius ?? 0; 
                    L.circle(geofence.center, { radius }).addTo(featureGroupRef.current);
                } else if (geofence.type === "polygon" && geofence.positions) {
                    L.polygon(geofence.positions).addTo(featureGroupRef.current);
                }
            });
        }
    };




    const extractLatLng = (latLngString: string): { lat: number, lng: number } => {
        const match = latLngString.match(/LatLng\(([^,]+),\s*([^)]+)\)/);
        let lat = 0;
        let lng = 0;
        if (match) {
            lat = parseFloat(match[1]);
            lng = parseFloat(match[2]);

        }
        return { lat, lng };
    };
   

    const convertLatLngArray = (latLngArray: [number, number][]): string =>
        latLngArray.map(([lat, lng]) => `${lat} ${lng}`).join(',');

    const convertLatLngLINESTRINGArray = (latLngArray: [number, number][]): string =>
        latLngArray.map(([lat, lng]) => `${lat} ${lng}`).join(', ');
    
    
    const convertGeofencesToAreageof = (geofences: Geofence[]): string => {
        const geofenceStrings = geofences.map(geofence => {
            switch (geofence.type) {
                case "circle":
                    if (geofence.center && typeof geofence.center[0] === 'number' && typeof geofence.center[1] === 'number' && geofence.radius) {
                        const [lat, lng] = geofence.center;
                        return `CIRCLE(${lat},${lng},${geofence.radius})`;
                    }
                    return "";
    
                case "polygon":
                    if (geofence.positions && Array.isArray(geofence.positions)) {
                        const positions = convertLatLngArray(geofence.positions);
                        return `POLYGON((${positions}))`;
                    }
                    return "";
    
                case "rectangle":
                    if (geofence.positions && Array.isArray(geofence.positions)) {
                        const positions = convertLatLngArray(geofence.positions);
                        return `RECTANGLE(${positions})`;
                    }
                    return "";
    
                case "polyline":
                    if (geofence.positions && Array.isArray(geofence.positions)) {
                        const positions = convertLatLngLINESTRINGArray(geofence.positions);
                        return `LINESTRING(${positions})`;
                    }
                    return "";


                    
    
                case "marker":
                    if (geofence.position && typeof geofence.position[0] === 'number' && typeof geofence.position[1] === 'number') {
                        const [lat, lng] = geofence.position;
                        return `MARKER(${lat},${lng})`;
                    }
                    return "";
    
                default:
                    return "";
            }
        }).filter(str => str.length > 0); 
    
        return geofenceStrings.join('; ');
    };
    


    useEffect(() => {
        if (id_poi && id_user) {
            getPOI(id_poi, id_user);
        }
    }, []);

    



    const addPOI = () => {

        saveCurrentGeofences()
        console.log("Step 2");
        console.log(POI.areageof);

        setStep(2);
    };

    const wizardBack = () => {

      // saveCurrentGeofences()

   // if(id_poi && id_user)   getPOI(id_poi, id_user);
     
        setStep(step - 1);

        setTimeout(() => {     refreshMapFromPOI() }, 300);
     
        console.log("Step 1");
        console.log(POI.areageof);;
        
    
    };



    const findUserById = (
        id: number
    ): { value: number; label: string } | undefined => {
        const foundUser = Users.find((user) => user.id_user === id);

        if (foundUser) {
            const { id_user, nom_user, prenom_user } = foundUser;
            return { value: id_user, label: `${nom_user} ${prenom_user || ""}` };
        }

        return undefined;
    };

    useEffect(() => {
        if (id_user) {
            getUser(id_user);
        }
    }, [id_user]);

    const getUser = async (userId: any) => {
        try {
            const res = await fetch(`${backendUrl}/api/users/find/${userId}`, {
                mode: "cors",
            });

            if (!res.ok) {
                console.error("Erreur lors de la récupération des utilisateurs");
                return;
            }

            const usersData = await res.json();
            setUsers(usersData);

            const usersOptionsData = usersData.map((user: any) => ({
                value: user.id_user,
                label: `${user.nom_user} ${user.prenom_user || ""}`,
            }));

            setUsersOptions(usersOptionsData);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs", error);
        }
    };



    const handleClick = async () => {
        if (POI) {
            await updatePOI(POI);
        } else {
            console.warn("POI is not defined or empty");
        }
    };

    const updatePOI = async (poi: POIInterface) => {
        const isCodeValid = poi.codegeof.trim().length > 0
        const isNameValid = poi.namegeof.trim().length > 0;
        const isAreaValid = poi.areageof.trim().length > 0;

        if (!isNameValid || !isAreaValid || !isCodeValid) {
            const nameElement = document.getElementById("namegeof");
            if (nameElement) {
                nameElement.style.borderColor = isNameValid ? "#ced4da" : "red";
            }

            const areaElement = document.getElementById("areageof");
            if (areaElement) {
                areaElement.style.borderColor = isAreaValid ? "#ced4da" : "red";
            }

            const codegeofElement = document.getElementById("codegeof");
            if (codegeofElement) {
                codegeofElement.style.borderColor = isCodeValid ? "#ced4da" : "red";
            }


            toast.warn("Please fill in all required fields", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setButtonClicked(false);
            return;
        } else {
            try {
                const resCheck = await fetch(`${backendUrl}/api/poi/check`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        codegeof: poi.codegeof,
                        updatedCodeGeof: upadteCodegeof,
                        updated: (upadteCodegeof === poi.codegeof) ? 0 : 1
                    }),
                });

                if (!resCheck.ok) {
                    throw new Error("Network response was not ok");
                }

                const jsonResponse = await resCheck.json();
   
                // eslint-disable-next-line eqeqeq
                if (jsonResponse.poi_count == 0) {
                    const resUpdate = await fetch(`${backendUrl}/api/poi/update`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        mode: "cors",
                        body: JSON.stringify(
                            {
                                idgeof: poi.idgeof,
                                codegeof: poi.codegeof,
                                namegeof: poi.namegeof,
                                descriptiongeof: poi.descriptiongeof,
                                etatgeof: poi.etatgeof,
                                areageof: poi.areageof,
                                tolerance: poi.tolerance,
                                userid: poi.userid,
                            }
                        ),
                    });

                    if (!resUpdate.ok) {
                        toast.warn("Can't update POI", {
                            position: "bottom-right",
                            autoClose: 2400,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        });
                        console.error("Error updating POI");
                        return;
                        setButtonClicked(false);
                    }

                    toast.success("POI updated successfully", {
                        position: "bottom-right",
                        autoClose: 2400,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    setButtonClicked(false);

                    navigate("/POIs");

                } else {
                    toast.warn("The POI exists", {
                        position: "bottom-right",
                        autoClose: 2400,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    setButtonClicked(false);
                }
            } catch (error) {
                toast.warn("Can't update POI", {
                    position: "bottom-right",
                    autoClose: 2400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setButtonClicked(false);
            }
        }
    };

    const createPOI = async (poi: POIInterface) => {
        const isCodeValid = poi.codegeof.trim().length > 0;
        const isNameValid = poi.namegeof.trim().length > 0;
        const isAreaValid = poi.areageof.trim().length > 0;


        if (!isNameValid || !isAreaValid || !isCodeValid) {
            const nameElement = document.getElementById("namegeof");
            if (nameElement) {
                nameElement.style.borderColor = isNameValid ? "#ced4da" : "red";
            }

            const areaElement = document.getElementById("areageof");
            if (areaElement) {
                areaElement.style.borderColor = isAreaValid ? "#ced4da" : "red";
            }

            const codegeofElement = document.getElementById("codegeof");
            if (codegeofElement) {
                codegeofElement.style.borderColor = isCodeValid ? "#ced4da" : "red";
            }

            toast.warn("Please fill in all required fields", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setButtonClicked(false);

            return;
        } else {
            try {
                const resCheck = await fetch(`${backendUrl}/api/poi/check`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        codegeof: poi.codegeof,
                        updatedCodeGeof: upadteCodegeof,
                        updated: 0
                    }),
                });

                if (!resCheck.ok) {
                    throw new Error("Network response was not ok");
                }

                const jsonResponse = await resCheck.json();

                if (jsonResponse.poi_count === 0) {


                    let poiData = Object.fromEntries(
                        Object.entries(poi).filter(([_, value]) => value !== null)
                    );


                    const resCreate = await fetch(`${backendUrl}/api/poi/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        mode: "cors",
                        body: JSON.stringify(
                            {
                                codegeof: poi.codegeof,
                                namegeof: poi.namegeof,
                                descriptiongeof: poi.descriptiongeof,
                                etatgeof: "Inactive",
                                areageof: poi.areageof,
                                tolerance: poi.tolerance,
                                userid: poi.userid,
                            }
                        ),
                    });



                    if (!resCreate.ok) {
                        toast.warn("Can't create POI", {
                            position: "bottom-right",
                            autoClose: 2400,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        });
                        console.error("Error creating POI");
                        return;

                        setButtonClicked(false);
                    }

                    toast.success("POI created successfully", {
                        position: "bottom-right",
                        autoClose: 2400,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });

                    setButtonClicked(false);

                    navigate("/POIs");
                } else {
                    toast.warn("The POI exists", {
                        position: "bottom-right",
                        autoClose: 2400,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    setButtonClicked(false);
                }
            } catch (error) {
                toast.warn("Can't create POI", {
                    position: "bottom-right",
                    autoClose: 2400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setButtonClicked(false);
            }
        }
    };


    useEffect(() => {
        if (mapRef.current && geofences.length > 0) {
            const featureGroup = featureGroupRef.current;
            featureGroup.clearLayers();

            geofences.forEach(geofence => {
                let layer;
                if (geofence.type === 'circle' && geofence.center) {
                    const radius = geofence.radius ?? 0;
                    layer = L.circle(geofence.center, { radius});
                } else if (geofence.type === 'polygon' && geofence.positions) {
                    layer = L.polygon(geofence.positions);
                } else if (geofence.type === 'polyline' && geofence.positions) {
                    layer = L.polyline(geofence.positions);
                } else if (geofence.type === 'marker' && geofence.position) {
                    layer = L.marker(geofence.position);
                }

                if (layer) {
                    featureGroup.addLayer(layer);
                }
            });

            setTimeout(() => {
                if (editControlRef.current) {
                    editControlRef.current._toolbars.edit._checkDisabled();
                }
            }, 100);
        }
    }, [geofences]);



    const handleChange = (name: any, value: any) => {

        if (POI) {
            setPOI({
                ...POI,
                [name]: value,
            });
        }

    };


    return (
        <>
            <div id="add_alarm_wizard" className="wizard">
                <ul className="steps">
                    <li data-target="#step1" className={step === 1 ? "active" : ""}>
                        <span className="badge badge-info">1</span> Géométrie{" "}
                        <span className="chevron"></span>
                    </li>
                    <li className="ml-2 mr-2">
                        <i className="las la-exchange-alt"></i>
                    </li>
                    <li data-target="#step2" className={step === 2 ? "active" : ""}>
                        <span className="badge badge-info">2</span> Propriétés
                        <span className="chevron"></span>
                    </li>
                </ul>
            </div>
            <div className="step-content col-12">
                <form
                    id="add_alarm_form"
                    style={{ width: "100%", border: "1px solid #ddd", padding: "15px" }}
                >
                    <input type="hidden" name="step" value={step} />
                    {step === 1 && (
                        <div
                            className="step-pane active panel panel-default"
                            id="step1"
                            style={{ marginTop: "5px", background: "#fff" }}
                        >
                            <div className="panel-body">
                                <div className="row">
                                    <div
                                        className="col-md-6 col-sm-4"
                                        style={{ margin: "8px 0" }}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <strong>Etape 1 </strong> Déssinez/Choisir vos points/zones géographique
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="col-md-6 col-sm-4"
                                        style={{
                                            display: "inline",
                                            textAlign: "right",
                                            margin: "8px 0",
                                        }}
                                    >
                                        <Link
                                            to={`/pois/`}
                                            className="btn btn-outline-secondary  mr-2"
                                            data-toggle="Cancel"
                                            data-placement="top"
                                            title="Cancel"
                                        >
                                            <i
                                                className="fas fa-chevron-left"
                                                style={{ fontSize: "1.2em" }}
                                            ></i>
                                            Cancel
                                        </Link>

                                        <button
                                            className="btn btn-outline-secondary  mr-2"
                                            type="button"
                                            name="set_params"
                                            onClick={addPOI}
                                        >
                                            <i className="fas fa-chevron-right"></i>&nbsp;Suivant
                                        </button>
                                    </div>
                                    <div>
                                        <MapContainer
                                            center={mapCenter}
                                            zoom={mapZoom}
                                            style={{ height: "70vh", width: "100%", zIndex: "1" }}
                                            ref={mapRef}
                                        >
                                            <LayersControl position="topright">
                                                <BaseLayer checked name="OpenStreetMap">
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                </BaseLayer>
                                                <BaseLayer name="Satellite">
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                </BaseLayer>
                                                <BaseLayer name="Topographic">
                                                    <TileLayer
                                                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                                        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                </BaseLayer>
                                            </LayersControl>

                                            <FeatureGroup ref={featureGroupRef}>
                                                <EditControl
                                                    ref={editControlRef}
                                                    position="topleft"
                                                    onCreated={handleCreated}
                                                    onEdited={handleEdited}
                                                    draw={{
                                                        rectangle: true,
                                                        polygon: true,
                                                        circle: true,
                                                        polyline: true,
                                                        marker: true,
                                                       // circlemarker: true,
                                                    }}


                                                />

                                            </FeatureGroup>
                                        </MapContainer>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div
                            className="step-pane panel panel-default"
                            id="step2"
                            style={{ marginTop: "5px", background: "#fff" }}
                        >
                            <div className="panel-body">
                                <div className="row">
                                    <div
                                        className="col-md-12"
                                        id="alarm_text2"
                                        style={{ marginBottom: "15px" }}
                                    ></div>
                                </div>
                                <div
                                    className="row"
                                    id="criteria"
                                    style={{ display: "block" }}
                                >
                                    <div className="col-md-12 col-sm-12" style={{ marginTop: "2px" }} >
                                        <div className="row">
                                            <div className="col-md-6 col-sm-6" style={{ marginTop: "2px" }}>
                                                <div className="input-group">
                                                    <span className="input-group-addon" style={{ paddingRight: " 10px" }}>
                                                        <strong>Etape 2 </strong> Complétez les informations du POI :
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="ccol-md-6 col-sm-6" style={{ display: "inline", textAlign: "right", margin: "8px 0" }}>
                                                <button className="btn btn-outline-secondary  mr-2" type="button" name="back" onClick={wizardBack}>
                                                    <i className="fas fa-chevron-left" style={{ color: "#ff7e41" }}></i>&nbsp;Précédent
                                                </button>

                                                <Button
                                                    onClick={() => {
                                                        setButtonClicked(true);
                                   
                                                        id_poi ? updatePOI(POI) : createPOI(POI);

                                                    }}
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={buttonClicked}
                                                >
                                                    {id_poi ? translate("Save changes") : translate("Create park")}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: "2px" }}>
                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="code_poi">Code park :</label>
                                                <input
                                                    className="form-control"
                                                    name="codegeof"
                                                    id="codegeof"
                                                    placeholder="Code zone"
                                                    title="Code park"
                                                    value={POI?.codegeof || ""}
                                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="code_poi">Nom park :</label>
                                                <input
                                                    className="form-control"
                                                    name="namegeof"
                                                    id="namegeof"
                                                    placeholder="Nom ( * : obligatoire)"
                                                    onKeyUp={verifyUsername}
                                                    title="Nom park"
                                                    value={POI?.namegeof || ""}
                                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="id_user">Utilisateur :</label>
                                                <Selectlist
                                                    controlId="user"
                                                    name="userid"
                                                    id="userid"
                                                    label={translate("User")}
                                                    icon="user"
                                                    options={usersOptions}
                                                    valueType={{
                                                        value: user?.id_user,
                                                        label: findUserById(user?.id_user || 0)?.label || translate("None"),
                                                    }}
                                                    onChange={(selectedOption) => handleChange("userid", selectedOption?.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="surface_poi">  {resultType === 'Longueur' ? 'Longueur (Km)' : 'Surface (Km)²'}</label>
                                                <input
                                                    className="form-control"
                                                    name="surface_poi"
                                                    id="surface_poi"
                                                    value={(result).toFixed(2)}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="surface_poi"> Tolérance (m): </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="tolerance"
                                                    id="tolerance"
                                                    value={POI?.tolerance || "0"}
                                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                                />
                                            </div>

                                            <div className="col-md-6 col-sm-12">
                                                <label htmlFor="surface_poi">Area Data</label>
                                                <input
                                                    className="form-control"
                                                    name="areaData"
                                                    id="areaData"
                                                    value={POI?.areageof || ""}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="col-md-12 col-sm-12">
                                                <label htmlFor="code_poi">Description : </label>
                                                <textarea
                                                    className="form-control"
                                                    id="descriptiongeof"
                                                    name="descriptiongeof"
                                                    placeholder="Description"
                                                    title="Description"
                                                    value={POI?.descriptiongeof || ""}
                                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-md-3 col-sm-3"
                                        id="opts_cell"
                                        style={{ display: "none", marginTop: "2px" }}
                                    ></div>
                                    <div
                                        className="col-md-3 col-sm-3"
                                        id="extra_cell_inline"
                                        style={{ display: "none", marginTop: "2px" }}
                                    ></div>
                                </div>

                                <div className="row" style={{ display: "none" }}>
                                    <div
                                        className="col-md-12"
                                        id="extra_cell"
                                        style={{ marginTop: "10px" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default Park;
