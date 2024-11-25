import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";

interface ModalShowPharmacynProps {
    show: boolean;
    onHide: () => void;
    id_pharmacy: number | null;

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const ModalShowPharmacy: React.FC<ModalShowPharmacynProps> = ({
    show,
    onHide,
    id_pharmacy,

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
    const fetchPharmacy = async () => {
        try {
            const url = `${backendUrl}/api/geop/showpharmacy/${id_pharmacy}`;
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
                const pharmacy = data[0];
                setFormData({
                    id_pharmacy: pharmacy.id_pharmacy, // ID de la pharmacie
                    product_pharmacy: pharmacy.product_pharmacy, // Produit de la pharmacie
                    purch_date_pharmacy: pharmacy.purch_date_pharmacy, // Date d'achat de la pharmacie
                    exp_date_pharmacy: pharmacy.exp_date_pharmacy, // Date d'expiration de la pharmacie
                    cost_pharmacy: pharmacy.cost_pharmacy, // Coût de la pharmacie
                    type_pharmacy: pharmacy.type_pharmacy, // Type de la pharmacie
                    immatriculation_vehicule: pharmacy.immatriculation_vehicule // Immatriculation du véhicule
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
            fetchPharmacy();
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
        <Modal show={show} onHide={onHide} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show Request")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
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
                  
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalShowPharmacy;
