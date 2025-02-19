import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from "moment"; // Importation de moment.js

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
    id_user: "",
    date_deadline: "",
    date_creation: "",
    description: "",
    nom_type: "",
    status: "",
    id_item: "",
    item_name: "",
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
        throw new Error("Erreur lors de la récupération de la deadline");
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
            item_name:deadline.item_name|| "",
          });
        }
      });
    }
  }, [show, id_deadline]);

  return (
    <Modal show={show} onHide={onHide} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show")}</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}>
                <Form>
                    {/* Champ ID Utilisateur */}
                   

                    {/* Champ Date de début */}
                    <Form.Group>
                        <Form.Label>{translate("Deadline date")} :</Form.Label>
                        <p className="form-text">{formData.date_deadline}</p>
                    </Form.Group>

                    {/* Champ Date de fin */}
                    <Form.Group>
                        <Form.Label>{translate("Creation date")} :</Form.Label>
                        <p className="form-text">{formData.date_creation}</p>
                    </Form.Group>

                    {/* Champ Type */}
                    <Form.Group>
                        <Form.Label>{translate("Type")} :</Form.Label>
                        <p className="form-text">{formData.nom_type}</p>
                    </Form.Group>

                    {/* Champ Description */}
                    <Form.Group>
                        <Form.Label>{translate("Description")} :</Form.Label>
                        <p className="form-text">{formData.description}</p>
                    </Form.Group>

                    {/* Champ Statut */}
                    <Form.Group>
                        <Form.Label>{translate("Status")} :</Form.Label>
                        <p className="form-text">{formData.status}</p>
                    </Form.Group>

                    {/* Champ ID de l'élément concerné */}
                    <Form.Group>
                        <Form.Label>{translate("Deadline for")} :</Form.Label>
                        <p className="form-text">{formData.item_name}</p>
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
