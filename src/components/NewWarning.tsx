import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalNewWArningProps {
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

const ModalNewWaring: React.FC<ModalNewWArningProps> = ({
  show,
  handleClose,
}) => {
  const [formData, setFormData] = useState({
    conducteur: "",
    type: "",
    date: "",
    description: "",
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
              isClearable
              placeholder="Enter Driver here"
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
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalNewWaring;
