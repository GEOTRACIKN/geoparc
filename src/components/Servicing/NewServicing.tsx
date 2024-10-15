import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalNewServicingnProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");


const ModalNewServicing: React.FC<ModalNewServicingnProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        
        invoice_no_servicing: "",
        type_servicing: 0,
        type_vehicule: "",
        date_servicing: "",
        place_servicing: "",
        cost_servicing: "",
        depreciation_servicing: "",
        km_servicing: "",
        next_oil_change_servicing: "",
    });

    const { translate } = useTranslate();

    const serviceOptions: { [key: string]: number } = {
        "Washing": 1,
        "Oil Change": 2,
        "Change filters (oil/air)": 3,
        "Dran + air filter": 4,
        "Oil change + oil filter": 5,
        "Oil change + Filter change (oil/air)": 6,
        "Wheel alignement": 7,
        "Tire rotation": 8,
        "Engine tuning": 9,
        "Brake adjustement": 10,
        "Electric adjustement": 11,
        "Control": 12,
        "Others": 13,
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "type_servicing") {
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
        const formattedDate = formatDateToTimestamp(formData.date_servicing);

        // Mettre à jour formData avec la date formatée
        const updatedFormData = {
            ...formData,
            date_servicing: formattedDate,
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/gmao/addnewservicing/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de l'ajout de servicing.");
            }

            const result = await response.json();
            console.log(result);

            // Afficher une notification de succès
            toast.success("Servicing added successfully!", {
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

            // Réinitialiser le formulaire
            setFormData({
                
                invoice_no_servicing: "",
                type_servicing: 0,
                type_vehicule: "",
                date_servicing: "",
                place_servicing: "",
                cost_servicing: "",
                depreciation_servicing: "",
                km_servicing: "",
                next_oil_change_servicing: "",
            });

            // Rafraîchir les données
            if (onSuccess) {
                onSuccess(); // Appel du callback pour rafraîchir le tableau
            }
            // Fermer le modal
            onHide();

        } catch (error) {
            console.error(error);

            // Afficher une notification d'erreur
            toast.error("Error adding servicing. Please try again.", {
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
                <Modal.Title>{translate("New Request")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                      <Form.Group controlId="invoice_no_servicing">
                        <Form.Label>{translate("invoice no servicing")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le véhicule"
                            value={formData.invoice_no_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="type_servicing">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={Object.keys(serviceOptions).find(key => serviceOptions[key] === formData.type_servicing) || ""}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Type of Service")}</option>
                            {Object.entries(serviceOptions).map(([key, value]) => (
                                <option key={value} value={key}>{translate(key)}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                  

                   

                    <Form.Group controlId="type_vehicule">
                        <Form.Label>{translate("type vehicule")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le véhicule"
                            value={formData.type_vehicule}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="date_servicing">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="place_servicing">
                        <Form.Label>{translate("place servicing")}</Form.Label>
                        <Form.Control
                            type="text"
                            //placeholder="Entrez le nom du client"
                            value={formData.place_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="cost_servicing">
                        <Form.Label>{translate("cost servicing")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le c"
                            value={formData.cost_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="depreciation_servicing">
                        <Form.Label>{translate("Depreciation servicing Period (days)")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez la periode de depreciation_servicing (jour)"
                            value={formData.depreciation_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="km_servicing">
                        <Form.Label>{translate("Km servicing")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le kilométrage"
                            value={formData.km_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="next_oil_change_servicing">
                        <Form.Label>{translate("Next oil change")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter next oil change"
                            value={formData.next_oil_change_servicing}
                            onChange={handleChange}
                        />
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

export default ModalNewServicing;
