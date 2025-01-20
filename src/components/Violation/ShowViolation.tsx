import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';  // Importation de moment.js

interface ModalShowViolationnProps {
    show: boolean;
    onHide: () => void;
    id_violation: number | null;
}

interface Vehicle {
    id_vehicule: string;
    immatriculation_vehicule: string;
}


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowViolation: React.FC<ModalShowViolationnProps> = ({
    show,
    onHide,
    id_violation,
}) => {
    const [formData, setFormData] = useState({
        
        id_conducteur: "",
        type_violation: "",
        date_violation: "",
        cost: 0,
        description: "",
        immatriculation_vehicule: "",
    });
        const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchViolation = async () => {
        try {
            const url = `${backendUrl}/api/geop/showviolation/${id_violation}`;
            console.log('Request URL:', url);
        
            const response = await fetch(url);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            console.log('API response for violation:', data);
        
            // Vérifie si les données sont présentes
            if (data && data.id_violation) {
                // Vérifie si les dates sont valides avant de les formater
                const date_violation = moment(data.date_violation, 'DD/MM/YYYY');
                
                setFormData({
                    id_conducteur: data.id_conducteur,

                    date_violation: date_violation.isValid() ? date_violation.format('DD/MM/YYYY') : 'Invalid Date',
                    type_violation: data.type_violation,
                    immatriculation_vehicule: data.immatriculation_vehicule,
                    cost: data.cost,
                    description: data.description,

                });
            } else {
                console.warn('No violation data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching violation data:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (show) {
            fetchViolation();
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
                    <Form.Group controlId="type_violation">
                        <Form.Label>{translate("Product")}</Form.Label>
                        <Form.Control
                            value={formData.type_violation}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour purch_date_violation */}
                    <Form.Group controlId="description">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            value={formData.description}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour exp_date_violation */}
                    <Form.Group controlId="date_violation">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            value={formData.date_violation}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour cost_violation */}
                    <Form.Group controlId="costt">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            value={formData.cost}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour type_violation */}
                    <Form.Group controlId="type_violation">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            value={formData.type_violation}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour immatriculation_vehicule */}
                    <Form.Group controlId="a">
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

export default ModalShowViolation;
