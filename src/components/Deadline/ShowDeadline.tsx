import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from "moment";

interface ModalShowDeadlineProps {
  show: boolean;
  onHide: () => void;
  id_deadline: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowDeadline: React.FC<ModalShowDeadlineProps> = ({
  show,
  onHide,
  id_deadline,
}) => {
  const [formData, setFormData] = useState({
    id_deadline: "",
    id_type: "",
    id_user: "",
    date_deadline: "",
    date_creation: "",
    description: "",
    nom_type: "",
    status: "",
    id_item: "",
    item_name: "",
    nom_conducteur: "",
    prenom_conducteur: "",
    immatriculation_vehicule: "",
    training_id_conducteur: "",
    training_nom_conducteur: "",
    training_prenom_conducteur: "",
    feu_id_vehicule: "",
    feu_immatriculation_vehicule: "",
  });

  const { translate } = useTranslate();

  const getDeadlineById = async (id_deadline: number) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/geop/deadline/find/${id_deadline}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Error retrieving deadline");
      }

      const deadline = await response.json();
      return deadline || null;
    } catch (error) {
      console.error("Error retrieving deadline :", error);
      return null;
    }
  };

  useEffect(() => {
    if (show && id_deadline) {
      getDeadlineById(id_deadline).then((deadline) => {
        if (deadline) {
          setFormData({
            id_deadline: deadline.id_deadline || "",
            id_type: deadline.id_type || "",
            id_user: deadline.id_user || "",
            date_deadline: deadline.date_deadline
              ? moment(deadline.date_deadline).format("YYYY-MM-DD")
              : "",
            date_creation: deadline.date_creation
              ? moment(deadline.date_creation).format("YYYY-MM-DD")
              : "",
            description: deadline.description || "",
            nom_type: deadline.nom_type || "",
            status: deadline.status || "",
            id_item: deadline.id_item || "",
            item_name: deadline.item_name || "",
            nom_conducteur: deadline.nom_conducteur || "",
            prenom_conducteur: deadline.prenom_conducteur || "",
            immatriculation_vehicule: deadline.immatriculation_vehicule || "",
            training_id_conducteur: deadline.training_id_conducteur || "",
            training_nom_conducteur: deadline.training_nom_conducteur || "",
            training_prenom_conducteur: deadline.training_prenom_conducteur || "",
            feu_id_vehicule: deadline.feu_id_vehicule || "",
            feu_immatriculation_vehicule: deadline.feu_immatriculation_vehicule || "",
          });
        }
      });
    }
  }, [show, id_deadline]);

  // Génération automatique de la description avec traduction
  const generatedDescription = (() => {
    const highlight = (value: any) => <span className="text-blue-500 font-semibold">{value}</span>;

    switch (parseInt(formData.id_type)) {
      case 1: // Driving license
        return (
          <>
            {translate("The driving license of")} {highlight(formData.nom_conducteur)} {highlight(formData.prenom_conducteur)}{" "}
            {translate("will expire on")} {highlight(formData.date_deadline)}
          </>
        );

      case 2: // Vehicle insurance
        return (
          <>
            {translate("The insurance for")} {highlight(formData.id_item)} ({highlight(formData.item_name)}){" "}
            {translate("will expire on")} {highlight(formData.date_deadline)}
          </>
        );

      case 3: // Maintenance
        return (
          <>
            {translate("The next maintenance for vehicle")} {highlight(formData.immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(formData.date_deadline)}
          </>
        );

      case 4: // Training
        return (
          <>
            {translate("The training certificate of")} {highlight(formData.training_nom_conducteur)}{" "}
            {highlight(formData.training_prenom_conducteur)} {translate("will expire on")} {highlight(formData.date_deadline)}
          </>
        );

      case 5: // Fire extinguisher verification
        return (
          <>
            {translate("The fire extinguisher verification for vehicle")} {highlight(formData.feu_immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(formData.date_deadline)}
          </>
        );

      case 6: // Technical control
        return (
          <>
            {translate("The technical inspection for vehicle")} {highlight(formData.immatriculation_vehicule)}{" "}
            {translate("must be done before")} {highlight(formData.date_deadline)}
          </>
        );

      case 7: // Sticker
        return (
          <>
            {translate("The vehicle sticker verification for")} {highlight(formData.immatriculation_vehicule)}{" "}
            {translate("should be done by")} {highlight(formData.date_deadline)}
          </>
        );

      case 8: // Draining
        return (
          <>
            {translate("The draining verification for vehicle")} {highlight(formData.immatriculation_vehicule)}{" "}
            {translate("is scheduled for")} {highlight(formData.date_deadline)}
          </>
        );

      default:
        return (
          <>
            {translate("The deadline for")} {highlight(formData.id_item)} ({highlight(formData.item_name)}){" "}
            {translate("is set for")} {highlight(formData.date_deadline)}
          </>
        );
    }
  })();

  return (
    <Modal show={show} onHide={onHide} responsive>
      <Modal.Header closeButton>
        <Modal.Title>{translate("Show")}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}>
        <Form style={{
          color: "#000",
          fontSize: "16px"
        }}>
          <Form.Group>
            <Form.Label>{translate("Deadline date")} :</Form.Label>
            <p className="form-text">{formData.date_deadline}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Creation date")} :</Form.Label>
            <p className="form-text">{formData.date_creation}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Type")} :</Form.Label>
            <p className="form-text">{translate("formData.nom_type")}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Description")} :</Form.Label>
            <p className="form-text">{<>{generatedDescription}</>}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Status")} :</Form.Label>
            <p className="form-text">{translate(formData.status)}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Deadline for")} :</Form.Label>
            <p className="form-text">{formData.id_item} - {formData.item_name}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>{translate("Conducteur")} :</Form.Label>
            <p className="form-text">
              {formData.nom_conducteur} {formData.prenom_conducteur} - {formData.immatriculation_vehicule}
            </p>
          </Form.Group>

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {translate("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalShowDeadline;
