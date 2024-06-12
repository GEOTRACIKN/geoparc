import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Form } from "react-bootstrap";
import Select from "react-select";

type ModalProps = {
  onClose: () => void;
  show: boolean;
  refreshSinisters?: () => void; // Optional prop
};
const backendUrl = process.env.REACT_APP_BACKEND_URL;
type Vehicle = {
  id_vehicule: number;
  id_groupe: number;
  immatriculation_vehicule: string;
};

const NewSinisterModal: React.FC<ModalProps> = ({ onClose, show,refreshSinisters  }) => {
  const [formData, setFormData] = useState({
    sinister_type: "",
    lieu: "",
    dateHeure: "",
    vehiculeA: 0,
    conducteurA: "",
    vehiculeB: "",
    conducteurB: "",
    numPV: "",
    circonstances: "",
    degat: "",
    sinister_cost: 0.00,
    etatsinistre: "",
    expertise_date: "",
    expertise_cost: 0.00,
    proforma_number: "",
    expert_name: "",
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Préciser le type ici
  const geopuserID = localStorage.getItem("GeopUserID");

  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/vehicles_sinister/21`) // Remplacez '1' par l'ID de l'utilisateur
        .then((response) => response.json())
        .then((data) => setVehicles(data))
        .catch((error) => console.error("Error fetching vehicles:", error));
    }
  }, [show]);

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0; // Convertir en nombre
    setFormData({ ...formData, [name]: value });
  };

  // Fonction pour mettre à jour les valeurs sélectionnées dans les Select
  const handleSelectChange2 = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : ""; // Assurez-vous de récupérer la valeur sélectionnée correctement
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/geop/add_sinister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_vehicule: formData.vehiculeA,
          id_groupe: vehicleOptions.find((option) => option.value === formData.vehiculeA)?.id_groupe || 0,
          driver_name: formData.conducteurA,
          sinister_type: formData.sinister_type,
          sinister_detail: formData.etatsinistre,
          sinister_datetime: formData.dateHeure,
          sinister_location: formData.lieu,
          sinister_report: formData.numPV,
          circumstances: formData.circonstances,
          damage_caused: formData.degat,
          sinister_cost: formData.sinister_cost,
          driver_name_2: formData.conducteurB,
          vehicle_registration_2: formData.vehiculeB,
          expertise_date: formData.expertise_date,
          expertise_cost: formData.expertise_cost,
          proforma_number: formData.proforma_number,
          expert_name: formData.expert_name,
          doc_transmitted: "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sinister added successfully:", data);
        if (refreshSinisters) {
          refreshSinisters();
        }
        onClose();
      } else {
        console.error("Failed to add sinister:", response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding sinister:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id_vehicule,
    label: vehicle.immatriculation_vehicule,
    id_groupe: vehicle.id_groupe,
  }));

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nouveau sinistre</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
      <Form.Group controlId="sinister_type">
          <Form.Label>Type sinistre</Form.Label>
          <Select
            options={[
              { value: "", label: "Type sinistre" },
              { value: "Accident", label: "Accident" },
              { value: "Bris de glace", label: "Bris de glace" },
              { value: "Incendie", label: "Incendie" },
            ]}
            name="sinister_type"
            value={{
              value: formData.sinister_type,
              label: formData.sinister_type,
            }}
            onChange={handleSelectChange2}
          />
        </Form.Group>
        <Form.Group controlId="lieu">
          <Form.Label>Lieu</Form.Label>
          <Form.Control
            type="text"
            name="lieu"
            value={formData.lieu}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="dateHeure">
          <Form.Label>Date et heure</Form.Label>
          <Form.Control
            type="datetime-local"
            name="dateHeure"
            value={formData.dateHeure}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Add other form fields similarly */}

        <Form.Group controlId="vehiculeA">
          <Form.Label>Véhicule A</Form.Label>
          <Select
            options={vehicleOptions}
            name="vehiculeA"
            value={vehicleOptions.find(
              (option) => option.value === formData.vehiculeA
            )}
            onChange={handleSelectChange}
          />
        </Form.Group>

        <Form.Group controlId="conducteurA">
          <Form.Label>conducteur A</Form.Label>
          <Form.Control
            type="text"
            name="conducteurA"
            value={formData.conducteurA}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="vehiculeB">
          <Form.Label>vehicule B</Form.Label>
          <Form.Control
            type="text"
            name="vehiculeB"
            value={formData.vehiculeB}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="conducteurB">
          <Form.Label>conducteur B</Form.Label>
          <Form.Control
            type="text"
            name="conducteurB"
            value={formData.conducteurB}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="numPV">
          <Form.Label>num PV</Form.Label>
          <Form.Control
            type="text"
            name="numPV"
            value={formData.numPV}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="circonstances">
          <Form.Label>circonstances</Form.Label>
          <Form.Control
            type="text"
            name="circonstances"
            value={formData.circonstances}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="degat">
          <Form.Label>degat</Form.Label>
          <Form.Control
            type="text"
            name="degat"
            value={formData.degat}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="sinister_cost">
          <Form.Label>Coût</Form.Label>
          <Form.Control
            type="number"
            step="0"
            name="sinister_cost"
            value={formData.sinister_cost}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="etatsinistre">
          <Form.Label>Etat sinistre</Form.Label>
          <Select
            options={[
              { value: "", label: "etat sinistre" },
              { value: "En cours de constat", label: "En cours de constat" },
              {
                value: "En cours de déclaration",
                label: "En cours de déclaration",
              },
              {
                value: "En cours de consultation expert",
                label: "En cours de consultation d'expert",
              },
              {
                value: "En cours de mise à jour de réparation",
                label: "En cours de mise à jour de réparation",
              },
              { value: "Remboursement", label: "Remboursement" },
            ]}
            name="etatsinistre"
            value={{
              value: formData.etatsinistre,
              label: formData.etatsinistre,
            }}
            onChange={handleSelectChange2}
          />
        </Form.Group>
        <Form.Group controlId="expertise_date">
          <Form.Label>Date de l'expertise</Form.Label>
          <Form.Control
            type="date"
            name="expertise_date"
            value={formData.expertise_date}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="expertise_cost">
          <Form.Label>Coût de l'expertise</Form.Label>
          <Form.Control
            type="number"
            step="0"
            name="expertise_cost"
            value={formData.expertise_cost}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="proforma_number">
          <Form.Label>Numéro de proforma</Form.Label>
          <Form.Control
            type="text"
            name="proforma_number"
            value={formData.proforma_number}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="expert_name">
          <Form.Label>Nom de l'expert</Form.Label>
          <Form.Control
            type="text"
            name="expert_name"
            value={formData.expert_name}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-default"
          onClick={handleSubmit}
        >
          Ajouter
        </button>
        <button type="button" className="btn btn-default" onClick={onClose}>
          Fermer
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewSinisterModal;
