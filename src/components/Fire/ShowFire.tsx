import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';  // Importation de moment.js

interface ModalShowFirenProps {
    show: boolean;
    onHide: () => void;
    id_fire: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowFire: React.FC<ModalShowFirenProps> = ({
    show,
    onHide,
    id_fire,
}) => {
    const [formData, setFormData] = useState({
        id_fire: "",
        volume_fire: "",
        ref_fire: "",

        purch_date_fire: "",
        exp_date_fire: "",
        cost_fire: "",
        type_fire: "",
        immatriculation_vehicule: "",
    });

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchFire = async () => {
        try {
            const url = `${backendUrl}/api/geop/showfire/${id_fire}`;
            console.log('Request URL:', url);
        
            const response = await fetch(url);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            console.log('API response for fire:', data);
        
            // Vérifie si les données sont présentes
            if (data && data.id_fire) {
                // Vérifie si les dates sont valides avant de les formater
                const purchDate = moment(data.purch_date_fire, 'DD/MM/YYYY');
                const expDate = moment(data.exp_date_fire, 'DD/MM/YYYY');
                
                setFormData({
                    id_fire: data.id_fire,
                    volume_fire: data.volume_fire,
                    ref_fire: data.ref_fire,
                    purch_date_fire: purchDate.isValid() ? purchDate.format('DD/MM/YYYY') : 'Invalid Date',
                    exp_date_fire: expDate.isValid() ? expDate.format('DD/MM/YYYY') : 'Invalid Date',
                    cost_fire: data.cost_fire,
                    type_fire: data.type_fire,
                    immatriculation_vehicule: data.immatriculation_vehicule
                });
            } else {
                console.warn('No fire data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching fire data:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (show) {
            fetchFire();
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
                    <Form.Group controlId="volume_fire">
                        <Form.Label>{translate("Volume")}</Form.Label>
                        <Form.Control
                            value={formData.volume_fire}
                            readOnly
                        />
                    </Form.Group>


                    <Form.Group controlId="ref_fire">
                        <Form.Label>{translate("Reference")}</Form.Label>
                        <Form.Control
                            value={formData.ref_fire}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour purch_date_fire */}
                    <Form.Group controlId="purch_date_fire">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            value={formData.purch_date_fire}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour exp_date_fire */}
                    <Form.Group controlId="exp_date_fire">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            value={formData.exp_date_fire}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour cost_fire */}
                    <Form.Group controlId="cost_fire">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            value={formData.cost_fire}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour type_fire */}
                    <Form.Group controlId="type_fire">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            value={formData.type_fire}
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

export default ModalShowFire;
