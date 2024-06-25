import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Select from "react-select";

import { ModalProps } from 'react-bootstrap';


type EditSinisterModalProps = ModalProps & {
    show: boolean;
    onClose: () => void;
    sinisterToEdit: any | null; // Assuming Sinister is the type for your sinister data
    refreshSinisters?: () => void; // Optional prop
  };
const backendUrl = process.env.REACT_APP_BACKEND_URL;

type Vehicle = {
  id_vehicule: number;
  id_groupe: number;
  immatriculation_vehicule: string;
}

const EditSinisterModal: React.FC<EditSinisterModalProps> = ({ show, onClose, sinisterToEdit,refreshSinisters }) => {
    const [formData, setFormData] = useState({
    sinister_type: '',
    lieu: '',
    dateHeure: '',
    vehiculeA: 0,
    conducteurA: '',
    vehiculeB: '',
    conducteurB: '',
    numPV: '',
    circonstances: '',
    degat: '',
    sinister_cost: 0.00,
    etatsinistre: '',
    expertise_date: '',
    expertise_cost: 0.00,
    proforma_number: '',
    expert_name: '',
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const geopuserID = localStorage.getItem("GeopUserID");

  useEffect(() => {
    if (show && sinisterToEdit) {
      // Function to format date and time
      const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return dateString ? date.toISOString().slice(0, 16) : '';
      };

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return dateString ? date.toISOString().split('T')[0] : '';
      };

      setFormData({
        sinister_type: sinisterToEdit.sinister_type || '',
        lieu: sinisterToEdit.sinister_location || '',
        dateHeure: formatDateTime(sinisterToEdit.sinister_datetime) || '',
        vehiculeA: sinisterToEdit.id_vehicule || 0,
        conducteurA: sinisterToEdit.driver_name || '',
        vehiculeB: sinisterToEdit.vehicle_registration_2 || '',
        conducteurB: sinisterToEdit.driver_name_2 || '',
        numPV: sinisterToEdit.sinister_report || '',
        circonstances: sinisterToEdit.circumstances || '',
        sinister_cost: sinisterToEdit.sinister_cost  || '',
        degat: sinisterToEdit.damage_caused || '',
        etatsinistre: sinisterToEdit.sinister_detail || '',
        expertise_date: formatDate(sinisterToEdit.expertise_date) || '',
        expertise_cost: sinisterToEdit.expertise_cost || 0.00,
        proforma_number: sinisterToEdit.proforma_number || '',
        expert_name: sinisterToEdit.expert_name || '',
      });

      fetch(`${backendUrl}/api/geop/vehicles_sinister/${geopuserID}`)
        .then(response => response.json())
        .then(data => setVehicles(data))
        .catch(error => console.error('Error fetching vehicles:', error));
    }
  }, [show, sinisterToEdit]);

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange2 = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const endpoint = `${backendUrl}/api/geop/update_sinister/${sinisterToEdit.id_sinistre}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_vehicule: formData.vehiculeA,
          id_groupe: vehicleOptions.find(option => option.value === formData.vehiculeA)?.id_groupe || 0,
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
          doc_transmitted: ''
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Sinister updated successfully:', data);
        if (refreshSinisters) {
          refreshSinisters();
        }
        onClose();
      } else {
        console.error("Failed to update sinister:", response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating sinister:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.id_vehicule,
    label: vehicle.immatriculation_vehicule,
    id_groupe: vehicle.id_groupe,
  }));

  return (
    <Modal show={show} onHide={onClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Edit Sinister</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="sinister_type">
          <Form.Label>Type Sinister</Form.Label>
          <Select
            options={[
              { value: '', label: 'Type Sinister' },
              { value: 'Accident', label: 'Accident' },
              { value: 'Bris de glace', label: 'Bris de glace' },
              { value: 'Incendie', label: 'Incendie' }
            ]}
            name="sinister_type"
            value={{ value: formData.sinister_type, label: formData.sinister_type }}
            onChange={handleSelectChange2}
          />
        </Form.Group>
        <Form.Group controlId="lieu">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="lieu"
            value={formData.lieu}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="dateHeure">
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="dateHeure"
            value={formData.dateHeure}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="vehiculeA">
          <Form.Label>Vehicle A</Form.Label>
          <Select
            options={vehicleOptions}
            name="vehiculeA"
            value={vehicleOptions.find(option => option.value === formData.vehiculeA)}
            onChange={handleSelectChange}
          />
        </Form.Group>
        <Form.Group controlId="conducteurA">
          <Form.Label>Driver A</Form.Label>
          <Form.Control
            type="text"
            name="conducteurA"
            value={formData.conducteurA}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="vehiculeB">
          <Form.Label>Vehicle B</Form.Label>
          <Form.Control
            type="text"
            name="vehiculeB"
            value={formData.vehiculeB}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="conducteurB">
          <Form.Label>Driver B</Form.Label>
          <Form.Control
            type="text"
            name="conducteurB"
            value={formData.conducteurB}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="numPV">
          <Form.Label>Report Number</Form.Label>
          <Form.Control
            type="text"
            name="numPV"
            value={formData.numPV}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="circonstances">
          <Form.Label>Circumstances</Form.Label>
          <Form.Control
            type="text"
            name="circonstances"
            value={formData.circonstances}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="degat">
          <Form.Label>Damage Caused</Form.Label>
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
            step="0.00"
            name="sinister_cost"
            value={formData.sinister_cost}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="etatsinistre">
          <Form.Label>Sinister State</Form.Label>
          <Select
            options={[
              { value: '', label: 'Sinister State' },
              { value: 'En cours de constat', label: 'In Progress of Report' },
              { value: 'En cours de déclaration', label: 'In Progress of Declaration' },
              { value: 'En cours de consultation expert', label: 'In Progress of Expert Consultation' },
              { value: 'En cours de mise à jour de réparation', label: 'In Progress of Repair Update' },
              { value: 'Remboursement', label: 'Reimbursement' }
            ]}
            name="etatsinistre"
            value={{ value: formData.etatsinistre, label: formData.etatsinistre }}
            onChange={handleSelectChange2}
          />
        </Form.Group>
        <Form.Group controlId="expertise_date">
          <Form.Label>Expertise Date</Form.Label>
          <Form.Control
            type="date"
            name="expertise_date"
            value={formData.expertise_date}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="expertise_cost">
          <Form.Label>Expertise Cost</Form.Label>
          <Form.Control
            type="number"
            step="0.00"
            name="expertise_cost"
            value={formData.expertise_cost}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="proforma_number">
          <Form.Label>Proforma Number</Form.Label>
          <Form.Control
            type="text"
            name="proforma_number"
            value={formData.proforma_number}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="expert_name">
          <Form.Label>Expert Name</Form.Label>
          <Form.Control
            type="text"
            name="expert_name"
            value={formData.expert_name}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-default" onClick={handleSubmit}>
          Update
        </button>
        <button type="button" className="btn btn-default" onClick={onClose}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSinisterModal;
