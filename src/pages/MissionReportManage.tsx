import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../hooks/LanguageProvider";

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

interface Driver {
  id_conducteur: number;
  driver_mission: string;
}

interface Trailer {
  id_remorque?: number;
  trailer_mission: string;
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
const MAX_DEPARTURE_DISTANCE_KM = 20;

const getDistanceKm = (fromLat: number, fromLon: number, toLat: number, toLon: number) => {
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
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
};

const parseDatetimeLocal = (localString: string): string | null => {
  if (!localString) return null;
  const [datePart, timePart] = localString.split("T");
  return `${datePart}T${timePart || "00:00"}:00`;
};

const formatToDatetimeLocal = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toNumberOrNull = (value: string) => (value === "" ? null : Number(value));

export function MissionReportManage() {
  const { id_misrap } = useParams<{ id_misrap?: string }>();
  const isEditing = Boolean(id_misrap);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");

  const initialMissionState: MissionReportInterface = {
    id_misrap: isEditing && id_misrap ? Number(id_misrap) : null,
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
    id_user,
  };

  const [mission, setMission] = useState<MissionReportInterface>(initialMissionState);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([]);
  const [departureCoordinates, setDepartureCoordinates] = useState<LocationCoordinates | null>(null);
  const [departureLookupStatus, setDepartureLookupStatus] = useState<"idle" | "loading" | "found" | "not-found">("idle");
  const [activeTab, setActiveTab] = useState<"general" | "assignment" | "technical">("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const geocodeDepartureLocation = useCallback(async (location: string) => {
    const urls = [
      `https://geotrackin.xyz/nominatim/search.php?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        const data = await response.json();
        const firstResult = Array.isArray(data) ? data[0] : null;
        const latitude = Number(firstResult?.lat);
        const longitude = Number(firstResult?.lon);
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          return { latitude, longitude };
        }
      } catch (geocodeError) {
        console.warn("Geocoding provider failed:", geocodeError);
      }
    }

    return null;
  }, []);

  useEffect(() => {
    const loadMissionReport = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id_user) throw new Error("User ID is required");

        const [vehiclesRes, vehiclePositionsRes, driversRes, trailersRes, reportRes] = await Promise.all([
          fetch(`${backendUrl}/api/geop/vehicule/${id_user}`),
          fetch(`${backendUrl}/api/map/find/${id_user}`).catch(() => null),
          fetch(`${backendUrl}/api/geop/driver/${id_user}`),
          fetch(`${backendUrl}/api/geop/trailer/${id_user}`),
          isEditing && id_misrap
            ? fetch(`${backendUrl}/api/geop/missionReportManage/find/${id_misrap}`)
            : Promise.resolve(null),
        ]);

        if (!vehiclesRes.ok) throw new Error("Failed to load vehicles");
        if (!driversRes.ok) throw new Error("Failed to load drivers");
        if (!trailersRes.ok) throw new Error("Failed to load trailers");

        const [vehiclesData, vehiclePositionsData, driversData, trailersData] = await Promise.all([
          vehiclesRes.json(),
          vehiclePositionsRes && vehiclePositionsRes.ok ? vehiclePositionsRes.json() : Promise.resolve([]),
          driversRes.json(),
          trailersRes.json(),
        ]);

        const parsedPositions: VehiclePosition[] | VehiclePositionResponse = vehiclePositionsData;
        setVehicles(vehiclesData.vehicles || []);
        setVehiclePositions(Array.isArray(parsedPositions) ? parsedPositions : parsedPositions.value || []);
        setDrivers(Array.isArray(driversData) ? driversData : []);
        setTrailers(Array.isArray(trailersData) ? trailersData : []);

        if (isEditing && reportRes?.ok) {
          const reportData = await reportRes.json();
          setMission({
            ...initialMissionState,
            ...reportData,
            id_misrap: Number(id_misrap),
            id_user: reportData.id_user || id_user,
          });
        }
      } catch (loadError) {
        console.error("Data loading error:", loadError);
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadMissionReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_misrap, id_user, isEditing]);

  useEffect(() => {
    const departureLocation = mission.lieu_misrap?.trim();

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
        .catch((geocodeError) => {
          if (!isCurrent) return;
          console.error("Erreur geocodage lieu de depart:", geocodeError);
          setDepartureCoordinates(null);
          setDepartureLookupStatus("not-found");
        });
    }, 500);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [geocodeDepartureLocation, mission.lieu_misrap]);

  const vehicleOptions = useMemo<VehicleOption[]>(() => {
    const positionByVehicleId = new Map<number, VehiclePosition>();
    vehiclePositions.forEach((position) => {
      positionByVehicleId.set(Number(position.id_vehicule), position);
    });

    return vehicles
      .map((vehicle) => {
        const lastPosition = positionByVehicleId.get(Number(vehicle.id_vehicule));
        const lat = Number(lastPosition?.LAT ?? vehicle.LAT ?? vehicle.latitude_vehicule);
        const lon = Number(lastPosition?.LON ?? vehicle.LON ?? vehicle.longitude_vehicule);
        const hasVehiclePosition = Number.isFinite(lat) && Number.isFinite(lon);
        const distanceKm =
          departureCoordinates && hasVehiclePosition
            ? getDistanceKm(departureCoordinates.latitude, departureCoordinates.longitude, lat, lon)
            : null;
        const isNearby = distanceKm !== null && distanceKm <= MAX_DEPARTURE_DISTANCE_KM;
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
        if (first.isNearby !== second.isNearby) return first.isNearby ? -1 : 1;
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

  const handleChange = (name: string, value: string) => {
    setMission((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setMission((prev) => ({
      ...prev,
      [name]: toNumberOrNull(value),
    }));
  };

  const validateDates = (departure: string | null, arrival: string | null) => {
    if (!departure || !arrival) return true;
    return new Date(departure) <= new Date(arrival);
  };

  const handleDateTimeChange = (name: string, value: string) => {
    const isoValue = parseDatetimeLocal(value);
    const updatedMission = {
      ...mission,
      [name]: isoValue,
    };

    setMission(updatedMission);

    if (updatedMission.date_dep_misrap && updatedMission.date_arr_misrap) {
      const isValid = validateDates(updatedMission.date_dep_misrap, updatedMission.date_arr_misrap);
      setDateError(isValid ? null : "La date de depart doit etre anterieure ou egale a la date de retour");
    } else {
      setDateError(null);
    }
  };

  const getVehicleKm = async (id_vehicule: string | number) => {
    const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
    if (!res.ok) throw new Error("Erreur recuperation km");
    return res.json();
  };

  const handleVehicleSelectChange = async (selectedOption: VehicleOption | null) => {
    const id = selectedOption?.value ?? null;

    if (!id) {
      setMission((prev) => ({
        ...prev,
        id_vehicule: null,
        km_dep_misrap: null,
      }));
      return;
    }

    try {
      const vehicleData = await getVehicleKm(id);
      setMission((prev) => ({
        ...prev,
        id_vehicule: id,
        km_dep_misrap: vehicleData.kilometrage_vehicule || null,
      }));
    } catch (vehicleError) {
      console.error("Erreur kilometrage", vehicleError);
      toast.error("Erreur kilometrage");
    }
  };

  const toRequestData = (nextMission: MissionReportInterface) =>
    Object.fromEntries(
      Object.entries(nextMission)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if ((key === "date_dep_misrap" || key === "date_arr_misrap") && typeof value === "string") {
            return [key, value.replace("T", " ")];
          }
          return [key, value];
        })
    );

  const saveMission = async () => {
    try {
      setButtonClicked(true);

      if (dateError) {
        toast.warn(dateError, { position: "bottom-right", autoClose: 2400, transition: Bounce });
        setButtonClicked(false);
        return;
      }

      const res = await fetch(
        `${backendUrl}/api/geop/missionReportManage/${isEditing ? "update" : "create"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify(toRequestData(mission)),
        }
      );

      if (!res.ok) {
        toast.warn(isEditing ? "Can't update mission" : "Can't create Mission Report", {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        setButtonClicked(false);
        return;
      }

      toast.success(isEditing ? "Mission updated successfully" : "Mission Report created successfully", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      navigate("/mission-report");
    } catch (saveError) {
      console.error("Mission report save error:", saveError);
      toast.warn(isEditing ? "Can't update mission" : "Can't create Mission Report", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      setButtonClicked(false);
    }
  };

  return (
    <>
      <div className="page-content">
        <div className="mission-form-page">
          <div className="mission-form-shell">
            <div className="mission-form-header">
              <div>
                <h2 className="mission-form-title">
                  <i className="las la-tasks me-2" />
                  {isEditing ? translate("Mission Report") : translate("New Mission Report")}
                </h2>
                <p className="mission-form-subtitle">
                  {translate("Fill in the mission report information")}
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
                      className={`nav-link ${activeTab === "technical" ? "active" : ""}`}
                      onClick={() => setActiveTab("technical")}
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
                          name="ref_misrap"
                          value={mission.ref_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Departure Date")} (*)</label>
                        <input
                          type="datetime-local"
                          className="form-control mission-input"
                          name="date_dep_misrap"
                          value={formatToDatetimeLocal(mission.date_dep_misrap)}
                          onChange={(e) => handleDateTimeChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Mission Object")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="objt_misrap"
                          value={mission.objt_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Mission Location")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="dep_misrap"
                          value={mission.dep_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Departure Location")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="lieu_misrap"
                          value={mission.lieu_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Arrival Date/Time")} (*)</label>
                        <input
                          type="datetime-local"
                          className="form-control mission-input"
                          name="date_arr_misrap"
                          value={formatToDatetimeLocal(mission.date_arr_misrap)}
                          onChange={(e) => handleDateTimeChange(e.target.name, e.target.value)}
                        />
                        {dateError && <div className="mission-error-text mt-2">{dateError}</div>}
                      </div>
                      <div className="col-12">
                        <label className="mission-label">{translate("Itinerary")}</label>
                        <textarea
                          className="form-control mission-input mission-textarea"
                          name="itnr_misrap"
                          value={mission.itnr_misrap || ""}
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
                          noOptionsMessage={() => translate("No vehicles available")}
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
                            option.data.searchLabel.toLowerCase().includes(inputValue.toLowerCase())
                          }
                          value={vehicleOptions.find((option) => option.value === mission.id_vehicule) || null}
                          onChange={handleVehicleSelectChange}
                        />
                        {departureLookupStatus === "loading" && (
                          <div className="mission-muted-text mt-2">Recherche du lieu de depart...</div>
                        )}
                        {departureLookupStatus === "not-found" && (
                          <div className="mission-muted-text mt-2">
                            Lieu de depart introuvable. Tous les vehicules restent disponibles sans distance.
                          </div>
                        )}
                        {departureCoordinates && nearbyVehicleCount > 0 && (
                          <div className="mission-muted-text mt-2">
                            {nearbyVehicleCount} vehicule(s) proche(s) dans un rayon de 20 km. Les autres restent disponibles sans distance.
                          </div>
                        )}
                        {departureCoordinates && nearbyVehicleCount === 0 && (
                          <div className="mission-muted-text mt-2">
                            Aucun vehicule dans un rayon de 20 km. Les autres vehicules sont disponibles sans distance.
                          </div>
                        )}
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Vehicle KM")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input mission-input-disabled"
                          name="km_dep_misrap"
                          value={mission.km_dep_misrap || ""}
                          disabled
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Trailer")} (*)</label>
                        <select
                          name="remorque_misrap"
                          className="form-select mission-input"
                          value={mission.remorque_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                          disabled={trailers.length === 0}
                        >
                          <option value="">
                            {trailers.length === 0 ? translate("Aucune remorque disponible") : translate("Select Trailer")}
                          </option>
                          {trailers.map((trailer, index) => (
                            <option key={index} value={trailer.trailer_mission}>
                              {trailer.trailer_mission}
                            </option>
                          ))}
                        </select>
                        {trailers.length === 0 && (
                          <div className="mission-warning-text mt-2">
                            {translate("Aucune remorque disponible.")}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Driver")} (*)</label>
                        <select
                          name="cond_misrap"
                          className="form-select mission-input"
                          value={mission.cond_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        >
                          <option value="">{translate("Select Driver")}</option>
                          {drivers.map((driver, index) => (
                            <option key={index} value={String(driver.driver_mission)}>
                              {driver.driver_mission}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="mission-label">{translate("Accompaniment")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="acc_misrap"
                          value={mission.acc_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "technical" && (
                  <div className="mission-form-section">
                    <div className="row g-3">
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Fuel Type")} (*)</label>
                        <input
                          type="text"
                          className="form-control mission-input"
                          name="carb_misrap"
                          value={mission.carb_misrap || ""}
                          onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Expenses")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="frais_misrap"
                          value={mission.frais_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Number of Nights")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="nuit_misrap"
                          value={mission.nuit_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Immobilization (Days)")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="immob_misrap"
                          value={mission.immob_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Duration (Days)")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="durr_misrap"
                          value={mission.durr_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <label className="mission-label">{translate("Return Km (km)")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="km_ret_misrap"
                          value={mission.km_ret_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Distance (km)")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="dist_misrap"
                          value={mission.dist_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="mission-label">{translate("Amortization Period")} (*)</label>
                        <input
                          type="number"
                          className="form-control mission-input"
                          name="amort_misrap"
                          value={mission.amort_misrap || ""}
                          onChange={(e) => handleNumberChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mission-form-footer">
            <button type="button" className="btn btn-light mission-cancel-btn" onClick={() => navigate("/mission-report")}>
              {translate("Cancel")}
            </button>
            <Button
              variant="primary"
              type="button"
              className="mission-submit-btn"
              onClick={saveMission}
              disabled={buttonClicked}
            >
              {isEditing ? <i className="fas fa-edit me-2"></i> : <i className="fas fa-plus me-2"></i>}
              {isEditing ? translate("Update") : translate("Add")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
