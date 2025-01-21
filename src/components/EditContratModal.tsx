// src/ModalContrat.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalEditContratProps {
  show: boolean;
  handleClose: () => void;
  refreshContrat?: () => void; // Optional prop
  contratId: number | null; // ID du contrat à modifier
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};

const typeContratOptions = [
  { value: "CDI", label: "CDI" },
  { value: "CDD", label: "CDD" },
  { value: "Temporaire", label: "Temporaire" },
  // Ajoutez les autres options ici
];
const categorieOptions = [
  { value: "category 0", label: "category 0" },
  { value: "category 1", label: "category 1" },
  { value: "category 2", label: "category 2" },
  { value: "category 3", label: "category 3" },
  { value: "category 4", label: "category 4" },
  { value: "category 5", label: "category 5" },
  { value: "category 6", label: "category 6" },
  { value: "category 7", label: "category 7" },
  { value: "category 8", label: "category 8" },
  { value: "category 9", label: "category 9" },
  // Ajoutez les autres options ici
];

const ModalEditContrat: React.FC<ModalEditContratProps> = ({
  show,
  handleClose,
  refreshContrat,
  contratId,
}) => {
  const [formData, setFormData] = useState({
    conducteur: 0,
    date_debut: "",
    rh_refererence: "",
    date_fin: "",
    type_contrat: "",
    category: "",
    basesalary: "",
    insurance: "",
    tax_income: "",
    salary_bonus: "",
    rate_bonus: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return dateString ? date.toISOString().slice(0, 16) : '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return dateString ? date.toISOString().split('T')[0] : '';
  };


  useEffect(() => {
    if (show) {
      fetch(`${backendUrl}/api/geop/Conducteur_contrat/${geopuserID}`)
        .then((response) => response.json())
        .then((data) => setDrivers(data))
        .catch((error) => console.error("Error fetching Drivers:", error));

      if (contratId) {
        fetch(`${backendUrl}/api/geop/Contrat_form/${contratId}`)
          .then((response) => response.json())
          .then((data) => {
            setFormData({
              conducteur: data.id_conducteur,
              date_debut: formatDate(data.date_debut_contrat),
              rh_refererence: data.ref_rh,
              date_fin: formatDate(data.date_fin_contrat),
              type_contrat: data.type_contrat,
              category: data.categorie_c,
              basesalary: data.salaire_base_c,
              insurance: data.assurance_c,
              tax_income: data.irg_c,
              salary_bonus: data.prime_salariale_c,
              rate_bonus: data.prime_forf_c,
            });
          })
          .catch((error) => console.error("Error fetching Contrat:", error));
      }
    }
  }, [show, contratId]);

  const handleSelectChange2 = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    const value = selectedOption ? Number(selectedOption.value) : 0;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/geop/update_contrat/${contratId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_conducteur: formData.conducteur,
            date_debut_contrat: formData.date_debut,
            ref_rh: formData.rh_refererence,
            date_fin_contrat: formData.date_fin,
            type_contrat: formData.type_contrat,
            categorie_c: formData.category,
            salaire_base_c: formData.basesalary,
            assurance_c: formData.insurance,
            irg_c: formData.tax_income,
            prime_salariale_c: formData.salary_bonus,
            prime_forf_c: formData.rate_bonus,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Contrat updated successfully:", data);
        if (refreshContrat) {
          refreshContrat();
        }
        handleClose();
      } else {
        console.error("Failed to update Contrat:", response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating contrat:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const conducteursOptions = drivers.map((driver) => ({
    value: driver.id_conducteur,
    label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
  }));

  return (
    <Modal show={show} onHide={handleClose} responsive>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contrat</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
        >
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
              onChange={handleSelectChange2}
              name="type_contrat"
              value={typeContratOptions.find(
                (option) => option.value === formData.type_contrat
              )}
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
              onChange={handleSelectChange2}
              name="category"
              value={categorieOptions.find(
                (option) => option.value === formData.category
              )}
              isClearable
            />
          </Form.Group>
          <Form.Group controlId="basesalary">
            <Form.Label>base salary</Form.Label>
            <Form.Control
              type="text"
              name="basesalary"
              value={formData.basesalary}
              onChange={handleInputChange}
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
          <Form.Group controlId="salary_bonus">
            <Form.Label>Salary Bonus</Form.Label>
            <Form.Control
              type="text"
              name="salary_bonus"
              value={formData.salary_bonus}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="rate_bonus">
            <Form.Label>Flat rate bonus</Form.Label>
            <Form.Control
              type="text"
              name="rate_bonus"
              value={formData.rate_bonus}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditContrat;
