import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalNewPharmacynProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");


const ModalNewPharmacy: React.FC<ModalNewPharmacynProps> = ({
    show,
    onHide,
    onSuccess,
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
    

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
            
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
            }));
        
    };
   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mettre à jour formData avec la date formatée
        const updatedFormData = {
            ...formData,
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewpharmacy/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de l'ajout de l'pharmacy.");
            }

            const result = await response.json();
            console.log(result);

            // Afficher une notification de succès
            toast.success("Pharmacy added successfully!", {
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
                id_pharmacy: "",
                product_pharmacy: "",
                purch_date_pharmacy: "",
                exp_date_pharmacy: "",
                cost_pharmacy: "",
                type_pharmacy: "",
                immatriculation_vehicule: "",
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
            toast.error("Error adding pharmacy. Please try again.", {
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
                type="date"
                value={formData.purch_date_pharmacy}
                onChange={handleChange}
            />
        </Form.Group>

        {/* Champ pour exp_date_pharmacy */}
        <Form.Group controlId="exp_date_pharmacy">
            <Form.Label>{translate("Expiration Date")}</Form.Label>
            <Form.Control
                type="date"
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
                    <Button variant="primary" type="submit">
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewPharmacy;
