import React, { useState, ChangeEvent } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Select from "react-select";


type ModalProps = {
  onClose: () => void;
  show: boolean;
};

const NewSinisterModal: React.FC<ModalProps> = ({ onClose, show }) => {
  const [formData, setFormData] = useState({
    typeSinistre: '',
    lieu: '',
    dateHeure: '',
    vehiculeA: '',
    conducteurA:'',
    vehiculeB: '',
    conducteurB: '',
    numPV: '',
    circonstances: '',
    degat: '',
    etatsinistre: '',
  });

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nouveau sinistre</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Group controlId="typeSinistre">
  <Form.Label>Type sinistre</Form.Label>
  <Select
    options={[
      { value: '', label: 'Type sinistre' },
      { value: 'Accident', label: 'Accident' },
      { value: 'Bris de glace', label: 'Bris de glace' },
      { value: 'Incendie', label: 'Incendie' }
    ]}
    name="typeSinistre"
    value={{ value: formData.typeSinistre, label: formData.typeSinistre }}
    onChange={handleSelectChange}
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


        <Form.Group controlId="VehiculeA">
  <Form.Label>Véhicule A</Form.Label>
  <Select
    options={[
      { value: '', label: 'XYZ789' },
      { value: 'LMN456', label: 'LMN456' },
      { value: 'QWE123', label: 'QWE123' },
      { value: 'JKL789', label: 'JKL789' }
    ]}
    name="VehiculeA"
    value={{ value: formData.vehiculeA, label: formData.vehiculeA }}
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
      <Form.Group controlId="etatsinistre">
  <Form.Label>Type sinistre</Form.Label>
  <Select
  options={[
    { value: '', label: 'etat sinistre' },
    { value: 'En cours de constat', label: 'En cours de constat' },
    { value: 'En cours de déclaration', label: 'En cours de déclaration' },
    { value: 'En cours de consultation expert', label: 'En cours de consultation d\'expert' },
    { value: 'En cours de mise à jour de réparation', label: 'En cours de mise à jour de réparation' },
    { value: 'Remboursement', label: 'Remboursement' }
  ]}
  name="etatsinistre"
  value={{ value: formData.etatsinistre, label: formData.etatsinistre }}
  onChange={handleSelectChange}
/>


</Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <button type="submit" className="btn btn-default" name="insertSinistre">Ajouter</button>
        <button type="button" className="btn btn-default" onClick={onClose}>Fermer</button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewSinisterModal;
