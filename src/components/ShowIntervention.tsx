import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "./LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";

interface ModalShowInterventionnProps {
    show: boolean;
    handleClose: () => void;
    id_intervention: number | null; // Accepte également null

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const ModalShowIntervention: React.FC<ModalShowInterventionnProps> = ({
    show,
    handleClose,
    id_intervention,

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
        service: "",
    });

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchIntervention = async () => {
        try {
            const url = `${backendUrl}/api/geop/showintervention/${id_intervention}`;
            console.log('Request URL:', url);
    
            const response = await fetch(url);
    
            // Vérifiez le statut de la réponse
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            console.log('Data:', data);
            console.log('Data length:', data.length);
    
            if (data.length > 0) {
                const intervention = data[0];
                setFormData({
                    date: formatDateToTimestamp(intervention.date_intervention), 
                    priority: intervention.priority,
                    vehicle: intervention.vehicule,
                    mileage: intervention.km,
                    subject: intervention.subject,
                    client: intervention.client,
                    clientPhone: intervention.phone_client,
                    receptionistName: intervention.receptionist_name,
                    service: intervention.service
                });
            } else {
                console.warn('No intervention data found for the provided ID.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    

    useEffect(() => {
        if (show) {
            fetchIntervention();
        }
    }, [show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show Request")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                    <Form.Group controlId="date">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date}
                            readOnly // Rend le champ non modifiable
                        />
                    </Form.Group>

                    <Form.Group controlId="priority">
                        <Form.Label>{translate("Priority")}</Form.Label>
                        <Form.Control as="select" value={formData.priority} disabled >
                            <option value="">{translate("Select Priority")}</option>
                            <option value="Normal">{translate("Normal")}</option>
                            <option value="Urgent">{translate("Urgent")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="vehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter vehicle")}
                            value={formData.vehicle}
                            readOnly               
                                 />
                    </Form.Group>

                    <Form.Group controlId="mileage">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={translate("Enter mileage")}
                            value={formData.mileage}
                            readOnly  
                                                  />
                    </Form.Group>

                    <Form.Group controlId="subject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter subject")}
                            value={formData.subject}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="client">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter client name")}
                            value={formData.client}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="clientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter client phone")}
                            value={formData.clientPhone}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="receptionistName">
                        <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter receptionist's name")}
                            value={formData.receptionistName}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="service">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control as="select" value={formData.service} disabled>
                            <option value="">{translate("Select Service")}</option>
                            <option value="Garage">{translate("Garage")}</option>
                            <option value="Planification d'entretien">{translate("Planification d'entretien")}</option>
                            <option value="Entretiens">{translate("Entretiens")}</option>
                            <option value="Changement De Pneu">{translate("Changement De Pneu")}</option>
                            <option value="Changement de Pièce">{translate("Changement de Pièce")}</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Close")}
                    </Button>
                  
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalShowIntervention;
