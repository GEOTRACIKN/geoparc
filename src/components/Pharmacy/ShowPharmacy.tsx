import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";

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
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            console.log('Data:', data);
    
            if (data.length > 0) {
                const pharmacy = data[0];
                setFormData({
                    id_pharmacy: pharmacy.id_pharmacy,
                    product_pharmacy: pharmacy.product_pharmacy,
                    purch_date_pharmacy: pharmacy.purch_date_pharmacy,
                    exp_date_pharmacy: pharmacy.exp_date_pharmacy,
                    cost_pharmacy: pharmacy.cost_pharmacy,
                    type_pharmacy: pharmacy.type_pharmacy,
                    immatriculation_vehicule: pharmacy.immatriculation_vehicule
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
                <Modal.Title>{translate("Show")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                    <Form.Group controlId="product_pharmacy">
                        <Form.Label>{translate("Product")}</Form.Label>
                        <Form.Control
                            value={formData.product_pharmacy}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour purch_date_pharmacy */}
                    <Form.Group controlId="purch_date_pharmacy">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            value={formData.purch_date_pharmacy}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour exp_date_pharmacy */}
                    <Form.Group controlId="exp_date_pharmacy">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            value={formData.exp_date_pharmacy}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour cost_pharmacy */}
                    <Form.Group controlId="cost_pharmacy">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            value={formData.cost_pharmacy}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour type_pharmacy */}
                    <Form.Group controlId="type_pharmacy">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            value={formData.type_pharmacy}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour immatriculation_vehicule */}
                    <Form.Group controlId="immatriculation_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            value={formData.immatriculation_vehicule}
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

export default ModalShowPharmacy;
