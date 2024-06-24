import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalNewWArningProps {
  show: boolean;
  handleClose: () => void;
  refreshwarning?: () => void; // Optional prop

};
type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");
const ModalNewWaring: React.FC<ModalNewWArningProps> = ({
  show,
  handleClose,
  refreshwarning
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    type: "",
    date: "",
    description: "",
  });
  const [drivers, setdrivers] = useState<Driver[]>([]); // Préciser le type ici
  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`) // Remplacez '1' par l'ID de l'utilisateur
        .then((response) => response.json())
        .then((data) => setdrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));
    }
  }, [show]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/geop/Add_warning/${geopuserID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_driver: formData.conducteur,
            type_warning: formData.type,
            description: formData.description,
            date: formData.date,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Warning added successfully:", data);
        if (refreshwarning) {
          refreshwarning();
        }
        handleClose();
      } else {
        console.error("Failed to add Warning:", response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding Warning:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: driver.nom_conducteur + " " + driver.prenom_conducteur,
  }));

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0; // Convertir en nombre
    setFormData({ ...formData, [name]: value });
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add warning</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group controlId="type">
            <Form.Label>Type Warning</Form.Label>
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
          <Form.Group controlId="date">
            <Form.Label>Date Warning</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Enter Date here"
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
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalNewWaring;
