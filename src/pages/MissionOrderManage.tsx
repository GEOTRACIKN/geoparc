import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../components/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { MissionOrder } from "./MissionOrder";

interface MissionOrderInterface {
  id_mission?: number | null;
  ref_mission: number | null;
  object_mission: string | null;
  fuel_loading_mission: number | null;
  fuel_type_mission: number | null;
  expenses_mission: number | null;
  tank_mission: number | null;
  trailer_mission: number | null;
  driver_mission: number | null;
  accomp_mission: number | null;
  dep_loc_mission: string | null;
  dep_date_mission: number | null;
  dep_dest_mission: string | null;
  return_date_mission: number | null;
  itinerary_mission: string | null;
  vehicle_km_mission: number | null;
  new_km_mission: number | null;
  fuel_cost_mission: number | null;
  fuel_level_mission: number | null;
  voucher_mission: number | null;
  vehicle_mission: number | null;
  id_user: string | null;

}


export function MissionOrderManage() {
  const { id_mission } = useParams<{ id_mission?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_mission);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [mission, setMission] = useState<MissionOrderInterface | null>({
    id_mission: isEditing && id_mission ? Number(id_mission) : null,
    ref_mission: null,
    object_mission: null,
    fuel_loading_mission: null,
    fuel_type_mission: null,
    expenses_mission: null,
    tank_mission: null,
    trailer_mission: null,
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
    vehicle_mission: null,
    id_user: isEditing ? null : id_user,
  });

  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedCodeConducteur, setUpdatedCodeConducteur] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);


  const cancelClicked = () => {
    navigate("/mission-order");
  };

  useEffect(() => {
    const getMission = async () => {
      try {
        // Récupération des informations du conducteur
        const res = await fetch(
          `${backendUrl}/api/geop/missionOrderManage/find/${id_mission}`,
          {
            mode: "cors",
          }
        );

        if (!res.ok) {
          console.error("Erreur lors de la récupération du conducteur");
          setError("Erreur lors de la récupération du conducteur");
          return;
        }

        const data: MissionOrderInterface = await res.json();
        setMission(data);

        //setUpdatedCodeConducteur(mission?.code_conducteur || "")


      } catch (error) {
        console.error("Erreur lors de la récupération du conducteur", error);
        setError("Erreur lors de la récupération du conducteur");
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) { getMission(); }
    else { setLoading(false); }



  }, [id_mission]);

  // Fonction de validation des emails
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fonction de validation des numéros de téléphone
  const validatePhone = (phone: string): boolean => {
    const re = /^[0-9]{10}$/; // Exemple pour des numéros de téléphone à 10 chiffres
    return re.test(phone);
  };


  const validateString = (str: string): boolean => {
    return str.trim().length > 0; // Example: checks if the string is not empty
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
            vehicle_mission: mission.vehicle_mission,
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

    const dateFields = [
      'ref_mission',
      'object_mission',
      'fuel_loading_mission',
      'fuel_type_mission',
      'expenses_mission',
      'tank_mission',
      'trailer_mission',
      'driver_mission',
      'accomp_mission',
      'dep_loc_mission',
      'dep_date_mission',
      'dep_dest_mission',
      'return_date_mission',
      'itinerary_mission',
      'vehicle_km_mission',
      'new_km_mission',
      'fuel_cost_mission',
      'fuel_level_mission',
      'voucher_mission',
      'vehicle_mission'
    ];

    missionOrderData = Object.fromEntries(
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



const createMifgssion = async (mission: MissionOrderInterface) => {
  try {
      // Prepare the mission data by filtering out null values
      let missionOrderData = {
          id_mission: mission.id_mission,
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
          vehicle_mission: mission.vehicle_mission,
      };

      // Create the mission
      const res = await fetch(`${backendUrl}/api/geop/missionOrderManage/create`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(missionOrderData),
      });

      if (!res.ok) {
          toast.warn("Can't create mission", {
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
          console.error("Error creating mission");
          return;
      }

      toast.success("Mission created successfully", {
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
      toast.warn("Can't create mission", {
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


  // Utilisez l'interface ChangeEvent pour le gestionnaire d'événements
  const handleChange = (name: any, value: any) => {
    console.log("name: " + name);
    console.log("value: " + value);

    if (mission) {
      setMission({
        ...mission,
        [name]: value,
      });
    }


    console.log(mission)

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
            {isEditing ? " Edit Mission Order" : " Add Mission Order"}
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
                <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> Reference (*)
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
                <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> Mission Object (*)
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
                <i className="fas fa-gas-pump" style={{ color: 'orange' }}></i> Fuel Loading (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_loading_mission"
                placeholder="Enter fuel loading"
                value={mission?.fuel_loading_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formFuelType">
              <Form.Label>
                <i className="fas fa-tachometer-alt" style={{ color: 'orange' }}></i> Fuel Type (*)
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
                <i className="fas fa-money-bill" style={{ color: 'orange' }}></i> Expenses (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="expenses_mission"
                placeholder="Enter expenses"
                value={mission?.expenses_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formTank">
              <Form.Label>
                <i className="fas fa-tachometer-alt" style={{ color: 'orange' }}></i> Tank (*)
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
                <i className="fas fa-trailer" style={{ color: 'orange' }}></i> Trailer (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="trailer_mission"
                
                
                placeholder="Enter trailer"
                value={mission?.trailer_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formDriver">
              <Form.Label>
                <i className="fas fa-user" style={{ color: 'orange' }}></i> Driver (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="driver_mission"
                
                placeholder="Enter driver's name"
                value={mission?.driver_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formAccomp">
              <Form.Label>
                <i className="fas fa-user-friends" style={{ color: 'orange' }}></i> Accompaniment (*)
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
                <i className="fas fa-map-marker-alt" style={{ color: 'orange' }}></i> Departure Location (*)
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
                <i className="fas fa-calendar" style={{ color: 'orange' }}></i> Departure Date (*)
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
                <i className="fas fa-map" style={{ color: 'orange' }}></i> Departure Destination (*)
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
                <i className="fas fa-calendar-alt" style={{ color: 'orange' }}></i> Return Date (*)
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
                <i className="fas fa-route" style={{ color: 'orange' }}></i> Itinerary (*)
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

            <Form.Group className="form-group" controlId="formVehicleKm">
              <Form.Label>
                <i className="fas fa-car" style={{ color: 'orange' }}></i> Vehicle KM (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="vehicle_km_mission"
                
                placeholder="Enter vehicle KM"
                value={mission?.vehicle_km_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formNewKm">
              <Form.Label>
                <i className="fas fa-car" style={{ color: 'orange' }}></i> New KM (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="new_km_mission"
                
                placeholder="Enter new KM"
                value={mission?.new_km_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formFuelCost">
              <Form.Label>
                <i className="fas fa-dollar-sign" style={{ color: 'orange' }}></i> Fuel Cost (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_cost_mission"
                
                placeholder="Enter fuel cost"
                value={mission?.fuel_cost_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formFuelLevel">
              <Form.Label>
                <i className="fas fa-gas-pump" style={{ color: 'orange' }}></i> Fuel Level (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="fuel_level_mission"
                
                placeholder="Enter fuel level"
                value={mission?.fuel_level_mission || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formVoucher">
              <Form.Label>
                <i className="fas fa-receipt" style={{ color: 'orange' }}></i> Voucher (*)
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

            <Form.Group className="form-group" controlId="formVehicle">
              <Form.Label>
                <i className="fas fa-car" style={{ color: 'orange' }}></i> Vehicle (*)
              </Form.Label>
              <Form.Control
                type="text"
                name="vehicle_mission"
                
                placeholder="Enter vehicle details"
                value={mission?.vehicle_mission || ''}
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
   mission &&
   (isEditing
     ? updateMission(mission)
       : createMission(mission)
    );
}}
            disabled={buttonClicked}

          >
            {isEditing ? <i className="fas fa-edit"></i> : <i className="fas fa-plus"></i>}
            {isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </>
  );
}

