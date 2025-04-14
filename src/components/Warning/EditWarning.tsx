import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bounce, toast } from "react-toastify";

interface ModalEditWarningProps {
  show: boolean;
  handleClose: () => void;
  warningId: number | null;
  onSuccess?: () => void;
}

type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalEditWarning: React.FC<ModalEditWarningProps> = ({
  show,
  handleClose,
  warningId,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    type: "",
    date: "",
    description: "",
  });
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    if (show && warningId) {
        
          const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return dateString ? date.toISOString().split('T')[0] : '';
          };
      fetch(`${backendUrl}/api/geop/warnin_form/${warningId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            conducteur: data.id_driver,
            type: data.Type_Warning,
            date: formatDate(data.Date),
            description: data.Description,
          });
        })
        .catch((error) => console.error("Error fetching warning:", error));
      
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`)
        .then((response) => response.json())
        .then((data) => setDrivers(data))
        .catch((error) => console.error("Error fetching drivers:", error));
    }
  }, [show, warningId]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/geop/update_warning/${warningId}`,
        {
          method: "PUT",
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
        console.log("Warning updated successfully:", data);
  
        // Toast de succès
        toast.success("Warning mis à jour avec succès.", {
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
  
            // Rafraîchir les données
            if (onSuccess) {
              onSuccess(); // Appel du callback pour rafraîchir le tableau
          }
        handleClose();
      } else {
        console.error("Failed to update warning:", response.statusText);
  
        // Toast d'erreur
        toast.error("Échec de la mise à jour du warning.", {
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
      if (error instanceof Error) {
        console.error("Error updating warning:", error.message);
  
        // Toast d'erreur avec message d'exception
        toast.error(`Erreur lors de la mise à jour du warning: ${error.message}`, {
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
      } else {
        console.error("Unexpected error:", error);
  
        // Toast d'erreur pour une erreur inattendue
        toast.error("Erreur inattendue lors de la mise à jour du warning.", {
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
    }
  };
  
  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: driver.nom_conducteur + " " + driver.prenom_conducteur,
  }));

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Avertissement</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group controlId="type">
            <Form.Label>Type d'avertissement</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Entrer le type ici"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Conducteur</Form.Label>
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
            <Form.Label>Date d'avertissement</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Entrer la date ici"
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
              placeholder="Entrer la description ici"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Modifier
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditWarning;
