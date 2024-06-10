// src/ModalContrat.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalNewContratProps {
  show: boolean;
  handleClose: () => void;
}

const conducteursOptions = [
  { value: "1381", label: "BENMILOUD MOSSA" },
  { value: "1380", label: "ATHAMNA HAKIM" },
  { value: "1379", label: "MEHABA CHERIF" },
  { value: "1378", label: "ABID YAYA" },
  // Ajoutez les autres options ici
];
const typeContratOptions = [
  { value: "1", label: "FTC" },
  { value: "2", label: "PC" },
  { value: "3", label: "Temporary" },
  // Ajoutez les autres options ici
];
const categorieOptions = [
  { value: "0", label: "category 0" },
  { value: "1", label: "category 1" },
  { value: "2", label: "category 2" },
  { value: "3", label: "category 3" },
  { value: "4", label: "category 4" },
  { value: "5", label: "category 5" },
  { value: "6", label: "category 6" },
  { value: "7", label: "category 7" },
  { value: "8", label: "category 8" },
  { value: "9", label: "category 9" },
  // Ajoutez les autres options ici
];

const ModalNewContrat: React.FC<ModalNewContratProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    conducteur: "",
    date_debut: "",
    rh_refererence: "",
    date_fin: "",
    category: "",
    basesalary: "",
    insurance: "",
    tax_income: "",
  });

  const handleSelectChange = (selectedOption: any) => {
    console.log("Selected option:", selectedOption);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Contrat</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Driver</Form.Label>
            <Select
              options={conducteursOptions}
              onChange={handleSelectChange}
              name="conducteur"
              isClearable
            />
          </Form.Group>

          <Form.Group controlId="date_debut">
            <Form.Label>Start date</Form.Label>
            <Form.Control
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="rh_refererence">
            <Form.Label>HR Reference</Form.Label>
            <Form.Control
              type="text"
              name="rh_refererence"
              value={formData.rh_refererence}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contrat Type</Form.Label>
            <Select
              options={typeContratOptions}
              onChange={handleSelectChange}
              name="typecontrat"
              isClearable
            />
          </Form.Group>

          <Form.Group controlId="date_fin">
            <Form.Label>End date</Form.Label>
            <Form.Control
              type="date"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>category</Form.Label>
            <Select
              options={categorieOptions}
              onChange={handleSelectChange}
              name="category"
              isClearable
            />
          </Form.Group>
          <Form.Group controlId="insurance">
            <Form.Label>insurance</Form.Label>
            <Form.Control
              type="text"
              name="insurance"
              value={formData.insurance}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="tax_income">
            <Form.Label>TGI</Form.Label>
            <Form.Control
              type="text"
              name="tax_income"
              value={formData.tax_income}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="rh_refererence">
            <Form.Label>HR Reference</Form.Label>
            <Form.Control
              type="text"
              name="rh_refererence"
              value={formData.rh_refererence}
              onChange={handleInputChange}
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

export default ModalNewContrat;
