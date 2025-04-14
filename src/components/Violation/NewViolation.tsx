import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalNewViolationProps {
  show: boolean;
  onHide: () => void;

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

const ModalNewVilation: React.FC<ModalNewViolationProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const geopuserID = localStorage.getItem("GeopUserID");



  const [formData, setFormData] = useState<{
    id_conducteur: string ;
    type: string | null;
    id_vehicule: string;
    date: string;
    cost: number | null; // Accepte maintenant null
    description: string ;
  }>({
    id_conducteur: "",
    type: "",
    id_vehicule: "",
    date: "",
    cost: null, // Null est maintenant accepté
    description: "",
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
  
          setVehicles(Array.isArray(vehiclesData.vehicles) ? vehiclesData.vehicles : []);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]);
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
  
          const drivers = Array.isArray(data.vehicles)
            ? data.vehicles
                .filter(
                  (driver: any) =>
                    driver.nom_conducteur?.trim() !== "" &&
                    driver.prenom_conducteur?.trim() !== ""
                )
                .map((driver: any) => ({
                  id_conducteur: driver.id_conducteur,
                  nom_conducteur: driver.nom_conducteur,
                  prenom_conducteur: driver.prenom_conducteur,
                }))
            : [];
  
          setDrivers(drivers);
        } catch (error) {
          console.error("Error fetching drivers:", error);
          setDrivers([]);
        }
      };
  
      fetchDrivers();
    }
  }, [show, backendUrl, geopuserID]);
  const handleClose = () => {
    setFormData({
      id_conducteur: "",
    type: "",
    id_vehicule: "",
    date: "",
    cost: null, // Null est maintenant accepté
    description: "",
    });
    onHide(); // Fermer le modal après la réinitialisation
};
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

  // Pour le champ de type de violation
  const violationOptions = [
    { value: "Speed", label: translate("Speed")}, 
    { value: "Over Speed", label: translate("Over Speed") },
    { value: "Insufficient Break", label: translate("Insufficient Break") },
    { value: "Night Driving", label: translate("Night Driving")},
    { value: "Overtime Driving", label: translate("Overtime Driving") },
  ];

  const handleViolationTypeChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";

    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData); 

  };

  const initialFormData = {
    id_conducteur: "",
    type: "",
    id_vehicule: "",
    date: "",
    cost: null, 
    description: "",
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
          throw new Error(``);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'violation ajouté avec succès') {
          toast.success(translate("Added successfully!"), 
          {            
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
          onHide();

        } else {
          // Si la réponse ne contient pas le message de succès attendu
            toast.error(translate("Error adding. Please try again"), {  
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
        toast.error("Please fill out all fields" + error.message, {
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
        console.error("Error adding violation", error);
      });
  };

  const handleCustomTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData});
    console.log(formData);  // Affiche les données dans la console
  };

      return (
        <Modal show={show} onHide={onHide} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{translate("Add Violation")}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body
              style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
            >
            {/* Violation Type */}
    <Form.Group controlId="type">
      <Form.Label>{translate("Violation type")}{translate(" *")}</Form.Label>
      <Select
        options={violationOptions}
        onChange={handleViolationTypeChange}
        name="type"
        value={
          violationOptions.find((option) => option.value === formData.type) || null
        }
        isClearable
        isSearchable
      
      />
    </Form.Group>

    {/* Driver */}
    <Form.Group controlId="id_conducteur">
      <Form.Label>{translate("Driver")}{translate(" *")}</Form.Label>
      <Select
        options={drivers.map((driver) => ({
          value: driver.id_conducteur,
          label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
        }))}
        placeholder={translate("Select Driver")}
        isLoading={drivers.length === 0}
        noOptionsMessage={() => translate("No drivers available")}
        isSearchable
        value={
          drivers
            .map((driver) => ({
              value: driver.id_conducteur,
              label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
            }))
            .find(
              (option) =>
                String(option.value) === String(formData.id_conducteur)
            ) || null
        }
        onChange={(selectedOption) => {
          setFormData((prev) => ({
            ...prev,
            id_conducteur: selectedOption ? String(selectedOption.value) : "",
          }));
        }}
      
      />
    </Form.Group>

    {/* Vehicle */}
    <Form.Group controlId="id_vehicule">
      <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
      <Select
        options={vehicles.map((vehicle) => ({
          value: vehicle.id_vehicule,
          label: vehicle.immatriculation_vehicule,
        }))}
        placeholder={translate("Select Vehicle")}
        isLoading={vehicles.length === 0}
        noOptionsMessage={() => translate("No vehicles available")}
        isSearchable
        value={
          vehicles
            .map((vehicle) => ({
              value: vehicle.id_vehicule,
              label: vehicle.immatriculation_vehicule,
            }))
            .find(
              (option) =>
                String(option.value) === String(formData.id_vehicule)
            ) || null
        }
        onChange={(selectedOption) => {
          setFormData((prev) => ({
            ...prev,
            id_vehicule: selectedOption ? String(selectedOption.value) : "",
          }));
        }}
        
      />
    </Form.Group>

    {/* Date Violation */}
    <Form.Group controlId="date">
      <Form.Label>{translate("Date Violation")}{translate(" *")}</Form.Label>
      <Form.Control
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        placeholder="Enter Date and Time here"
        
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
