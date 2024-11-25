import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";
import { Pharmacy } from "../../pages/Pharmacy";

interface ModalEditInterventionProps {
    show: boolean;
    onHide: () => void;
    id_pharmacy: number | null;
    onSuccess?: () => void;

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditIntervention: React.FC<ModalEditInterventionProps> = ({
    show,
    onHide,
    id_pharmacy,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        id_pharmacy: "",
    product_pharmacy: "",
    purch_date_pharmacy: "",
    exp_date_pharmacy: "",
    cost_pharmacy: "",
    type_pharmacy: "",
    immatriculation_vehicule: "",
   
    });

    const { translate } = useTranslate();

   
    // Fetch data from API and set form data
    const fetchIntervention = async () => {
        try {
            const url = `${backendUrl}/api/geop/showpharmacy/${id_pharmacy}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                const pharmacy = data[0];
                setFormData({
                    id_pharmacy: pharmacy.id_pharmacy,
                    immatriculation_vehicule: pharmacy.immatriculation_vehicule,
                    product_pharmacy: pharmacy.product_pharmacy,
                    purch_date_pharmacy: pharmacy.purch_date_pharmacy,
                    exp_date_pharmacy: pharmacy.exp_date_pharmacy,
                    cost_pharmacy: pharmacy.cost_pharmacy,
                    type_pharmacy: pharmacy.type_pharmacy,
                   
                });
            } else {
                console.warn('No pharmacy data found for the provided ID.');
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


    const handleUpdate = async () => {
        try {
            const url = `${backendUrl}/api/geop/updatepharmacy/${id_pharmacy}`;
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
            toast.success("Intervention updated successfully!", {
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
            toast.error("Error updating pharmacy. Please try again.", {
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
           

        {/* Champ pour product_pharmacy */}
        <Form.Group controlId="product_pharmacy">
            <Form.Label>{translate("Pharmacy Product")}</Form.Label>
            <Form.Control
                type="text"
                placeholder={translate("Enter product")}
                value={formData.product_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour purch_date_pharmacy */}
        <Form.Group controlId="purch_date_pharmacy">
            <Form.Label>{translate("Purchase Date")}</Form.Label>
            <Form.Control
                type="text"
                value={formData.purch_date_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour exp_date_pharmacy */}
        <Form.Group controlId="exp_date_pharmacy">
            <Form.Label>{translate("Expiration Date")}</Form.Label>
            <Form.Control
                type="text"
                value={formData.exp_date_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour cost_pharmacy */}
        <Form.Group controlId="cost_pharmacy">
            <Form.Label>{translate("Cost")}</Form.Label>
            <Form.Control
                type="number"
                placeholder={translate("Enter cost")}
                value={formData.cost_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour type_pharmacy */}
        <Form.Group controlId="type_pharmacy">
            <Form.Label>{translate("Type")}</Form.Label>
            <Form.Control
                type="text"
                placeholder={translate("Enter type")}
                value={formData.type_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour immatriculation_vehicule */}
        <Form.Group controlId="immatriculation_vehicule">
            <Form.Label>{translate("Vehicle Registration")}</Form.Label>
            <Form.Control
                type="text"
                placeholder={translate("Enter vehicle registration")}
                value={formData.immatriculation_vehicule}
                onChange={handleChange}
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

export default ModalEditIntervention;
