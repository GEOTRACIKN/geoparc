import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { MissionOrder } from "./MissionOrder";
import Select, { SingleValue } from "react-select";
import { useAuth } from "../context/AuthContext";

interface Vehicle {
  id_vehicule: number;
  immatriculation_vehicule: string;
  LAT?: string | number | null;
  LON?: string | number | null;
  lat?: string | number | null;
  lon?: string | number | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  latitude_vehicule?: string | number | null;
  longitude_vehicule?: string | number | null;
}
interface VehiclePosition {
  id_vehicule: number;
  LAT?: string | number | null;
  LON?: string | number | null;
  lat?: string | number | null;
  lon?: string | number | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
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
interface Trailer {
  id_remorque?: number;       // Ajoutez si disponible
  trailer_mission: string;   // Modifiez pour correspondre au champ retourné par l'API
}

interface MissionOrderInterface {
  id_mission?: number | null;
  ref_mission: string | null; // Changé de number à string
  object_mission: string | null;
  fuel_loading_mission: number | null;
  fuel_type_mission: string | null; // Changé de number à string
  expenses_mission: number | null;
  tank_mission: number | null;
  trailer_mission: string | null;
  driver_mission: string | null;
  accomp_mission: string | null;
  dep_loc_mission: string | null;
  dep_date_mission: string | null; // Changé de number à string
  dep_dest_mission: string | null;
  return_date_mission: string | null; // Changé de number à string
  itinerary_mission: string | null;
  vehicle_km_mission: number | null;
  new_km_mission: number | null;
  fuel_cost_mission: number | null;
  fuel_level_mission: number | null;
  voucher_mission: number | null;
  id_vehicule: number | null;
  id_user: string | null;
}
const backendUrl = process.env.REACT_APP_BACKEND_URL;
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

const readCoordinate = (...values: Array<string | number | null | undefined>) => {
  for (const value of values) {
    const coordinate = Number(value);
    if (Number.isFinite(coordinate)) {
      return coordinate;
    }
  }

  return null;
};


export function MissionOrderManage() {
  const { id_mission } = useParams<{ id_mission?: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id_mission);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const { user, loading: authLoading } = useAuth();
  const id_user =
    user?.id_user !== undefined && user?.id_user !== null
      ? String(user.id_user)
      : localStorage.getItem("GeopUserID") ?? localStorage.getItem("userid");

  useEffect(() => {
    if (searchParams.get("mailDecision") !== "approved") {
      return;
    }

    toast.success(
      searchParams.get("already_decided") === "1"
        ? "Cette demande a deja ete approuvee"
        : "Demande approuvee et mission creee",
      {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      }
    );

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [searchParams]);




  const [mission, setMission] = useState<MissionOrderInterface | null>({
    id_mission: isEditing && id_mission ? Number(id_mission) : null,
    ref_mission: null,
    object_mission: null,
    fuel_loading_mission: null,
    fuel_type_mission: null,
    expenses_mission: null,
    tank_mission: null,
    trailer_mission: "0",
    driver_mission: null,
    accomp_mission: null,
    dep_loc_mission: null,
    dep_date_mission: null,
    dep_dest_mission: null,
    return_date_mission: null,
    itinerary_mission: null,
    vehicle_km_mission: null,
    new_km_mission: null,
    fuel_cost_mission: null,
    fuel_level_mission: null,
    voucher_mission: null,
    id_vehicule: null,
    id_user: isEditing ? null : id_user,
  });
  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (isEditing || !id_user) {
      return;
    }

    setMission((prev) => prev && prev.id_user !== id_user ? {
      ...prev,
      id_user,
    } : prev);
  }, [id_user, isEditing]);


  const cancelClicked = () => {
    navigate("/mission-order");
  };


