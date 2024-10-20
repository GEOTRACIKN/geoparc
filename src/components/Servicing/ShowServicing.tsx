import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";

interface ModalShowServicingnProps {
    show: boolean;
    onHide: () => void;
    id_servicing: number | null;
    isEditable?: boolean;


}

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const ModalShowServicing: React.FC<ModalShowServicingnProps> = ({
    show,
    onHide,
    id_servicing,
    isEditable = false // Default to true


}) => {
    const [formData, setFormData] = useState({
        invoice_no_servicing: "",
        type_servicing: "",
        type_vehicule: "",
        date_servicing: "",
        place_servicing: "",
        cost_servicing: "",
        depreciation_servicing: "",
        km_servicing: "",
        next_oil_change_servicing: "",
    });

    const { translate } = useTranslate();

    const serviceMapping: { [key: number]: string } = {
        1:"Washing",
        2:"Oil Change",
        3:"Change filters (oil/air)",
        4:"Dran + air filter",
        5:"Oil change + oil filter",
        6:"Oil change + Filter change (oil/air)",
        7:"Wheel alignement",
        8:"Tire rotation",
        9:"Engine tuning",
        10:"Brake adjustement",
        11:"Electric adjustement",
        12:"Control",
        13:"Others",
    };

    // Fetch data from API and set form data
    const fetchServicing = async () => {
        try {
            const url = `${backendUrl}/api/geop/gmao/showservicing/${id_servicing}`;
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
                const servicing = data[0];
                setFormData({
                    invoice_no_servicing: servicing.invoice_no_servicing || "",
                    type_servicing: servicing.type_servicing ? servicing.type_servicing.toString() : "",
                    type_vehicule: servicing.type_vehicule || "",
                    date_servicing: servicing.date_servicing ? formatDateToTimestamp(servicing.date_servicing) : "",
                    place_servicing: servicing.place_servicing || "",
                    cost_servicing: servicing.cost_servicing || "",
                    depreciation_servicing: servicing.depreciation_servicing || "",
                    km_servicing: servicing.km_servicing || "",
                    next_oil_change_servicing: servicing.next_oil_change_servicing || "",
                });
            }else {
                console.warn('No servicing data found for the provided ID.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
    

    useEffect(() => {
        if (show) {
            fetchServicing();
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
                      <Form.Group controlId="invoice_no_servicing">
                        <Form.Label>{translate("Invoice No")}</Form.Label>
                        <Form.Control
                            type="number"
                            readOnly={!isEditable}

                            //placeholder="Entrez le véhicule"
                            value={formData.invoice_no_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="type_servicing">
    <Form.Label>{translate("Service")}</Form.Label>
    <Form.Control
        type="text"
        value={serviceMapping[Number(formData.type_servicing)] || ""}
        readOnly
    />
</Form.Group>

                
                  

                   

                    <Form.Group controlId="type_vehicule">
                        <Form.Label>{translate("Vehicle Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly={!isEditable}

                            //placeholder="Entrez le véhicule"
                            value={formData.type_vehicule}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="date_servicing">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            readOnly={!isEditable}

                            value={formData.date_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="place_servicing">
                        <Form.Label>{translate("Place")}</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly={!isEditable}

                            //placeholder="Entrez le nom du client"
                            value={formData.place_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="cost_servicing">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            readOnly={!isEditable}

                            //placeholder="Entrez le c"
                            value={formData.cost_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="depreciation_servicing">
                        <Form.Label>{translate("Depreciation servicing Period (days)")}</Form.Label>
                        <Form.Control
                            type="number"
                            readOnly={!isEditable}

                            //placeholder="Entrez la periode de depreciation_servicing (jour)"
                            value={formData.depreciation_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="km_servicing">
                        <Form.Label>{translate("KM")}</Form.Label>
                        <Form.Control
                            type="number"
                            readOnly={!isEditable}

                            //placeholder="Entrez le kilométrage"
                            value={formData.km_servicing}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="next_oil_change_servicing">
                        <Form.Label>{translate("Nex oil change")}</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly={!isEditable}

                            //placeholder="Enter next oil change"
                            value={formData.next_oil_change_servicing}
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

export default ModalShowServicing;
