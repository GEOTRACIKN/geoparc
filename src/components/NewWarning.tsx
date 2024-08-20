import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bounce, toast } from "react-toastify";

interface ModalNewWArningProps {
  show: boolean;
  handleClose: () => void;
  refreshwarning?: () => void; // Optional prop
}

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
  refreshwarning,
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    type: "",
    date: "",
    description: "",
  });
  const [drivers, setdrivers] = useState<Driver[]>([]);

  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`)
        .then((response) => response.json())
        .then((data) => setdrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));
    }
  }, [show]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // Prevent default form submission
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
      toast.success("Warning ajouté avec succès.", {
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

      if (refreshwarning) {
        refreshwarning(); // Mettre à jour les avertissements dans le composant parent
      }
      handleClose(); // Fermer le modal
      setFormData({
        conducteur: 0,
        type: "",
        date: "",
        description: "",
      }); // Réinitialiser les champs du formulaire
    } else {
      toast.error("Erreur lors de l'ajout du Warning.", {
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
  } catch (error) {
    toast.error(
      `Erreur lors de l'ajout du Warning: ${error instanceof Error ? error.message : "Erreur inattendue"}`,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  }
};


  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
  }));

  const handleSelectChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      conducteur: selectedOption ? Number(selectedOption.value) : 0,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Add Warning</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
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

export default ModalNewWaring;