  const [trailer, setTrailer] = useState<{ trailer_mission: string }[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([]);
  const [departureCoordinates, setDepartureCoordinates] = useState<LocationCoordinates | null>(null);
  const [departureLookupStatus, setDepartureLookupStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
  const [driver, setDriver] = useState<{ driver_mission: string }[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);


  useEffect(() => {
    if (!id_user && authLoading) {
      setLoading(true);
      setError(null);
      return;
    }

    const getMissionOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id_user) {
          setError("Missing user ID");
          return;
        }

        // Récupération parallèle des données
        const responses = await Promise.all([
          isEditing && id_mission
            ? fetch(`${backendUrl}/api/geop/missionOrderManage/find/${id_mission}`)
            : Promise.resolve(null),
          fetch(`${backendUrl}/api/geop/vehicule/${id_user}`),
          fetch(`${backendUrl}/api/map/find/${id_user}`).catch(() => null),
          fetch(`${backendUrl}/api/geop/driver/${id_user}`),
          fetch(`${backendUrl}/api/geop/trailer/${id_user}`)
        ]);

        // Traitement des réponses
        const [missionRes, vehiclesRes, vehiclePositionsRes, driverRes, trailerRes] = responses;

        // Véhicules - s'assurer que c'est un tableau
        const vehiclesData = vehiclesRes?.ok
          ? await vehiclesRes.json()
          : [];
        setVehicles(vehiclesData.vehicles || []);
        const vehiclePositionsData: VehiclePosition[] | VehiclePositionResponse =
          vehiclePositionsRes && vehiclePositionsRes.ok
            ? await vehiclePositionsRes.json()
            : [];
        setVehiclePositions(
          Array.isArray(vehiclePositionsData)
            ? vehiclePositionsData
            : vehiclePositionsData.value || []
        );
        // Mission (si édition)
        if (isEditing && missionRes?.ok) {
          const missionData: MissionOrderInterface = await missionRes.json();
          setMission(missionData);
        }

        // Chauffeurs - s'assurer que c'est un tableau
        const driverData = driverRes?.ok
          ? await driverRes.json()
          : [];
        setDriver(Array.isArray(driverData) ? driverData : []);

        // Remorques - s'assurer que c'est un tableau
        const trailerData = trailerRes?.ok
          ? await trailerRes.json()
          : [];
        setTrailer(Array.isArray(trailerData) ? trailerData : []);

      } catch (error) {
        console.error("Erreur récupération données", error);
        setError("Erreur récupération données");
        toast.error("Failed to load data", {
          position: "bottom-right",
          autoClose: 3000,
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    };

    getMissionOrder();
  }, [authLoading, id_mission, id_user, isEditing]);

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
    const departureLocation = mission?.dep_loc_mission?.trim();

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
  }, [geocodeDepartureLocation, mission?.dep_loc_mission]);

  const vehicleOptions = useMemo<VehicleOption[]>(() => {
    const positionByVehicleId = new Map<number, VehiclePosition>();

    vehiclePositions.forEach((position) => {
      positionByVehicleId.set(Number(position.id_vehicule), position);
    });

    return vehicles
      .map((vehicle) => {
        const lastPosition = positionByVehicleId.get(Number(vehicle.id_vehicule));
        const latitude = readCoordinate(
          lastPosition?.LAT,
          lastPosition?.lat,
          lastPosition?.latitude,
          vehicle.LAT,
          vehicle.lat,
          vehicle.latitude,
          vehicle.latitude_vehicule
        );
        const longitude = readCoordinate(
          lastPosition?.LON,
          lastPosition?.lon,
          lastPosition?.longitude,
          vehicle.LON,
          vehicle.lon,
          vehicle.longitude,
          vehicle.longitude_vehicule
        );
        const registration = vehicle.immatriculation_vehicule || "";

        const canCalculateDistance =
          departureCoordinates &&
          latitude !== null &&
          longitude !== null;

        const calculatedDistanceKm = canCalculateDistance
          ? getDistanceKm(
              departureCoordinates.latitude,
              departureCoordinates.longitude,
              latitude,
              longitude
            )
          : null;
        const isNearby =
          calculatedDistanceKm !== null &&
          calculatedDistanceKm <= MAX_DEPARTURE_DISTANCE_KM;

        return {
          value: vehicle.id_vehicule,
          label: registration,
          searchLabel: registration,
          distanceKm: isNearby ? calculatedDistanceKm : null,
          isNearby,
        };
      })
      .sort((first, second) => {
        if (first.isNearby !== second.isNearby) {
          return first.isNearby ? -1 : 1;
        }

        if (first.distanceKm !== null && second.distanceKm !== null) {
          return first.distanceKm - second.distanceKm;
        }

        if (first.distanceKm !== null) return -1;
        if (second.distanceKm !== null) return 1;

        return first.searchLabel.localeCompare(second.searchLabel);
      });
  }, [departureCoordinates, vehiclePositions, vehicles]);

