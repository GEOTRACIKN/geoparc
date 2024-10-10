import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalEditServicingProps {
    show: boolean;
    onHide: () => void;
    id_servicing: number | null;
    onSuccess?: () => void;

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditServicing: React.FC<ModalEditServicingProps> = ({
    show,
    onHide,
    id_servicing,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        invoice_no: "",
        type_servicing: 0,
        vehicle: "",
        date_servicing: "",
        detail: "",
        cost: "",
        depreciation: "",
        km: "",
        next_oil_change: "",
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
            const url = `${backendUrl}/api/geop/gmao/editservicing/${id_servicing}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                const servicing = data[0];
                setFormData({
                    invoice_no: servicing.invoice_no,
                    type_servicing: servicing.type_servicing.toString(),
                    vehicle: servicing.vehicle,
                    date_servicing: formatDateToTimestamp(servicing.date_servicing), 
                    detail: servicing.detail,
                    cost: servicing.cost,
                    depreciation: servicing.depreciation,
                    km: servicing.km,
                    next_oil_change: servicing.next_oil_change,
                   
                });
            } else {
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


    const handleUpdate = async () => {
        try {
            const url = `${backendUrl}/api/geop/gmao/updateservicing/${id_servicing}`;
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
            toast.success("Servicing updated successfully!", {
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
            toast.error("Error updating servicing. Please try again.", {
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


        <Form.Group controlId="invoice_no">
                        <Form.Label>{translate("invoiceNo")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le véhicule"
                            value={formData.invoice_no}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="type_servicing">
                        <Form.Label>{translate("Service")}</Form.Label>
                        
                        <Form.Control as="select" value={formData.type_servicing} onChange={handleChange}>
                            <option value="">{translate("Select Service")}</option>
                            {Object.entries(serviceMapping).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                
                  

                   

                    <Form.Group controlId="vehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le véhicule"
                            value={formData.vehicle}
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

                    <Form.Group controlId="detail">
                        <Form.Label>{translate("Detail")}</Form.Label>
                        <Form.Control
                            type="text"
                            //placeholder="Entrez le nom du client"
                            value={formData.detail}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="cost">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le c"
                            value={formData.cost}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="depreciation">
                        <Form.Label>{translate("Depreciation Period (days)")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez la periode de depreciation (jour)"
                            value={formData.depreciation}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="km">
                        <Form.Label>{translate("km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le kilométrage"
                            value={formData.km}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="next_oil_change">
                        <Form.Label>{translate("Nex oil change")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter next oil change"
                            value={formData.next_oil_change}
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

export default ModalEditServicing;
