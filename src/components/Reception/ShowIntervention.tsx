import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

interface ModalViewInterventionProps {
    show: boolean;
    onHide: () => void;
    id_intervention: number | null;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const ModalViewIntervention: React.FC<ModalViewInterventionProps> = ({
    show,
    onHide,
    id_intervention,
}) => {
    const [formData, setFormData] = useState({
        date: "",
        priority: "",
        id_vehicule: "",
        km: "",
        subject: "",
        client: "",
        clientPhone: "",
        receptionistName: "",
        service: "",
    });

    const { translate } = useTranslate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const serviceMapping: { [key: number]: string } = {
        1: "Garage",
        2: "Planification d'entretien",
        3: "Entretien",
        4: "Changement de Pneu",
        5: "Changement de Pièce",
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            if (!geopuserID) return;

            try {
                const response = await fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`);
                const data = await response.json();
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };
        fetchVehicles();
    }, []);

    const fetchIntervention = async () => {
        try {
            const url = `${backendUrl}/api/geop/showintervention/${id_intervention}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.length > 0) {
                const intervention = data[0];
                setFormData({
                    date: formatDateToTimestamp(intervention.date_intervention),
                    priority: intervention.priority,
                    id_vehicule: String(intervention.id_vehicule),
                    km: intervention.km,
                    subject: intervention.subject,
                    client: intervention.client,
                    clientPhone: intervention.phone_client,
                    receptionistName: intervention.receptionist_name,
                    service: intervention.service.toString(),
                });
            }
        } catch (error) {
            console.error('Error fetching intervention:', error);
        }
    };

    useEffect(() => {
        if (show) fetchIntervention();
    }, [show]);

    const vehicleLabel = vehicles.find(
        v => String(v.id_vehicule) === String(formData.id_vehicule)
    )?.immatriculation_vehicule || "";

    return (
        <Modal show={show} onHide={onHide} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Intervention Details")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}>
                    <Form.Group controlId="date">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control value={formData.date} readOnly />
                    </Form.Group>
                    <Form.Group controlId="priority">
                        <Form.Label>{translate("Priority")}</Form.Label>
                        <Form.Control value={translate(formData.priority)} readOnly />
                    </Form.Group>
                    <Form.Group controlId="vehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control value={vehicleLabel} readOnly />
                    </Form.Group>
                    <Form.Group controlId="km">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control value={formData.km} readOnly />
                    </Form.Group>
                    <Form.Group controlId="subject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control value={formData.subject} readOnly />
                    </Form.Group>
                    <Form.Group controlId="client">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control value={formData.client} readOnly />
                    </Form.Group>
                    <Form.Group controlId="clientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control value={formData.clientPhone} readOnly />
                    </Form.Group>
                    <Form.Group controlId="receptionistName">
                        <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                        <Form.Control value={formData.receptionistName} readOnly />
                    </Form.Group>
                    <Form.Group controlId="service">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control
                            value={serviceMapping[Number(formData.service)] || ""}
                            readOnly
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalViewIntervention;