  const nearbyVehicleCount = useMemo(
    () => vehicleOptions.filter((option) => option.isNearby).length,
    [vehicleOptions]
  );

  useEffect(() => {
    if (
      departureLookupStatus !== "found" ||
      !mission?.id_vehicule ||
      vehicles.some((vehicle) => vehicle.id_vehicule === mission.id_vehicule)
    ) {
      return;
    }

    setMission((prev) => prev ? {
      ...prev,
      id_vehicule: null,
      vehicle_km_mission: null,
    } : prev);
  }, [departureLookupStatus, mission?.id_vehicule, vehicleOptions]);

  const fetchVehicleKm = async (id_vehicule: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
      if (!res.ok) throw new Error("Failed to get vehicle KM");
      const data = await res.json();
      return data.kilometrage_vehicule || 0;
    } catch (error) {
      console.error("Error fetching vehicle KM:", error);
      toast.error("Error fetching vehicle mileage", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      return 0;
    }
  };


  const updateMission = async (mission: MissionOrderInterface) => {
    try {
      // Vérifier que l'ID mission et l'ID utilisateur sont présents
      if (!mission.id_mission || !id_user) {
        toast.error("Mission ID or User ID is missing");
        return;
      }

      // Préparer les données avec l'ID utilisateur
      const missionOrderData = {
        id_mission: mission.id_mission,
        id_user: id_user, // Ajout crucial de l'ID utilisateur
        ref_mission: mission.ref_mission,
        object_mission: mission.object_mission,
        fuel_loading_mission: mission.fuel_loading_mission,
        fuel_type_mission: mission.fuel_type_mission,
        expenses_mission: mission.expenses_mission,
        tank_mission: mission.tank_mission,
        trailer_mission: mission.trailer_mission,
        driver_mission: mission.driver_mission,
        accomp_mission: mission.accomp_mission,
        dep_loc_mission: mission.dep_loc_mission,
        dep_date_mission: mission.dep_date_mission,
        dep_dest_mission: mission.dep_dest_mission,
        return_date_mission: mission.return_date_mission,
        itinerary_mission: mission.itinerary_mission,
        vehicle_km_mission: mission.vehicle_km_mission,
        new_km_mission: mission.new_km_mission,
        fuel_cost_mission: mission.fuel_cost_mission,
        fuel_level_mission: mission.fuel_level_mission,
        voucher_mission: mission.voucher_mission,
        id_vehicule: mission.id_vehicule,
      };

      // Envoyer la requête
      const response = await fetch(`${backendUrl}/api/geop/missionOrderManage/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionOrderData),
      });

      // Gérer la réponse
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Échec de la mise à jour");
      }

      toast.success("Mission mise à jour avec succès", {
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

      navigate("/mission-order");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Erreur lors de la mise à jour", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

  const createMission = async (mission: MissionOrderInterface) => {
    try {
      let missionOrderData = Object.fromEntries(
        Object.entries(mission).filter(([_, value]) => value !== null)
      );

      const dateFields = ['dep_date_mission', 'return_date_mission'];

      missionOrderData = Object.fromEntries(
        Object.entries(missionOrderData)
          .map(([key, value]) => {
            // Only process date fields
            if (dateFields.includes(key)) {
              let date: Date;

              // If the value is already a Date object, use it
              if (value instanceof Date) {
                date = value;
              }
              // If the value is a string and contains 'T' (ISO format), parse it into a Date object
              else if (typeof value === 'string' && value.includes('T')) {
                date = new Date(value);
              }
              else {
                return [key, value]; // Return original if it’s not a valid date string
              }

              // Format the date to 'YYYY-MM-DD HH:mm:ss'
              const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
              return [key, formattedDate];
            }

            // If the field is not a date field, return the original value
            return [key, value];
          })
      );

      console.log("Formatted Mission Order Data:", missionOrderData);

      const res = await fetch(`${backendUrl}/api/geop/missionOrderManage/create`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(missionOrderData),
      });

      if (!res.ok) {
        const errorBody = await res.json(); // Get the response body
        console.error("Error response:", errorBody); // Log the error for more details

        toast.warn("Can't create Mission", {
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

      toast.success("Mission Order created successfully", {
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
      navigate("/mission-order");
    } catch (error) {
      console.error("Can't create Mission Order", error);
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
  const getVehicleKm = async (id_vehicule: string | number) => {
    const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
    if (!res.ok) throw new Error("Erreur récupération km");
    return res.json();
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);  // Appel de la fonction de changement générique
  };



  const handleVehicleSelectChange = async (selectedOption: SingleValue<VehicleOption>) => {
    const id = selectedOption?.value ?? null;

    if (!id) {
      setMission((prev) => prev ? {
        ...prev,
        id_vehicule: null,
        vehicle_km_mission: null,
      } : prev);
      return;
    }

    const km = await fetchVehicleKm(id);

    setMission((prev) => prev ? {
      ...prev,
      id_vehicule: id,
      vehicle_km_mission: km,
    } : prev);
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

  const validateDates = (departure: string | null, arrival: string | null): boolean => {
    if (!departure || !arrival) return true; // Permettre si l'une des dates est vide

    const depDate = new Date(departure);
    const arrDate = new Date(arrival);

    return depDate <= arrDate;
  };

  const handleDateTimeChange = (name: string, value: string) => {
    if (!mission) return;

    const isoValue = parseDatetimeLocal(value);

    const updatedMission: MissionOrderInterface = {
      ...mission,
      [name]: isoValue
    };

    setMission(updatedMission);

    // Validation des dates
    if (updatedMission.dep_date_mission && updatedMission.return_date_mission) {
      const isValid = validateDates(updatedMission.dep_date_mission, updatedMission.return_date_mission);
      setDateError(isValid ? null : "La date de départ doit être antérieure ou égale à la date de retour");
    } else {
      setDateError(null);
    }
  };

  // Fonction générique de gestion des changements dans les formulaires
  const handleChange = (name: string, value: string) => {
    if (mission) {
      const updatedMission = {
        ...mission,
        [name]: value,
      };

      setMission(updatedMission);

      // Valider les dates après la mise à jour

    }
  };


  const [activeTab, setActiveTab] = useState<"general" | "assignment" | "fuel">("general");

  return (
    <>
      <div className="page-content">
        <div className="mission-form-page">
          <div className="mission-form-shell">
            <div className="mission-form-header">
              <div>
                <h2 className="mission-form-title">
                  <i className="las la-clipboard-list me-2" />
                  {isEditing
                    ? translate("Mission Order")
                    : translate("New Mission Order")}
                </h2>
                <p className="mission-form-subtitle">
                  {translate("Fill in the mission order information")}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="mission-loading-state">
                <div className="spinner-border text-primary mb-3" />
                <div>{translate("Loading...")}</div>
              </div>
            ) : error ? (
              <div className="mission-error-state">
                <i className="las la-exclamation-triangle me-2" />
                {error}
              </div>
            ) : (
              <div className="mission-tabs-wrapper">
                <ul className="nav nav-pills mission-tabs mb-4">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                      onClick={() => setActiveTab("general")}
                    >
                      <i className="las la-file-alt me-2" />
                      {translate("General Information")}
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === "assignment" ? "active" : ""}`}
                      onClick={() => setActiveTab("assignment")}
                    >
                      <i className="las la-truck me-2" />
                      {translate("Assignment")}
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === "fuel" ? "active" : ""}`}
                      onClick={() => setActiveTab("fuel")}
                    >
                      <i className="las la-gas-pump me-2" />
                      {translate("Fuel")} & {translate("Technical Details")}
                    </button>
                  </li>
                </ul>

                {activeTab === "general" && (
                  <div className="mission-form-section">
                    <div className="row g-3">
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Reference")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="ref_mission"
                          value={mission?.ref_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Departure Date")} (*)</label>
                        <input
                          type="datetime-local"
                          className="form-control mission-input"
                          name="dep_date_mission"
                          value={formatToDatetimeLocal(mission?.dep_date_mission)}
                          onChange={(e) => handleDateTimeChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Mission Object")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="object_mission"
                          value={mission?.object_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Destination")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="dep_dest_mission"
                          value={mission?.dep_dest_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Departure Location")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="dep_loc_mission"
                          value={mission?.dep_loc_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Return Date")} (*)</label>
                        <input
                          type="datetime-local"
                          className="form-control mission-input"
                          name="return_date_mission"
                          value={formatToDatetimeLocal(mission?.return_date_mission)}
                          onChange={(e) => handleDateTimeChange(e.target.name, e.target.value)}
                        />
                        {dateError && (
                          <div className="mission-error-text mt-2">{dateError}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="mission-label">{translate("Itinerary")}</label>
                        <textarea
                          className="form-control mission-input mission-textarea"
                          name="itinerary_mission"
                          value={mission?.itinerary_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "assignment" && (
                  <div className="mission-form-section">
                    <div className="row g-3">
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Vehicle")} *</label>
                        <Select
                          options={vehicleOptions}
                          placeholder={translate("Select Vehicle")}
                          isSearchable
                          isLoading={departureLookupStatus === "loading"}
                          noOptionsMessage={() => {
                            return translate("No vehicles available");
                          }}
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
                          onChange={handleVehicleSelectChange}
                        />
                        {departureLookupStatus === "loading" && (
                          <div className="mission-muted-text mt-2">
                            Recherche du lieu de depart...
                          </div>
                        )}
                        {departureLookupStatus === "not-found" && (
                          <div className="mission-muted-text mt-2">
                            Lieu de depart introuvable. Tous les vehicules restent disponibles sans distance.
                          </div>
                        )}
                        {departureCoordinates && nearbyVehicleCount > 0 && (
                          <div className="mission-muted-text mt-2">
                            {nearbyVehicleCount} vehicule(s) proche(s) dans un rayon de {MAX_DEPARTURE_DISTANCE_KM} km. Les autres restent disponibles sans distance.
                          </div>
                        )}
                        {departureCoordinates && nearbyVehicleCount === 0 && (
                          <div className="mission-muted-text mt-2">
                            Aucun vehicule dans un rayon de {MAX_DEPARTURE_DISTANCE_KM} km. Les autres vehicules sont disponibles sans distance.
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Vehicle KM")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input mission-input-disabled"
                          name="vehicle_km_mission"
                          value={mission?.vehicle_km_mission || ""}
                          disabled
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Trailer")} (*)</label>
                        <select
                          name="trailer_mission"
                          className="form-select mission-input"
                          value={mission?.trailer_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        >
                          <option value="0">{translate("Select Vehicle")}</option>
                          {trailer?.map((item: any, index: number) => (
                            <option key={index} value={item.trailer_mission}>
                              {item.trailer_mission}
                            </option>
                          ))}
                        </select>

                        {!trailer?.length && (
                          <div className="mission-warning-text mt-2">
                            {translate("Aucune remorque disponible.")}
                          </div>
                        )}
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Driver")} (*)</label>
                        <select
                          name="driver_mission"
                          className="form-select mission-input"
                          value={mission?.driver_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        >
                          <option value="">{translate("Select Driver")}</option>
                          {driver?.map((item: any, index: number) => (
                            <option key={index} value={item.driver_mission}>
                              {item.driver_mission}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="mission-label">{translate("Accompaniment")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="accomp_mission"
                          value={mission?.accomp_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "fuel" && (
                  <div className="mission-form-section">
                    <div className="row g-3">
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Fuel Loading")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="fuel_loading_mission"
                          value={mission?.fuel_loading_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Fuel Type")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="fuel_type_mission"
                          value={mission?.fuel_type_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Expenses")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="expenses_mission"
                          value={mission?.expenses_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Tank")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="tank_mission"
                          value={mission?.tank_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Fuel Cost")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="fuel_cost_mission"
                          value={mission?.fuel_cost_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Fuel Level")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="fuel_level_mission"
                          value={mission?.fuel_level_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Voucher")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="voucher_mission"
                          value={mission?.voucher_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="mission-label">{translate("New KM")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="new_km_mission"
                          value={mission?.new_km_mission || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              
              </div>
              
            )}
          </div>
          <div className="mission-form-footer">
  <button
    type="button"
    className="btn btn-light mission-cancel-btn"
    onClick={() => {
      cancelClicked();
    }}
  >
    {translate("Cancel")}
  </button>

  <Button
    variant="primary"
    type="button"
    className="mission-submit-btn"
    onClick={() => {
      setButtonClicked(true);
      if (mission) {
        isEditing ? updateMission(mission) : createMission(mission);
      }
    }}
    disabled={buttonClicked}
  >
    {isEditing ? (
      <i className="fas fa-edit me-2"></i>
    ) : (
      <i className="fas fa-plus me-2"></i>
    )}
    {isEditing ? translate("Update") : translate("Add")}
  </Button>
</div>
        </div>
      </div>
    </>
  );
}

