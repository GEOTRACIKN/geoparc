import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { MissionOrder } from "./MissionOrder";
import Select, { SingleValue } from "react-select";

interface Vehicle {
  id_vehicule: number;
  immatriculation_vehicule: string;
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
const id_user = localStorage.getItem("GeopUserID");


export function MissionOrderManage() {
  const { id_mission } = useParams<{ id_mission?: string }>();
  const isEditing = Boolean(id_mission);
  const navigate = useNavigate();
  const { translate } = useTranslate();




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


  const cancelClicked = () => {
    navigate("/mission-order");
  };


  const [trailer, setTrailer] = useState<{ trailer_mission: string }[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [driver, setDriver] = useState<{ driver_mission: string }[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);


  useEffect(() => {
    const getMissionOrder = async () => {
      try {
        setLoading(true);

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
          fetch(`${backendUrl}/api/geop/driver/${id_user}`),
          fetch(`${backendUrl}/api/geop/trailer/${id_user}`)
        ]);

        // Traitement des réponses
        const [missionRes, vehiclesRes, driverRes, trailerRes] = responses;

        // Véhicules - s'assurer que c'est un tableau
        const vehiclesData = vehiclesRes?.ok
          ? await vehiclesRes.json()
          : [];
        setVehicles(vehiclesData.vehicles || []);
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
  }, [id_mission, id_user, isEditing]);
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
                        <select
                          name="id_vehicule"
                          className="form-select mission-input"
                          value={mission?.id_vehicule || ""}
                          onChange={handleVehicleChange}
                        >
                          <option value="">{translate("Select Vehicle")}</option>
                          {vehicles?.map((vehicle: any) => (
                            <option key={vehicle.id_vehicule} value={vehicle.id_vehicule}>
                              {vehicle.immatriculation_vehicule}
                            </option>
                          ))}
                        </select>
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

