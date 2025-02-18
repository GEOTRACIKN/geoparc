import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';  // Importation de moment.js

interface ModalShowDeadlinenProps {
    show: boolean;
    onHide: () => void;
    id_deadline: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowDeadline: React.FC<ModalShowDeadlinenProps> = ({
    show,
    onHide,
    id_deadline,
}) => {
    const [formData, setFormData] = useState({
        id_deadline: "",
        id_conducteur: "",
        date_start_Deadline: "",
        date_end_Deadline: "",
        prenom_conducteur: "",
        nom_conducteur:"",

    
        type_Deadline: "",
    
    });

    const { translate } = useTranslate();

    // Fetch data from API and set form data
    const fetchDeadline = async () => {
        try {
            const url = `${backendUrl}/api/geop/showDeadline/${id_deadline}`;
            console.log('Request URL:', url);
        
            const response = await fetch(url);
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
        
            console.log('API response for Deadline:', data);
        
            // Vérifie si les données sont présentes
            if (data && data.id_deadline) {
                // Vérifie si les dates sont valides avant de les formater
                const purchDate = moment(data.date_start_Deadline, 'DD/MM/YYYY');
                const expDate = moment(data.date_end_Deadline, 'DD/MM/YYYY');
                
                setFormData({
                    id_deadline: data.id_deadline,
                    id_conducteur: data.id_conducteur,
                    date_start_Deadline: purchDate.isValid() ? purchDate.format('DD/MM/YYYY') : 'Invalid Date',
                    date_end_Deadline: expDate.isValid() ? expDate.format('DD/MM/YYYY') : 'Invalid Date',
                    prenom_conducteur: data.prenom_conducteur,
                    nom_conducteur: data.nom_conducteur,
                    type_Deadline: data.type_Deadline               });
            } else {
                console.warn('No Deadline data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching Deadline data:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (show) {
            fetchDeadline();
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
                    
                                          <Form.Group controlId="driver">
                                            <Form.Label>{translate("Driver")}</Form.Label>
                                            <Form.Control
                                                value={`${formData.nom_conducteur} ${formData.prenom_conducteur} `}
                                                readOnly
                    />
                    </Form.Group>

                    {/* Champ pour date_start_Deadline */}
                    <Form.Group controlId="date_start_Deadline">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            value={formData.date_start_Deadline}
                            readOnly
                        />
                    </Form.Group>

                    {/* Champ pour date_end_Deadline */}
                    <Form.Group controlId="date_end_Deadline">
                        <Form.Label>{translate("End Date")}</Form.Label>
                        <Form.Control
                            value={formData.date_end_Deadline}
                            readOnly
                        />
                    </Form.Group>

                   

                    {/* Champ pour type_Deadline */}
                    <Form.Group controlId="type_Deadline">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            value={formData.type_Deadline}
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

export default ModalShowDeadline;
