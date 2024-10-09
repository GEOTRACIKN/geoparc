import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalEditServicingProps {
    show: boolean;
    onHide: () => void;
    id_servicing: number | null;
    onSuccess?: () => void;

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditServicing: React.FC<ModalEditServicingProps> = ({
    show,
    onHide,
    id_servicing,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        date: "",
        priority: "",
        vehicle: "",
        km: "",
        subject: "",
        client: "",
        clientPhone: "",
        receptionistName: "",
        service: "",
    });

    const { translate } = useTranslate();

    const serviceMapping: { [key: number]: string } = {
        1: "Garage",
        2: "Planification d'entretien",
        3: "Entretien",
        4: "Changement de Pneu",
        5: "Changement de Pièce",
    };

    // Fetch data from API and set form data
    const fetchServicing = async () => {
        try {
            const url = `${backendUrl}/api/geop/gmao/showservicing/${id_servicing}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                const servicing = data[0];
                setFormData({
                    date: formatDateToTimestamp(servicing.date_servicing), 
                    priority: servicing.priority,
                    vehicle: servicing.vehicule,
                    km: servicing.km,
                    subject: servicing.subject,
                    client: servicing.client,
                    clientPhone: servicing.phone_client,
                    receptionistName: servicing.receptionist_name,
                    service: servicing.service.toString(),
                });
            } else {
                console.warn('No servicing data found for the provided ID.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchServicing();
        }
    }, [show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };


    const handleUpdate = async () => {
        try {
            const url = `${backendUrl}/api/geop/gmao/updateservicing/${id_servicing}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Update successful:', result);
    
            // Afficher une notification de succès
            toast.success("Servicing updated successfully!", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,

            });
        // Rafraîchir les données
        if (onSuccess) {
            onSuccess(); // Appel du callback pour rafraîchir le tableau
        }
            onHide(); // Fermer la modal après une mise à jour réussie
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
    
            // Afficher une notification d'erreur
            toast.error("Error updating servicing. Please try again.", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,

            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Edit Request")}</Modal.Title>
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
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="priority">
                        <Form.Label>{translate("Priority")}</Form.Label>
                        <Form.Control as="select" value={formData.priority} onChange={handleChange}>
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
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="km">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={translate("Enter km")}
                            value={formData.km}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="subject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter subject")}
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="client">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter client name")}
                            value={formData.client}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="clientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter client phone")}
                            value={formData.clientPhone}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="receptionistName">
                        <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter receptionist's name")}
                            value={formData.receptionistName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="service">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control as="select" value={formData.service} onChange={handleChange}>
                            <option value="">{translate("Select Service")}</option>
                            {Object.entries(serviceMapping).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        {translate("Update")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEditServicing;
