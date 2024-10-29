import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../components/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";

interface MissionOrderInterface {
  id_mission?: number | null;
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
          `${backendUrl}/api/geop/mission/find/${id_mission}`,
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



/*   const updateMission = async (mission: MissionOrderInterface) => {


    // Validation échouée
    if (!isEmailValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid || !isCodeConducteurValid) {
      const emailElement = document.getElementById(
        "email_conducteur"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isEmailValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }

      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }

      const codeElement = document.getElementById("code_conducteur") as HTMLInputElement;
      if (codeElement) {
        codeElement.style.borderColor = isCodeConducteurValid ? "#ced4da" : "red";
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
    }

    try {

      const rescheck = await fetch(`${backendUrl}/api/geop/mission/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          //code_conducteur: mission.code_conducteur,
          //updated_code_conducteur: mission.code_conducteur,
          //updated: mission.code_conducteur === updatedCodeConducteur ? 0 : 1,
        }),
      });

      if (rescheck.ok) {
        const jsonResponse = await rescheck.json();

        if (jsonResponse.mission_count !== 0) {
          toast.warn("mission code already exists", {
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


        let missionData = Object.fromEntries(
          Object.entries(mission).filter(([_, value]) => value !== null)
        );

        const dateFields = [
          'date_naissance_conducteur',
          'date_delivrance_permis_conducteur',
          'date_delivrance_pi_conducteur',
          'date_expir_permis_conducteur'
        ];

        missionData = Object.fromEntries(
          Object.entries(mission)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => {
              // Check if the key is one of the specific date fields
              if (dateFields.includes(key)) {
                let date: Date;

                // If the value is already a Date object
                if (value instanceof Date) {
                  date = value;
                } else if (typeof value === 'string' && value.includes('T')) {
                  // Convert ISO string to Date object
                  date = new Date(value);
                } else {
                  return [key, value];
                }

                // Format the date as "YYYY-MM-DD HH:mm:ss"
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                return [key, formattedDate];
              }
              return [key, value];
            })
        );

        // Si les validations passent, mettre à jour le conducteur
        const res = await fetch(`${backendUrl}/api/geop/mission/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(missionData),
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
          setButtonClicked(false);
          return;
        }

        toast.success("mission updated successfully", {
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
      } else {
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

        setButtonClicked(false);
      }
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

      setButtonClicked(false);
    }
  };
*/
/*const createMission = async (mission: MissionOrderInterface) => {
    const isEmailValid = validateEmail(mission. ?? "");
    const isPhoneValid = validatePhone(mission.objet_mission ?? "");
    const isNomConducteurValid = validateString(mission.nom_conducteur ?? "");
    const isPreNomConducteurValid = validateString(mission.prenom_conducteur ?? "");
    const isCodeConducteurValid = validateString(mission.code_conducteur ?? "");





    // Validation échouée
    if (!isEmailValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid || !isCodeConducteurValid) {
      const emailElement = document.getElementById(
        ""
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isEmailValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }

      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }

      const codeElement = document.getElementById("code_conducteur") as HTMLInputElement;
      if (codeElement) {
        codeElement.style.borderColor = isCodeConducteurValid ? "#ced4da" : "red";
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

        // Check if the driver code already exists
        const rescheck = await fetch(`${backendUrl}/api/geop/mission/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            //code_conducteur: mission.code_conducteur,
            //updated_code_conducteur: mission.code_conducteur,
            update: 0, // For create operation
          }),
        });

        if (rescheck.ok) {
          const jsonResponse = await rescheck.json();

          if (jsonResponse.mission_count != 0) {
            toast.warn("mission code already exists", {
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

          let missionData = Object.fromEntries(
            Object.entries(mission).filter(([_, value]) => value !== null)
          );



          const dateFields = [
            'date_naissance_conducteur',
            'date_delivrance_permis_conducteur',
            'date_delivrance_pi_conducteur',
            'date_expir_permis_conducteur'
          ];

          missionData = Object.fromEntries(
            Object.entries(mission)
              .filter(([_, value]) => value !== null)
              .map(([key, value]) => {
                // Check if the key is one of the specific date fields
                if (dateFields.includes(key)) {
                  let date: Date;

                  // If the value is already a Date object
                  if (value instanceof Date) {
                    date = value;
                  } else if (typeof value === 'string' && value.includes('T')) {
                    // Convert ISO string to Date object
                    date = new Date(value);
                  } else {
                    return [key, value];
                  }

                  // Format the date as "YYYY-MM-DD HH:mm:ss"
                  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                  return [key, formattedDate];
                }
                return [key, value];
              })
          );


          // If validations pass, create the mission
          const res = await fetch(`${backendUrl}/api/geop/mission/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(missionData),
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
            setButtonClicked(false);
            return;
          }

          toast.success("mission created successfully", {
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
          navigate("/missions");
        } else {
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

          setButtonClicked(false);
        }
      } catch (error) {
        console.error("Can't create mission", error);

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

        setButtonClicked(false);
      }
    }
  };

*/

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
            <i className="las la-user-nurse"></i>
            {isEditing ? "Modifier un conducteur" : "Ajouter un conducteur"}
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
                  <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> Mission Object (*)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="object_mission"
                  id="object_mission"
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
                  id="fuel_loading_mission"
                  placeholder="Enter fuel loading"
                  value={mission?.fuel_loading_mission || ''}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="form-group" controlId="formFuelType">
                <Form.Label>
                  <i className="fas fa-oil-can" style={{ color: 'orange' }}></i> Fuel Type (*)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="fuel_type_mission"
                  id="fuel_type_mission"
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
                  id="expenses_mission"
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
                  id="tank_mission"
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
                  id="trailer_mission"
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
                  type="number"
                  name="driver_mission"
                  id="driver_mission"
                  placeholder="Enter driver"
                  value={mission?.driver_mission || ''}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="form-group" controlId="formAccomp">
                <Form.Label>
                  <i className="fas fa-users" style={{ color: 'orange' }}></i> Accomplices (*)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="accomp_mission"
                  id="accomp_mission"
                  placeholder="Enter accomplices"
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
                  id="dep_loc_mission"
                  placeholder="Enter departure location"
                  value={mission?.dep_loc_mission || ''}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="form-group" controlId="formDepDate">
                <Form.Label>
                  <i className="fas fa-calendar-day" style={{ color: 'orange' }}></i> Departure Date (*)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="dep_date_mission"
                  id="dep_date_mission"
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
                  id="dep_dest_mission"
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
                  type="number"
                  name="return_date_mission"
                  id="return_date_mission"
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
                  id="itinerary_mission"
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
                  id="vehicle_km_mission"
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
                  id="new_km_mission"
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
                  id="fuel_cost_mission"
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
                  id="fuel_level_mission"
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
                  type="number"
                  name="voucher_mission"
                  id="voucher_mission"
                  placeholder="Enter voucher"
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
                  type="number"
                  name="vehicle_mission"
                  id="vehicle_mission"
                  placeholder="Enter vehicle"
                  value={mission?.vehicle_mission || ''}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="form-group" controlId="formUserId">
                <Form.Label>
                  <i className="fas fa-user" style={{ color: 'orange' }}></i> User ID (*)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="id_user"
                  id="id_user"
                  placeholder="Enter user ID"
                  value={mission?.id_user || ''}
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

           // onClick={() => {
//   setButtonClicked(true);
//   mission &&
//     (isEditing
//       ? updateMission(mission)
//       : createMission(mission)
//     );
// }}
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

