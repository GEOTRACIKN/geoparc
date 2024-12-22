import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import moment from 'moment';  // Importation de moment.js

interface ModalShowTrainingnProps {
    show: boolean;
    onHide: () => void;
    id_training: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowTraining: React.FC<ModalShowTrainingnProps> = ({
    show,
    onHide,
    id_training,
}) => {
    const [formData, setFormData] = useState({
        id_training: "",
        nom_training: "",

        date_start_training: "",
        date_end_training: "",
    
        type_training: "",
    
    });

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchTraining = async () => {
        try {
            const url = `${backendUrl}/api/geop/showtraining/${id_training}`;
            console.log('Request URL:', url);
        
            const response = await fetch(url);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            console.log('API response for training:', data);
        
            // Vérifie si les données sont présentes
            if (data && data.id_training) {
                // Vérifie si les dates sont valides avant de les formater
                const purchDate = moment(data.date_start_training, 'DD/MM/YYYY');
                const expDate = moment(data.date_end_training, 'DD/MM/YYYY');
                
                setFormData({
                    id_training: data.id_training,
                    nom_training: data.nom_training,
                    date_start_training: purchDate.isValid() ? purchDate.format('DD/MM/YYYY') : 'Invalid Date',
                    date_end_training: expDate.isValid() ? expDate.format('DD/MM/YYYY') : 'Invalid Date',
                   
                    type_training: data.type_training               });
            } else {
                console.warn('No training data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching training data:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (show) {
            fetchTraining();
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
                    <Form.Group controlId="nom_training">
                        <Form.Label>{translate("Name")}</Form.Label>
                        <Form.Control
                            value={formData.nom_training}
                            readOnly
                        />
                    </Form.Group>


                    

                    {/* Champ pour date_start_training */}
                    <Form.Group controlId="date_start_training">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            value={formData.date_start_training}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour date_end_training */}
                    <Form.Group controlId="date_end_training">
                        <Form.Label>{translate("End Date")}</Form.Label>
                        <Form.Control
                            value={formData.date_end_training}
                            readOnly
                        />
                    </Form.Group>

                   

                    {/* Champ pour type_training */}
                    <Form.Group controlId="type_training">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            value={formData.type_training}
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

export default ModalShowTraining;
