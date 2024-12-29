import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalNewViolationProps {
  show: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
}
type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};
type Vehicle = {
  id_vehicule: number;
  immatriculation_vehicule: string;
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalNewVilation: React.FC<ModalNewViolationProps> = ({
  show,
  handleClose,
  onSuccess,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);


  const [formData, setFormData] = useState({
    id_conducteur: "",
    type: "",
    id_vehicule: "",
    date: "",
    cost: 0,
    description: "",
    customType: "", // Champ pour gérer le type personnalisé
  });

  const { translate } = useTranslate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  useEffect(() => {
    if (show) {
      const fetchVehicles = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`);
  
          if (!response.ok) {
            throw new Error("Failed to fetch vehicles");
          }
  
          const vehiclesData = await response.json();
          console.log("Vehicles data received from API:", vehiclesData);
  
          setVehicles(vehiclesData.vehicles ? vehiclesData.vehicles : []); // Access "vehicles"
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]); // Default to an empty array in case of an error
        }
      };
  
      fetchVehicles();
    }
  }, [show, backendUrl, geopuserID]);
  
  useEffect(() => {
    if (show) {
      const fetchDrivers = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/geop/drivers/${geopuserID}`);
  
          if (!response.ok) {
            throw new Error("Failed to fetch drivers");
          }
  
          const data = await response.json();
          console.log("Drivers data received from API:", data);
  
          // Extract only drivers from the response
          const drivers = data.vehicles.map((vehicle: any) => ({
            id_conducteur: vehicle.id_conducteur,
            nom_conducteur: vehicle.nom_conducteur,
            prenom_conducteur: vehicle.prenom_conducteur
          }));
  
          setDrivers(drivers); // Setting only the drivers data
        } catch (error) {
          console.error("Error fetching drivers:", error);
          setDrivers([]); // Default to an empty array in case of an error
        }
      };
  
      fetchDrivers();
    }
  }, [show, backendUrl, geopuserID]);
  
  


 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

 

  // Pour le champ de type de violation
  const violationOptions = [
    { value: "speed", label: translate("Speed")}, 
    { value: "overspeed", label: translate("Speed") },
    { value: "insufficient_break", label: translate("Insufficient Break") },
    { value: "night_driving", label: translate("Night Driving")},
    { value: "overtime_driving", label: translate("Overtime Driving") },
    { value: "other", label: translate("Other")},
  ];

  const handleViolationTypeChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";

    setFormData({
      ...formData,
      [name]: value,
      customType: value === "other" ? formData.customType : "", 
    });
    console.log(formData); 

  };

  const initialFormData = {
    id_conducteur: "",
    type: "",
    id_vehicule: "",
    date: "",
    cost: 0,
    description: "",
    customType: "",
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dateformat = formatDateToTimestamp(formData.date);
    const body = {
      id_conducteur: formData.id_conducteur,
      type_violation: formData.type,
      id_vehicule: formData.id_vehicule,
      date_violation: dateformat,
      cost: formData.cost,
      description: formData.description,
    };

    fetch(`${backendUrl}/api/geop/add_violation/${geopuserID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          // Si la réponse HTTP n'est pas ok, on déclenche une erreur
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'violation ajouté avec succès') {
          toast.success("Violation added successfully!", {
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
          setFormData(initialFormData);
          // Rafraîchir les données
          if (onSuccess) {
            onSuccess(); // Appel du callback pour rafraîchir le tableau
          }
          handleClose();
        } else {
          // Si la réponse ne contient pas le message de succès attendu
          toast.error("Failed to add violation. Please try again.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      })
      .catch((error) => {
        toast.error("Error adding violation: " + error.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        console.error("Error adding violation:", error);
      });
  };

  const handleCustomTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, customType: e.target.value });
    console.log(formData);  // Affiche les données dans la console
  };

  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>{translate("Add Violation")}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body
          style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
        >
          <Form.Group controlId="type">
            <Form.Label>{translate("Violation type")}</Form.Label>
            <Select
              options={violationOptions}
              onChange={handleViolationTypeChange}
              name="type"
              value={violationOptions.find(
                (option) => option.value === formData.type
              )}
              isClearable
            />
          </Form.Group>
          {formData.type === "other" && (
            <Form.Group controlId="customType">
              <Form.Label>{translate("Custom Violation Type")}</Form.Label>
              <Form.Control
                type="text"
                name="customType"
                value={formData.customType}
                onChange={handleCustomTypeChange}
                placeholder="Enter custom violation type"
              />
            </Form.Group>
          )}
       
       <Form.Group controlId="id_conducteur">
    <Form.Label>{translate("Driver")}</Form.Label>
    <Form.Control
        as="select"
        value={formData.id_conducteur}
        onChange={handleChange}
    >
        <option value="">{translate("Select Driver")}</option>
        {drivers.length === 0 ? (
            <option value="">{translate("No drivers available")}</option>
        ) : (
            drivers.map((driver) => (
                <option key={driver.id_conducteur} value={driver.id_conducteur}>
                    {`${driver.prenom_conducteur} ${driver.nom_conducteur}`}
                </option>
            ))
        )}
    </Form.Control>
</Form.Group>

        <Form.Group controlId="id_vehicule">
                               <Form.Label>{translate("Vehicle")}</Form.Label>
                               <Form.Control
                                   as="select"
                                   value={formData.id_vehicule}
                                   onChange={handleChange}
                               >
                                   <option value="">{translate("Select Vehicle")}</option>
                                   {vehicles.length === 0 ? (
                                       <option value="">{translate("No vehicles available")}</option>
                                   ) : (
                                       vehicles.map((vehicle) => (
                                           <option key={vehicle.id_vehicule} value={vehicle.id_vehicule}>
                                               {vehicle.immatriculation_vehicule}
                                           </option>
                                       ))
                                   )}
                               </Form.Control>
                           </Form.Group>

          <Form.Group controlId="date">
            <Form.Label>{translate("Date Violation")}</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Enter Date and Time here"
            />
          </Form.Group>

          <Form.Group controlId="cost">
            <Form.Label>{translate("Cost")}</Form.Label>
            <Form.Control
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="Enter Cost here"
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>{translate("Description")}</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {translate("Close")}
          </Button>
          <Button variant="primary" type="submit">
            {translate("Add")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalNewVilation;
