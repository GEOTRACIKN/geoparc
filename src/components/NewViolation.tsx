import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalNewViolationProps {
  show: boolean;
  handleClose: () => void;
  refreshviolation?: () => void;
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
    vehicule: "",
    date: "",
    cost: 0,
    description: "",
    customType: "", // Champ pour gérer le type personnalisé

  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [drivers, setdrivers] = useState<Driver[]>([]);
  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`)
        .then((response) => response.json())
        .then((data) => setdrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));
    }
  }, [show]);

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0;
    setFormData({ ...formData, [name]: value });
  };

  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: driver.nom_conducteur + " " + driver.prenom_conducteur,
  }));

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/vehicles_sinister/${geopuserID}`)
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

  // Pour le champ de type de violation
  const violationOptions = [
    { value: "vitesse", label: "Vitesse" },
    { value: "survitesse", label: "Survitesse" },
    { value: "pause_insuffisante", label: "Pause Insuffisante" },
    { value: "conduite_nuit", label: "Conduite de Nuit" },
    { value: "depassement_heure", label: "Dépassement Heure de Conduite" },
    { value: "autre", label: "Autre" },
  ];

  const handleViolationTypeChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";

    setFormData({
      ...formData,
      [name]: value,
      customType: value === "autre" ? formData.customType : "", // Réinitialiser customType si "autre" n'est pas sélectionné
    });
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
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Violation added successfully:", data);
        if (refreshviolation) refreshviolation();
        handleClose();
      })
      .catch((error) => console.error("Error adding violation:", error));
  };

  const handleCustomTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, customType: e.target.value });
  };

  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Add Violation</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}>
          <Form.Group controlId="type">
            <Form.Label>Type Violation</Form.Label>
            <Select
              options={violationOptions}
              onChange={handleViolationTypeChange}
              name="type"
              value={violationOptions.find((option) => option.value === formData.type)}
              isClearable
            />
          </Form.Group>
          {formData.type === "autre" && (
            <Form.Group controlId="customType">
              <Form.Label>Custom Violation Type</Form.Label>
              <Form.Control
                type="text"
                name="customType"
                value={formData.customType}
                onChange={handleCustomTypeChange}
                placeholder="Enter custom violation type"
              />
            </Form.Group>
          )}
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
            <Form.Label>Vehicule</Form.Label>
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
              rows={4}
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
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalNewVilation;
