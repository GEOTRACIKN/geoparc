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
    id_vehicule : null,
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
        // Prepare the mission data by filtering out null values
        let missionOrderData = {
            id_mission: mission.id_mission,
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
        };

        // Update the mission
        const res = await fetch(`${backendUrl}/api/geop/missionOrderManage/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(missionOrderData),
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

        navigate("/mission-order");
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
        [name]: value,
      });
    }
    console.log(mission);
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
            {isEditing ? " Edit Mission Order" : " New Mission Order"}
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
            <Form.Group className="form-group" controlId="formObject">
              <Form.Label>
                <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> {translate("Reference")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="ref_mission"
                placeholder="Enter the mission reference"
                value={mission?.ref_mission || ''}
                 onChange={(e) => handleChange(e.target.name, e.target.value)}
                  
                required
              />
            </Form.Group>
            <Form.Group className="form-group" controlId="formObject">
              <Form.Label>
                <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> {translate("Mission Object")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="object_mission"
                placeholder="Enter the mission object"
                value={mission?.object_mission || ''}
                 onChange={(e) => handleChange(e.target.name, e.target.value)}
                 
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formFuelLoading">
              <Form.Label>
                <i className="fas fa-gas-pump" style={{ color: 'orange' }}></i> {translate("Fuel Loading Type")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_loading_mission"
                placeholder="Enter fuel loading"
                value={mission?.fuel_loading_mission || ''}
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

            <Form.Group className="form-group" controlId="formFuelType">
              <Form.Label>
                <i className="fas fa-tachometer-alt" style={{ color: 'orange' }}></i> {translate("Fuel Type")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="fuel_type_mission"
                placeholder="Enter fuel type"
                value={mission?.fuel_type_mission || ''}
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
                name="expenses_mission"
                placeholder="Enter expenses"
                value={mission?.expenses_mission || ''}
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

            <Form.Group className="form-group" controlId="formTank">
              <Form.Label>
                <i className="fas fa-tachometer-alt" style={{ color: 'orange' }}></i> {translate("Tank")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="tank_mission"
                
                placeholder="Enter tank"
                value={mission?.tank_mission || ''}
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
                  name="trailer_mission"
                  value={mission?.trailer_mission || ''}
                   onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {trailer.length === 0 ? (
                    <option disabled>No trailer available</option>
                  ) : (
                    trailer.map((trailers, index) => (
                      <option key={index} value={trailers.trailer_mission}>
                        {trailers.trailer_mission}
                      </option>
                    ))
                  )}
              </Form.Control>
            </Form.Group>

            <Form.Group className="form-group" controlId="formDriver">
              <Form.Label>
                <i className="fas fa-user" style={{ color: 'orange' }}></i> {translate("Driver")} (*)
              </Form.Label>

              <Form.Control
                  as="select"
                  name="driver_mission"
                  value={mission?.driver_mission || ''}
                   onChange={(e) => handleChange(e.target.name, e.target.value)}
                  
                  required
                >
                <option value="">Select Driver</option>
                {driver.length === 0 ? (
                  <option disabled>No driver available</option>
                ) : (
                  driver.map((drivers, index) => (
                    <option key={index} value={drivers.driver_mission}>
                      {drivers.driver_mission}
                    </option>
                  ))
                )}
              </Form.Control>

            </Form.Group>

            <Form.Group className="form-group" controlId="formAccomp">
              <Form.Label>
                <i className="fas fa-user-friends" style={{ color: 'orange' }}></i> {translate("Accompaniment")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="accomp_mission"
              
                placeholder="Enter accompanying persons"
                value={mission?.accomp_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formDepLoc">
              <Form.Label>
                <i className="fas fa-map-marker-alt" style={{ color: 'orange' }}></i> {translate("Departure Location")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="dep_loc_mission"
                
                placeholder="Enter departure location"
                value={mission?.dep_loc_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group className="form-group" controlId="formDepDate">
              <Form.Label>
                <i className="fas fa-calendar" style={{ color: 'orange' }}></i> {translate("Departure Date")} (*)
              </Form.Label>
              <Form.Control
                type="date"
                name="dep_date_mission"
                
                placeholder="Enter departure date"
                value={mission?.dep_date_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formDepDest">
              <Form.Label>
                <i className="fas fa-map" style={{ color: 'orange' }}></i>{translate("Destination")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="dep_dest_mission"
                
                placeholder="Enter departure destination"
                value={mission?.dep_dest_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formReturnDate">
              <Form.Label>
                <i className="fas fa-calendar-alt" style={{ color: 'orange' }}></i> {translate("Return Date")} (*)
              </Form.Label>
              <Form.Control
                type="date"
                name="return_date_mission"
                
                placeholder="Enter return date"
                value={mission?.return_date_mission || ''}
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
                name="itinerary_mission"
                
                placeholder="Enter itinerary"
                value={mission?.itinerary_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>
<Form.Group controlId="id_vehicule">
  <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
  <Select
    options={vehicles.map(vehicle => ({
      value: vehicle.id_vehicule,
      label: vehicle.immatriculation_vehicule
    }))}
    placeholder={translate("Select Vehicle")}
    isLoading={vehicles.length === 0}
    noOptionsMessage={() => translate("No vehicles available")}
    isSearchable
    value={
      vehicles
        .map(vehicle => ({
          value: vehicle.id_vehicule,
          label: vehicle.immatriculation_vehicule
        }))
        .find(option => option.value === mission?.id_vehicule) || null
    }
    onChange={async (selectedOption) => {
      const id = selectedOption ? selectedOption.value : null;
      
      if (id) {
        try {
          const vehicleData = await getVehicleKm(id);
          
          setMission(prev => {
            if (prev === null) {
              // Crée un nouvel objet mission si l'état était null
              return {
                id_mission: null,
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
                vehicle_km_mission: vehicleData.kilometrage_vehicule || null,
                new_km_mission: null,
                fuel_cost_mission: null,
                fuel_level_mission: null,
                voucher_mission: null,
                id_vehicule: id,
                id_user: id_user
              };
            }
            // Met à jour l'état existant
            return {
              ...prev,
              id_vehicule: id,
              vehicle_km_mission: vehicleData.kilometrage_vehicule || null
            };
          });
        } catch (error) {
          console.error("Erreur récupération kilométrage:", error);
          toast.error(translate("Erreur récupération kilométrage"), {
            position: "bottom-right",
            autoClose: 2400,
            transition: Bounce,
          });
        }
      } else {
        setMission(prev => {
          if (prev === null) {
            // Retourne un nouvel objet avec les valeurs par défaut
            return {
              id_mission: null,
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
              id_user: id_user
            };
          }
          // Met à jour l'état existant
          return {
            ...prev,
            id_vehicule: null,
            vehicle_km_mission: null
          };
        });
      }
    }}
  />
</Form.Group>
            <Form.Group className="form-group" controlId="formVehicleKm">
              <Form.Label>
                <i className="fas fa-car" style={{ color: 'orange' }}></i> {translate("Vehicle KM")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="vehicle_km_mission"               
                placeholder="Enter vehicle KM"
                value={mission?.vehicle_km_mission || ''}
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

            <Form.Group className="form-group" controlId="formNewKm">
              <Form.Label>
                <i className="fas fa-car" style={{ color: 'orange' }}></i> {translate("New KM")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="new_km_mission"                
                placeholder="Enter new KM"
                value={mission?.new_km_mission || ''}
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

            <Form.Group className="form-group" controlId="formFuelCost">
              <Form.Label>
                <i className="fas fa-dollar-sign" style={{ color: 'orange' }}></i> {translate("Fuel Cost")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_cost_mission"
                
                placeholder="Enter fuel cost"
                value={mission?.fuel_cost_mission || ''}
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

            <Form.Group className="form-group" controlId="formFuelLevel">
              <Form.Label>
                <i className="fas fa-gas-pump" style={{ color: 'orange' }}></i> {translate("Fuel Level")} (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_level_mission"    
                placeholder="Enter fuel level"
                value={mission?.fuel_level_mission || ''}
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

            <Form.Group className="form-group" controlId="formVoucher">
              <Form.Label>
                <i className="fas fa-receipt" style={{ color: 'orange' }}></i> {translate("Voucher")} (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="voucher_mission"
                
                placeholder="Enter voucher number"
                value={mission?.voucher_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
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
  {isEditing ? "Edit" : "Add"}
</Button>


        </div>
      </div>
    </>
  );
}

