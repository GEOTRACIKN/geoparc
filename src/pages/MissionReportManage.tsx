import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import Select from 'react-select';
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
    LAT?: string | number | null;
    LON?: string | number | null;
    latitude_vehicule?: string | number | null;
    longitude_vehicule?: string | number | null;
}
interface VehiclePosition {
    id_vehicule: number;
    LAT?: string | number | null;
    LON?: string | number | null;
}
interface VehiclePositionResponse {
    value?: VehiclePosition[];
    Count?: number;
}
interface LocationCoordinates {
    latitude: number;
    longitude: number;
}
interface VehicleOption {
    value: number;
    label: string;
    searchLabel: string;
    distanceKm: number | null;
    isNearby: boolean;
}
interface Driver {
    id_conducteur: number;
   driver_mission: string;
}

interface Trailer {
  id_remorque?: number;       // Ajoutez si disponible
  trailer_mission: string;   // Modifiez pour correspondre au champ retourné par l'API
}

interface MissionReportInterface {
    id_misrap?: number | null;              
    ref_misrap: string | null;              
    objt_misrap: string | null;            
    carb_misrap: string | null;              
    frais_misrap: number | null;            
    remorque_misrap: string | null;        
    cond_misrap: string | null;            
    acc_misrap: string | null;            
    itnr_misrap: string | null;            
    amort_misrap: number | null;        
    dep_misrap: string | null;          
    date_dep_misrap: string | null;
    date_arr_misrap: string | null;     
    lieu_misrap: string | null;             
    km_dep_misrap: number | null;          
    nuit_misrap: number | null;          
    immob_misrap: number | null;            
    durr_misrap: number | null;             
    km_ret_misrap: number | null;          
    dist_misrap: number | null;
    id_vehicule: number | null;
    id_user: string | null;
  }
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const id_user = localStorage.getItem("GeopUserID");
  const MAX_DEPARTURE_DISTANCE_KM = 20;

const getDistanceKm = (
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
) => {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(toLat - fromLat);
  const lonDelta = toRadians(toLon - fromLon);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const formatDistanceKm = (distanceKm: number) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
};

