import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bounce, toast } from "react-toastify";

interface ModalEditViolationProps {
  show: boolean;
  handleClose: () => void;
  refreshviolation?: () => void; // Optional prop
  violationId: number | null; //violation id 

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
const ModalEditVilation: React.FC<ModalEditViolationProps> = ({
  show,
  handleClose,
  refreshviolation,
  violationId,
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    type: "",
    vehicule: "",
    date: "",
    cost: 0,
    description: "",
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return dateString ? date.toISOString().slice(0, 16) : '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return dateString ? date.toISOString().split('T')[0] : '';
  };


  const [drivers, setdrivers] = useState<Driver[]>([]); // Préciser le type ici
  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`) // Remplacez '1' par l'ID de l'utilisateur
        .then((response) => response.json())
        .then((data) => setdrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));
      if (violationId) {
        fetch(`${backendUrl}/api/geop/violation_form/${violationId}`)
          .then((response) => response.json())
          .then((data) => {
            setFormData({
              conducteur: data.id_driver,
              type: data.type_violation,
              date: formatDate(data.date_violation),
              vehicule: data.vehicule,
              cost: data.cost,
              description: data.description,

            });
          })
          .catch((error) => console.error("Error fetching violation:", error));
      }
    }

  }, [show, violationId]);

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

    fetch(`${backendUrl}/api/geop/update_violation/${violationId}`, {
      method: "PUT",
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
      .then((response) => {
        if (!response.ok) {
          // Si la réponse n'est pas OK, cela signifie qu'il y a eu une erreur
          throw new Error("Erreur lors de la mise à jour de la violation.");
        }
        return response.json();
      })
      .then((data) => {
        // Afficher une notification de succès si la mise à jour a réussi
        toast.success("Violation mise à jour avec succès.", {
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

        if (refreshviolation) refreshviolation();
        handleClose();
      })
      .catch((error) => {
        // Afficher une notification d'erreur en cas de problème
        toast.error(
          `Erreur lors de la mise à jour de la violation: ${error instanceof Error ? error.message : "Erreur inattendue"
          }`,
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
        console.error("Error updating violation:", error);
      });
  };


  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Edit Violation</Modal.Title>
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
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalEditVilation;
