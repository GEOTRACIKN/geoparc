import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "./LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";

interface ModalNewInterventionnProps {
    show: boolean;
    onHide: () => void;
    refreshintervention?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalNewIntervention: React.FC<ModalNewInterventionnProps> = ({
    show,
    onHide,
    refreshintervention,
}) => {
    const [formData, setFormData] = useState({
        date: "",
        priority: "",
        vehicle: "",
        mileage: "",
        subject: "",
        client: "",
        clientPhone: "",
        receptionistName: "",
        service: 0, // Changer de string à number
    });

    const { translate } = useTranslate();

    const serviceOptions: { [key: string]: number } = {
        "Garage": 1,
        "Planification d'entretien": 2,
        "Entretien": 3,
        "Changement De Pneu": 4,
        "Changement de Pièce": 5,
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "service") {
            // Convertir la valeur sélectionnée en nombre
            const serviceId = serviceOptions[value] || 0;
            setFormData(prevState => ({
                ...prevState,
                [id]: serviceId,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
            }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = formatDateToTimestamp(formData.date);

        // Mettre à jour formData avec la date formatée
        const updatedFormData = {
            ...formData,
            date: formattedDate,
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewintervention/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de l'ajout de l'intervention.");
            }

            const result = await response.json();
            console.log(result);

            // Réinitialiser le formulaire
            setFormData({
                date: "",
                priority: "",
                vehicle: "",
                mileage: "",
                subject: "",
                client: "",
                clientPhone: "",
                receptionistName: "",
                service: 0,
            });

            // Fermer le modal
            onHide();

            // Rafraîchir les interventions si la fonction est fournie
            if (refreshintervention) {
                refreshintervention();
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("New Request")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                    <Form.Group controlId="date">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="priority">
                        <Form.Label>{translate("Priority")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Priority")}</option>
                            <option value="Normal">{translate("Normal")}</option>
                            <option value="Urgent">{translate("Urgent")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="vehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le véhicule"
                            value={formData.vehicle}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="mileage">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le kilométrage"
                            value={formData.mileage}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="subject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez l'objet de la demande"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="client">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du client"
                            value={formData.client}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="clientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le numéro de téléphone du client"
                            value={formData.clientPhone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="receptionistName">
                        <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du réceptionniste"
                            value={formData.receptionistName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="service">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={Object.keys(serviceOptions).find(key => serviceOptions[key] === formData.service) || ""}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Service")}</option>
                            {Object.entries(serviceOptions).map(([key, value]) => (
                                <option key={value} value={key}>{translate(key)}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewIntervention;