export function MissionReportManage() {
  const { id_misrap } = useParams<{ id_misrap?: string }>();
  const isEditing = Boolean(id_misrap);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([]);
const [departureCoordinates, setDepartureCoordinates] = useState<LocationCoordinates | null>(null);
const [departureLookupStatus, setDepartureLookupStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
const [dateError, setDateError] = useState<string | null>(null);
// Ajoutez cette constante au début de votre composant (après les interfaces)
const initialMissionState: MissionReportInterface = {
  id_misrap: null,
  ref_misrap: null,
  objt_misrap: null,
  carb_misrap: null,
  frais_misrap: null,
  remorque_misrap: null,
  cond_misrap: null,
  acc_misrap: null,
  itnr_misrap: null,
  amort_misrap: null,
  dep_misrap: null,
  date_dep_misrap: null,
  lieu_misrap: null,
  date_arr_misrap: null,
  km_dep_misrap: null,
  nuit_misrap: null,
  immob_misrap: null,
  durr_misrap: null,
  km_ret_misrap: null,
  dist_misrap: null,
  id_vehicule: null,
  id_user: id_user
};

// Puis modifiez votre useState pour utiliser cette constante
const [mission, setMission] = useState<MissionReportInterface | null>(
  isEditing && id_misrap 
    ? { ...initialMissionState, id_misrap: Number(id_misrap) } 
    : initialMissionState
);

  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);


  const cancelClicked = () => {
    navigate("/mission-report");
  };

  const geocodeDepartureLocation = useCallback(async (location: string) => {
    const urls = [
      `https://geotrackin.xyz/nominatim/search.php?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const firstResult = Array.isArray(data) ? data[0] : null;
        const latitude = Number(firstResult?.lat);
        const longitude = Number(firstResult?.lon);

        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          return { latitude, longitude };
        }
      } catch (error) {
        console.warn("Geocoding provider failed:", error);
      }
    }

    return null;
  }, []);

useEffect(() => {
  const getMissionReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id_user) {
        throw new Error("User ID is required");
      }

      const [
        vehiclesRes,
        vehiclePositionsRes,
        driversRes,
        trailersRes,
        reportRes
      ] = await Promise.all([
        fetch(`${backendUrl}/api/geop/vehicule/${id_user}`),
        fetch(`${backendUrl}/api/map/find/${id_user}`).catch(() => null),
        fetch(`${backendUrl}/api/geop/driver/${id_user}`),
        fetch(`${backendUrl}/api/geop/trailer/${id_user}`),
        isEditing && id_misrap 
          ? fetch(`${backendUrl}/api/geop/missionReportManage/find/${id_misrap}`)
          : Promise.resolve(new Response(null, { status: 404 })) // Retourne une vraie Response
      ]);

      // Vérification des réponses
      if (!vehiclesRes.ok) throw new Error("Failed to load vehicles");
      if (!driversRes.ok) throw new Error("Failed to load drivers");
      if (!trailersRes.ok) throw new Error("Failed to load trailers");

      const [
        vehiclesData,
        vehiclePositionsData,
        driversData,
        trailersData
      ] = await Promise.all([
        vehiclesRes.json(),
        vehiclePositionsRes && vehiclePositionsRes.ok
          ? vehiclePositionsRes.json()
          : Promise.resolve([]),
        driversRes.json(),
        trailersRes.json()
      ]);

      setVehicles(vehiclesData.vehicles || []);
      const parsedVehiclePositions: VehiclePosition[] | VehiclePositionResponse = vehiclePositionsData;
      setVehiclePositions(
        Array.isArray(parsedVehiclePositions)
          ? parsedVehiclePositions
          : parsedVehiclePositions.value || []
      );
      setDrivers(Array.isArray(driversData) ? driversData : []);
      console.log("Drivers data:", drivers);
drivers.forEach(driver => {
  if (typeof driver.driver_mission !== 'string') {
    console.warn("Driver with non-string value:", driver);
  }
});
      setTrailers(Array.isArray(trailersData) ? trailersData : []);

      // Traitement du rapport si en mode édition
      if (isEditing && reportRes.ok) {
        const reportData: MissionReportInterface = await reportRes.json();
        setMission(reportData);
      }

    } catch (error) {
      console.error("Data loading error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to load data", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  getMissionReport();
}, [id_misrap, id_user, isEditing]);

useEffect(() => {
  const departureLocation = mission?.lieu_misrap?.trim();

  if (!departureLocation) {
    setDepartureCoordinates(null);
    setDepartureLookupStatus("idle");
    return;
  }

  let isCurrent = true;
  setDepartureLookupStatus("loading");

  const timeoutId = window.setTimeout(() => {
    geocodeDepartureLocation(departureLocation)
      .then((coordinates) => {
        if (!isCurrent) return;

        setDepartureCoordinates(coordinates);
        setDepartureLookupStatus(coordinates ? "found" : "not-found");
      })
      .catch((error) => {
        if (!isCurrent) return;

        console.error("Erreur geocodage lieu de depart:", error);
        setDepartureCoordinates(null);
        setDepartureLookupStatus("not-found");
      });
  }, 500);

  return () => {
    isCurrent = false;
    window.clearTimeout(timeoutId);
  };
}, [geocodeDepartureLocation, mission?.lieu_misrap]);

const vehicleOptions = useMemo<VehicleOption[]>(() => {
  const positionByVehicleId = new Map<number, VehiclePosition>();

  vehiclePositions.forEach((position) => {
    positionByVehicleId.set(Number(position.id_vehicule), position);
  });

  return vehicles
    .map((vehicle) => {
      const lastPosition = positionByVehicleId.get(Number(vehicle.id_vehicule));
      const latValue = lastPosition?.LAT ?? vehicle.LAT ?? vehicle.latitude_vehicule;
      const lonValue = lastPosition?.LON ?? vehicle.LON ?? vehicle.longitude_vehicule;
      const lat = Number(latValue);
      const lon = Number(lonValue);
      const hasVehiclePosition = Number.isFinite(lat) && Number.isFinite(lon);
      const distanceKm =
        departureCoordinates && hasVehiclePosition
          ? getDistanceKm(departureCoordinates.latitude, departureCoordinates.longitude, lat, lon)
          : null;
      const isNearby =
        distanceKm !== null && distanceKm <= MAX_DEPARTURE_DISTANCE_KM;
      const registration = vehicle.immatriculation_vehicule || "";

      return {
        value: vehicle.id_vehicule,
        label: registration,
        searchLabel: registration,
        distanceKm,
        isNearby,
      };
    })
    .sort((first, second) => {
      if (first.isNearby !== second.isNearby) {
        return first.isNearby ? -1 : 1;
      }

      if (first.distanceKm === null && second.distanceKm === null) {
        return first.searchLabel.localeCompare(second.searchLabel);
      }

      if (first.distanceKm === null) return 1;
      if (second.distanceKm === null) return -1;

      return first.distanceKm - second.distanceKm;
    });
}, [departureCoordinates, vehiclePositions, vehicles]);

const nearbyVehicleCount = useMemo(
  () => vehicleOptions.filter((option) => option.isNearby).length,
  [vehicleOptions]
);



  const updateMission = async (misrap: MissionReportInterface) => {
    try {
        // Prepare the mission data by filtering out null values
        let missionReportData = {
          id_misrap: misrap.id_misrap,
          ref_misrap: misrap.ref_misrap,
          objt_misrap: misrap.objt_misrap,
          carb_misrap: misrap.carb_misrap,
          frais_misrap: misrap.frais_misrap,
          remorque_misrap: misrap.remorque_misrap,
          cond_misrap: misrap.cond_misrap,
          acc_misrap: misrap.acc_misrap,
          itnr_misrap: misrap.itnr_misrap,
          amort_misrap: misrap.amort_misrap,
          dep_misrap: misrap.dep_misrap,
          date_dep_misrap: misrap.date_dep_misrap,
          lieu_misrap: misrap.lieu_misrap,
          date_arr_misrap: misrap.date_arr_misrap,
          km_dep_misrap: misrap.km_dep_misrap,
          nuit_misrap: misrap.nuit_misrap,
          immob_misrap: misrap.immob_misrap,
          durr_misrap: misrap.durr_misrap,
          km_ret_misrap: misrap.km_ret_misrap,
          dist_misrap: misrap.dist_misrap,
          id_vehicule: misrap.id_vehicule,
          id_user: misrap.id_user,
              };
              

        // Update the mission
        const res = await fetch(`${backendUrl}/api/geop/missionReportManage/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(missionReportData),
        });

        if (!res.ok) {
            toast.warn("Can't update mission", {
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
            console.error("Error updating mission");
            return;
        }

        toast.success("Mission updated successfully", {
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

        navigate("/mission-report");
    } catch (error) {
        toast.warn("Can't update mission", {
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
    }
};


const createMission = async (mission: MissionReportInterface) => {
  try {
    let missionReportData = Object.fromEntries(
      Object.entries(mission).filter(([_, value]) => value !== null)
    );

    const dateFields = [
     
      'date_dep_misrap',
      'date_arr_misrap',
     

    ];

    missionReportData = Object.fromEntries(
      Object.entries(mission)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => {
          if (dateFields.includes(key)) {
            let date: Date;
            if (value instanceof Date) {
              date = value;
            } else if (typeof value === 'string' && value.includes('T')) {
              date = new Date(value);
            } else {
              return [key, value];
            }

            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            return [key, formattedDate];
          }
          return [key, value];
        })
    );

    console.log("Formatted Mission Report Data:", missionReportData);

    const res = await fetch(`${backendUrl}/api/geop/missionReportManage/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(missionReportData),
    });

    if (!res.ok) {
      const errorBody = await res.json(); // Get the response body
      console.error("Error response:", errorBody); // Log the error for more details
    
      toast.warn("Can't create ines Mission", {
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
    }

    toast.success("Mission Report created successfully", {
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
    navigate("/mission-report");
  } catch (error) {
    console.error("Can't create Mission Report", error);
    toast.warn("Can't create driver", {
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
};
const validateDates = (departure: string | null, arrival: string | null): boolean => {
  if (!departure || !arrival) return true; // Permettre si l'une des dates est vide
  
  const depDate = new Date(departure);
  const arrDate = new Date(arrival);
  
  return depDate <= arrDate;
};


  const getVehicleKm = async (id_vehicule: string | number) => {
        const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
        if (!res.ok) throw new Error("Erreur récupération km");
        return res.json();
    };


  // Utilisez l'interface ChangeEvent pour le gestionnaire d'événements
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);  // Appel de la fonction de changement générique
  };
  
  // Fonction générique de gestion des changements dans les formulaires
  const handleChange = (name: string, value: string) => {
    console.log("name: " + name);
    console.log("value: " + value);
    if (mission) {
      setMission({
        ...mission,
        [name]: String(value),
      });
    }
    console.log(mission);
  };
const formatToDatetimeLocal = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return '';
  }
};

const parseDatetimeLocal = (localString: string): string | null => {
  if (!localString) return null;
  try {
    const [datePart, timePart] = localString.split('T');
    return `${datePart}T${timePart || '00:00'}:00`;
  } catch {
    return null;
  }
};

// Gestionnaire d'événements avec typage
const handleDateTimeChange = (name: string, value: string) => {
  if (!mission) return;

  const isoValue = parseDatetimeLocal(value);
  
  const updatedMission: MissionReportInterface = {
    ...mission,
    [name]: isoValue
  };

  setMission(updatedMission);

  // Validation des dates
  if (updatedMission.date_dep_misrap && updatedMission.date_arr_misrap) {
    const isValid = validateDates(updatedMission.date_dep_misrap, updatedMission.date_arr_misrap);
    setDateError(isValid ? null : "La date de départ doit être antérieure ou égale à la date de retour");
  } else {
    setDateError(null);
  }
};
 
  return (
    <>
      <style>
        {`
          .form-group {
            margin-bottom: 1rem;
          }
          
          .form-group .form-control {
            width: 100%;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
          }
          
          .footer {
            margin-top: 1rem;
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-tasks"></i>
            {isEditing ? " Edit Mission Report" : " New Mission Report"}
          </h4>
        </div>

        <div className="col-md-12">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <PropagateLoader color={"#123abc"} loading={loading} size={20} />
            </div>
          ) : (
            <div className="container mt-4">
            <div className="row">
              <div className="col-md-6">
              <Form.Group className="form-group" controlId="formRefMisrap">
                <Form.Label>
                    <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> {translate("Mission Reference")} (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="ref_misrap"
                    value={mission?.ref_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group className="form-group" controlId="formObjtMisrap">
                <Form.Label>
                    <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> {translate("Mission Object")} (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="objt_misrap"
                    value={mission?.objt_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
                <Form.Group className="form-group" controlId="formFuelType">
                <Form.Label>
                    <i className="fas fa-tachometer-alt" style={{ color: 'orange' }}></i> {translate("Fuel Type")} (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="carb_misrap"
                    value={mission?.carb_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
               

                <Form.Group className="form-group" controlId="formExpenses">
                <Form.Label>
                    <i className="fas fa-money-bill" style={{ color: 'orange' }}></i> {translate("Expenses")} (*)
                </Form.Label>
                <Form.Control
                    type="number"
                    name="frais_misrap"
                    value={mission?.frais_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    onKeyDown={(e) => {
                      // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                  
                    required
                />
                </Form.Group>     

     <Form.Group controlId="id_vehicule">
        <Form.Label>
          <i className="fas fa-car" style={{ color: 'orange' }}></i> {translate("Vehicle")}{translate(" *")}
        </Form.Label>
        <Select
          options={vehicleOptions}
          placeholder={translate("Select Vehicle")}
          isLoading={vehicles.length === 0}
          noOptionsMessage={() => translate("No vehicles available")}
          isSearchable
          formatOptionLabel={(option) => (
            <div className="d-flex align-items-center justify-content-between gap-3">
              <span>{option.searchLabel}</span>
              {option.distanceKm !== null && option.isNearby && (
                <span className="text-muted small ms-auto">
                  {formatDistanceKm(option.distanceKm)}
                </span>
              )}
            </div>
          )}
          filterOption={(option, inputValue) =>
            option.data.searchLabel
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          }
          value={vehicleOptions.find(option => option.value === mission?.id_vehicule) || null}
          onChange={async (selectedOption) => {
            const id = selectedOption?.value ?? null;
            
            if (id) {
              try {
                const vehicleData = await getVehicleKm(id);
                const km = vehicleData.kilometrage_vehicule || null;
                
                setMission(prev => ({
                  ...(prev || initialMissionState),
                  id_vehicule: id,
                  km_dep_misrap: km
                }));
                
              } catch (error) {
                console.error("Erreur kilométrage", error);
                toast.error("Erreur kilométrage");
              }
            } else {
              setMission(prev => ({
                ...(prev || initialMissionState),
                id_vehicule: null,
                km_dep_misrap: null
              }));
            }
          }}
          onMenuClose={function (): void {}}
        />
        {departureLookupStatus === "loading" && (
          <div className="text-muted small mt-2">
            Recherche du lieu de depart...
          </div>
        )}
        {departureLookupStatus === "not-found" && (
          <div className="text-muted small mt-2">
            Lieu de depart introuvable. Tous les vehicules restent disponibles sans distance.
          </div>
        )}
        {departureCoordinates && nearbyVehicleCount > 0 && (
          <div className="text-muted small mt-2">
            {nearbyVehicleCount} vehicule(s) proche(s) dans un rayon de 20 km. Les autres restent disponibles sans distance.
          </div>
        )}
        {departureCoordinates && nearbyVehicleCount === 0 && (
          <div className="text-muted small mt-2">
            Aucun vehicule dans un rayon de 20 km. Les autres vehicules sont disponibles sans distance.
          </div>
        )}
      </Form.Group>
          
      <Form.Group className="form-group" controlId="formDriver">
      <Form.Label>
        <i className="fas fa-user" style={{ color: 'orange' }}></i> {translate("Driver")} (*)
      </Form.Label>
      <Form.Control
      as="select"
      name="cond_misrap"
      value={mission?.cond_misrap || ''}
      onChange={(e) => handleChange(e.target.name, e.target.value)}
      required
    >
      <option value="">{translate("Select Driver")}</option>
      {drivers.map((driver, index) => (
        <option key={index} value={String(driver.driver_mission)}>
          {driver.driver_mission}
        </option>
      ))}
    </Form.Control>
      </Form.Group>

        <Form.Group className="form-group" controlId="formAccomp">
        <Form.Label>
            <i className="fas fa-user-friends" style={{ color: 'orange' }}></i> {translate("Accompaniment")} (*)
        </Form.Label>
        <Form.Control
            type="text"
            name="acc_misrap"
            value={mission?.acc_misrap || ''}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
        />
        </Form.Group>

        <Form.Group className="form-group" controlId="formItinerary">
        <Form.Label>
            <i className="fas fa-route" style={{ color: 'orange' }}></i> {translate("Itinerary")} (*)
        </Form.Label>
        <Form.Control
            type="text"
            name="itnr_misrap"
            value={mission?.itnr_misrap || ''}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
        />
        </Form.Group>

            <Form.Group className="form-group" controlId="formTrailer">
              <Form.Label>
                <i className="fas fa-trailer" style={{ color: 'orange' }}></i> {translate("Trailer")} (*)
              </Form.Label>

              <Form.Control
                as="select"
                name="remorque_misrap"
                value={mission?.remorque_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
                disabled={trailers.length === 0} // <-- désactive si vide
              >
                <option value="">
                  {trailers.length === 0 ? 'Aucune remorque disponible' : 'Select Trailer'}
                </option>
                {trailers.map((trailer, index) => (
                  <option key={index} value={trailer.trailer_mission}>
                    {trailer.trailer_mission}
                  </option>
                ))}
              </Form.Control>

  {trailers.length === 0 && (
    <div style={{ color: 'red', marginTop: '5px' }}>
      ⚠️ {translate("Aucune remorque disponible.")}
    </div>
  )}
</Form.Group>

                </div>
                <div className="col-md-6">
                <Form.Group className="form-group" controlId="formDepLoc">
                <Form.Label>
                    <i className="fas fa-map-marker-alt" style={{ color: 'orange' }}></i> {translate("Departure Location")} (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="lieu_misrap"
                    value={mission?.lieu_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
<Form.Group className="form-group" controlId="formDepDate">
  <Form.Label>
    <i className="fas fa-calendar" style={{ color: 'orange' }}></i> {translate("Departure Date/Time")} (*)
  </Form.Label>
  <Form.Control
    type="datetime-local"
    name="date_dep_misrap"
    value={formatToDatetimeLocal(mission?.date_dep_misrap)}
    onChange={(e) => handleDateTimeChange('date_dep_misrap', e.target.value)}
    required
    isInvalid={!!dateError}
  />
</Form.Group>

<Form.Group className="form-group" controlId="formArrivalDate">
  <Form.Label>
    <i className="fas fa-calendar-alt" style={{ color: 'orange' }}></i> {translate("Arrival Date/Time")} (*)
  </Form.Label>
  <Form.Control
    type="datetime-local"
    name="date_arr_misrap"
    value={formatToDatetimeLocal(mission?.date_arr_misrap)}
    onChange={(e) => handleDateTimeChange('date_arr_misrap', e.target.value)}
    required
    isInvalid={!!dateError}
  />
  {dateError && (
    <Form.Control.Feedback type="invalid">
      {dateError}
    </Form.Control.Feedback>
  )}
</Form.Group>

                <Form.Group className="form-group" controlId="formDepDest">
                <Form.Label>
                    <i className="fas fa-map" style={{ color: 'orange' }}></i> {translate("Mission Location")} (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="dep_misrap"
                    value={mission?.dep_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
              
                <Form.Group className="form-group" controlId="formNumberOfNights">
                  <Form.Label>
                    <i className="fas fa-bed" style={{ color: 'orange' }}></i> {translate("Number of Nights")} (*)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="nuit_misrap"
                    value={mission?.nuit_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    onKeyDown={(e) => {
                      // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                    required
                  />
              </Form.Group>


              <Form.Group className="form-group" controlId="formImmobilizationDays">
              <Form.Label>
                <i className="fas fa-calendar-day" style={{ color: 'orange' }}></i> {translate("Immobilization (Days)")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="immob_misrap"
                value={mission?.immob_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onKeyDown={(e) => {
                  // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  if (
                    !/[0-9]/.test(e.key) &&
                    !allowedKeys.includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                min="0"
                required
              />
            </Form.Group>
            <Form.Group className="form-group" controlId="formDuration">
              <Form.Label>
                <i className="fas fa-clock" style={{ color: 'orange' }}></i> {translate("Duration (Days)")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="durr_misrap"
                value={mission?.durr_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onKeyDown={(e) => {
                  // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  if (
                    !/[0-9]/.test(e.key) &&
                    !allowedKeys.includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formReturnMileage">
              <Form.Label>
                <i className="fas fa-road" style={{ color: 'orange' }}></i> {translate("Return Km (km)")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="km_ret_misrap"
                value={mission?.km_ret_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onKeyDown={(e) => {
                  // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  if (
                    !/[0-9]/.test(e.key) &&
                    !allowedKeys.includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formDistance">
              <Form.Label>
                <i className="fas fa-random" style={{ color: 'orange' }}></i> {translate("Distance (km)")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="dist_misrap"
                value={mission?.dist_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onKeyDown={(e) => {
                  // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                  if (
                    !/[0-9]/.test(e.key) &&
                    !allowedKeys.includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                min="0"
                required
              />
            </Form.Group>

             <Form.Group className="form-group" controlId="formAmortizationPeriod">
                  <Form.Label>
                    <i className="fas fa-calendar" style={{ color: 'orange' }}></i> {translate("Amortization Period")} (*)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amort_misrap"
                    value={mission?.amort_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    onKeyDown={(e) => {
                      // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                      const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                    required
                  />
                </Form.Group>

                </div>
            </div>
          </div>
        
          
          )}
        </div>

        <div className="col-md-12 footer">
          <button
            onClick={() => {
              cancelClicked();
            }}
            type="button"
            className="btn btn-default"
          >
            {translate("Cancel")}
          </button>
          <Button
  variant="primary"
  type="submit"
  onClick={() => {
    setButtonClicked(true);
    console.log(mission);  // Log mission to check its current state
    if (mission) {
      isEditing
        ? updateMission(mission)  // If editing, call updateMission
        : createMission(mission);  // If creating, call createMission
    }
  }}
  disabled={buttonClicked}
>
  {isEditing ? <i className="fas fa-edit"></i> : <i className="fas fa-plus"></i>}
  {isEditing ? translate("Update") : translate("Add")}
</Button>


        </div>
      </div>
    </>
  );
}

