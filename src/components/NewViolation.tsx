import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalNewViolationProps {
  show: boolean;
  handleClose: () => void;
  refreshviolation?: () => void; // Optional prop

}
type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};
type Vehicle = {
  id_vehicule: number;
  id_groupe: number;
  immatriculation_vehicule: string;
};
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const geopuserID = localStorage.getItem("GeopUserID");
const ModalNewVilation: React.FC<ModalNewViolationProps> = ({
  show,
  handleClose,
  refreshviolation,
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    type: "",
    vehicule:"",
    date: "",
    cost:0,
    description: "",
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [drivers, setdrivers] = useState<Driver[]>([]); // Préciser le type ici
  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`) // Remplacez '1' par l'ID de l'utilisateur
        .then((response) => response.json())
        .then((data) => setdrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));
    }
  }, [show]);

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0; // Convertir en nombre
    setFormData({ ...formData, [name]: value });
  };
  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: driver.nom_conducteur + " " + driver.prenom_conducteur,
  }));

  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Préciser le type ici

  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/vehicles_sinister/${geopuserID}`) // Remplacez '1' par l'ID de l'utilisateur
        .then((response) => response.json())
        .then((data) => setVehicles(data))
        .catch((error) => console.error("Error fetching vehicles:", error));
    }
  }, [show]);
  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.immatriculation_vehicule,
    label: vehicle.immatriculation_vehicule,
  }));
  const handleVehiculeSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  
    
    fetch(`${backendUrl}/api/geop/add_violation/${geopuserID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_driver: formData.conducteur,
        type_violation: formData.type,
        vehicule: formData.vehicule,
        date_violation: formData.date,
        cost: formData.cost,
        description: formData.description,
      }),    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Violation added successfully:", data);
        if (refreshviolation) refreshviolation();
        handleClose();
      })
      .catch((error) => console.error("Error adding violation:", error));
  };


  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Add Violation</Modal.Title>
      </Modal.Header>
      <Form>
      <Modal.Body style={{ maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
      <Form.Group controlId="type">
            <Form.Label>Type Violation</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Enter Type here"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Driver</Form.Label>
            <Select
              options={conducteursOptions}
              onChange={handleSelectChange}
              name="conducteur"
              value={conducteursOptions.find(
                (option) => option.value === formData.conducteur
              )}
              isClearable
            />
          </Form.Group>
          <Form.Group controlId="vehicule">
          <Form.Label>Vehicule </Form.Label>
          <Select
            options={vehicleOptions}
            name="vehicule"
            value={vehicleOptions.find(
              (option) => option.value === formData.vehicule
            )}
            onChange={handleVehiculeSelectChange}
          />
        </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Date Violation</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Enter Date here"
            />
          </Form.Group>
          <Form.Group controlId="cost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="Enter Cost here"
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4} // Set the number of rows for the textarea
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit"  onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalNewVilation;
