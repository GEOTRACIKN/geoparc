import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../components/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";

interface MissionReportInterface {
    id_misrap?: number | null;               // Primary key with AUTO_INCREMENT
    ref_misrap: string | null;               // Reference, varchar(20)
    objt_misrap: string | null;              // Object of the mission, varchar(20)
    carb_misrap: string | null;              // Type of fuel, varchar(20)
    frais_misrap: number | null;             // Expenses, int(11)
    vehicule_misrap: string | null;         // Vehicle registration, varchar(20)
    remorque_misrap: string | null;         // Trailer, varchar(20)
    cond_misrap: string | null;             // Driver, varchar(20)
    acc_misrap: string | null;              // Accomplice, varchar(20)
    itnr_misrap: string | null;             // Itinerary, varchar(20)
    amort_misrap: number | null;            // Amortization, int(11)
    dep_misrap: string | null;              // Departure location, varchar(20)
    date_dep_misrap: string | null;         // Departure date, varchar(20)
    lieu_misrap: string | null;             // Place, varchar(20)
    date_arr_misrap: string | null;         // Arrival date, varchar(20)
    km_dep_misrap: number | null;           // Departure km, int(11)
    nuit_misrap: number | null;             // Night, int(11)
    immob_misrap: number | null;            // Immobilization, int(11)
    durr_misrap: number | null;             // Duration, int(11)
    km_ret_misrap: number | null;           // Return km, int(11)
    dist_misrap: number | null;            // Distance, int(11)
    id_user: string | null;
  }
  


