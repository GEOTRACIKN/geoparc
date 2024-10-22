import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalEditPlanninginterviewsProps {
    show: boolean;
    onHide: () => void;
    id_planning: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditPlanninginterviews: React.FC<
    ModalEditPlanninginterviewsProps
> = ({ show, onHide, id_planning, onSuccess }) => {
    const [formData, setFormData] = useState({
        date_planification: "",
        vehicle: "",
        km: "",
        date_dentretien: "",
        type_entretien: "",
    });

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchPlanninginterview = async () => {
        try {
            const url = `${backendUrl}/api/geop/fetchplanninginterview/${id_planning}`;
            const response = await fetch(url);

            const data = await response.json();
            if (data.length > 0) {
                const planninginterview = data[0];
                setFormData({
                    date_planification: formatDateToTimestamp(
                        planninginterview.date_planification
                    ),
                    vehicle: planninginterview.vehicule,
                    km: planninginterview.km,
                    date_dentretien: formatDateToTimestamp(planninginterview.date_dentretien),
                    type_entretien: planninginterview.type_entretien,
                });
            } else {
                console.warn("No planninginterview data found for the provided ID.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchPlanninginterview();
        }
    }, [show]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Pour le champ de type de violation
    const Type_entretiens = [
        { value: "Lavage", label: translate("Lavage") },
        { value: "Vidange d'huile", label: translate("Vidange d'huile") },
        { value: "Changement filtres", label: translate("Changement filtres") },
        { value: "Vidange + filtre a air", label: translate("Vidange + filtre a air") },
        { value: "Vidange + filtre a l'huile", label: translate("Vidange + filtre a l'huile") },
        { value: "Vidange + changement de filtre", label: translate("Vidange + changement de filtre") },
        { value: "Alignement des roues", label: translate("Alignement des roues") },
        { value: "Permutation des pneumatiques", label: translate("Permutation des pneumatiques") },
        { value: "Réglage moteur", label: translate("Réglage moteur") },
        { value: "Réglage des freins", label: translate("Réglage des freins") },
        { value: "Réglage electrique", label: translate("Réglage electrique") },
        { value: "Controle", label: translate("Controle") },
        { value: "Autres", label: translate("Autres") },
    ];
    const handleViolationTypeChange = (selectedOption: any, actionMeta: any) => {
        const { name } = actionMeta;
        const value = selectedOption ? selectedOption.value : "";

        setFormData({
            ...formData,
            [name]: value,
            type_entretien: selectedOption ? selectedOption.value : "", // Met à jour l'état avec l'option sélectionnée
        });
    };


    const handleUpdate = async () => {
        try {
            // Formater la date avant de l'envoyer
            const formattedDate = formatDateToTimestamp(formData.date_dentretien);

            // Mettre à jour formData avec la date formatée
            const updatedFormData = {
                ...formData,
                date_dentretien: formattedDate,
            };
            const url = `${backendUrl}/api/geop/gmao/updateplanninginterview/${id_planning}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Afficher une notification de succès
            toast.success("planning interview updated successfully!", {
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
            console.error("Erreur lors de la mise à jour des données:", error);

            // Afficher une notification d'erreur
            toast.error("Error updating planning interview. Please try again.", {
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
                <Modal.Title>{translate("Edit planned interview")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                    <Form.Group controlId="date">
                        <Form.Label>{translate("Planning date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_planification}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="vehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={translate("Enter vehicle")}
                            value={formData.vehicle}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="km">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={translate("Enter km")}
                            value={formData.km}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="date_dentretien">
                        <Form.Label>{translate("Interview date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_dentretien}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label>{translate("Violation type")}</Form.Label>
                        <Select
                            options={Type_entretiens}
                            onChange={handleViolationTypeChange}
                            name="type"
                            value={Type_entretiens.find((option) => option.value === formData.type_entretien)}

                            isClearable
                        />
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

export default ModalEditPlanninginterviews;