export function MissionReportManage() {
  const { id_misrap } = useParams<{ id_misrap?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_misrap);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [mission, setMission] = useState<MissionReportInterface | null>({
    id_misrap: isEditing && id_misrap ? Number(id_misrap) : null,
  ref_misrap: null,
  objt_misrap: null,
  carb_misrap: null,
  frais_misrap: null,
  vehicule_misrap: null,
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
  id_user: isEditing ? null : id_user, // Set id_user only if not editing
});

  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);


  const cancelClicked = () => {
    navigate("/mission-report");
  };
  
   useEffect(() => {
    const getMissionReport = async () => {
      try {
        // Récupération des informations du conducteur
        const res = await fetch(
          `${backendUrl}/api/geop/missionReportManage/find/${id_misrap}`,
          {
            mode: "cors",
          }
        );

        if (!res.ok) {
          console.error("Erreur lors de la récupération du conducteur");
          setError("Erreur lors de la récupération du conducteur");
          return;
        }

        const data: MissionReportInterface = await res.json();
        setMission(data);



      } catch (error) {
        console.error("Erreur lors de la récupération du conducteur", error);
        setError("Erreur lors de la récupération du conducteur");
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) { getMissionReport(); }
    else { setLoading(false); }



  }, [id_misrap]);

  



  const updateMission = async (misrap: MissionReportInterface) => {
    try {
        // Prepare the mission data by filtering out null values
        let missionReportData = {
                id_misrap: misrap.id_misrap,
                ref_misrap: misrap.ref_misrap,
                objt_misrap: misrap.objt_misrap,
                carb_misrap: misrap.carb_misrap,
                frais_misrap: misrap.frais_misrap,
                vehicule_misrap: misrap.vehicule_misrap,
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
      'immatriculation_vehicule ',
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
                    <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> Mission Reference (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="ref_misrap"
                    placeholder="Enter the mission reference"
                    value={mission?.ref_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group className="form-group" controlId="formObjtMisrap">
                <Form.Label>
                    <i className="fas fa-clipboard" style={{ color: 'orange' }}></i> Mission Object (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="objt_misrap"
                    placeholder="Enter the mission object"
                    value={mission?.objt_misrap || ''}
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
                    name="carb_misrap"
                    placeholder="Enter fuel type"
                    value={mission?.carb_misrap || ''}
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
                    name="frais_misrap"
                    placeholder="Enter expenses"
                    value={mission?.frais_misrap || ''}
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
                    name="vehicule_misrap"
                    placeholder="Enter vehicle"
                    value={mission?.vehicule_misrap || ''}
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
                    name="remorque_misrap"
                    placeholder="Enter trailer"
                    value={mission?.remorque_misrap || ''}
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
                    name="cond_misrap"
                    placeholder="Enter driver's name"
                    value={mission?.cond_misrap || ''}
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
                    name="acc_misrap"
                    placeholder="Enter accompanying persons"
                    value={mission?.acc_misrap || ''}
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
                    name="itnr_misrap"
                    placeholder="Enter itinerary"
                    value={mission?.itnr_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group className="form-group" controlId="formAmortizationPeriod">
                  <Form.Label>
                    <i className="fas fa-calendar" style={{ color: 'orange' }}></i> Amortization Period (*)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="amort_misrap"
                    placeholder="Enter amortization period"
                    value={mission?.amort_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                  />
                </Form.Group>
                </div>
                <div className="col-md-6">


                <Form.Group className="form-group" controlId="formDepLoc">
                <Form.Label>
                    <i className="fas fa-map-marker-alt" style={{ color: 'orange' }}></i> Departure Location (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="lieu_misrap"
                    placeholder="Enter departure location"
                    value={mission?.lieu_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group className="form-group" controlId="formDepDate">
                <Form.Label>
                    <i className="fas fa-calendar" style={{ color: 'orange' }}></i> Departure Date (*)
                </Form.Label>
                <Form.Control
                    type="date"
                    name="date_dep_misrap"
                    value={mission?.date_dep_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>

                <Form.Group className="form-group" controlId="formDepDest">
                <Form.Label>
                    <i className="fas fa-map" style={{ color: 'orange' }}></i> Mission Location (*)
                </Form.Label>
                <Form.Control
                    type="text"
                    name="dep_misrap"
                    placeholder="Enter mission location"
                    value={mission?.dep_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
                <Form.Group className="form-group" controlId="formArrivalDate">
                  <Form.Label>
                    <i className="fas fa-calendar-alt" style={{ color: 'orange' }}></i> Arrival Date (*)
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date_arr_misrap"
                    value={mission?.date_arr_misrap || ''}
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
                    name="km_dep_misrap"
                    placeholder="Enter vehicle KM"
                    value={mission?.km_dep_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                />
                </Form.Group>
                <Form.Group className="form-group" controlId="formNumberOfNights">
                  <Form.Label>
                    <i className="fas fa-bed" style={{ color: 'orange' }}></i> Number of Nights (*)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="nuit_misrap"
                    placeholder="Enter number of nights"
                    value={mission?.nuit_misrap || ''}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    required
                  />
              </Form.Group>


              <Form.Group className="form-group" controlId="formImmobilizationDays">
              <Form.Label>
                <i className="fas fa-calendar-day" style={{ color: 'orange' }}></i> Immobilization (Days) (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="immob_misrap"
                placeholder="Enter immobilization days"
                value={mission?.immob_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="form-group" controlId="formDuration">
              <Form.Label>
                <i className="fas fa-clock" style={{ color: 'orange' }}></i> Duration (Days) (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="durr_misrap"
                placeholder="Enter duration in days"
                value={mission?.durr_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formReturnMileage">
              <Form.Label>
                <i className="fas fa-road" style={{ color: 'orange' }}></i> Return Mileage (km) (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="km_ret_misrap"
                placeholder="Enter return mileage"
                value={mission?.km_ret_misrap || ''}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="form-group" controlId="formDistance">
              <Form.Label>
                <i className="fas fa-random" style={{ color: 'orange' }}></i> Distance (km) (*)
              </Form.Label>
              <Form.Control
                type="number"
                name="dist_misrap"
                placeholder="Enter distance"
                value={mission?.dist_misrap || ''}
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
  {isEditing ? "Modifier" : "Ajouter"}
</Button>


        </div>
      </div>
    </>
  );
}

