import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";

interface ModalEditServicingProps {
    show: boolean;
    onHide: () => void;
    id_servicing: number | null;
    onSuccess?: () => void;
    isEditable?: boolean;

}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditServicing: React.FC<ModalEditServicingProps> = ({
    show,
    onHide,
    id_servicing,
    onSuccess,
    isEditable = false // Default to true
    
}) => {
    const [formData, setFormData] = useState({
        invoice_no_servicing: "",
        type_servicing: 0,
        immatriculation_vehicule: "",
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
        4:"Drain + air filter",
        5:"Oil change + oil filter",
        6:"Oil change + Filter change (oil/air)",
        7:"Wheel alignment",
        8:"Tire rotation",
        9:"Engine tuning",
        10:"Brake adjustment",
        11:"Electric adjustment",
        12:"Control",
        13:"Others",
    };

    // Fetch data from API and set form data
    const fetchServicing = async () => {
        try {
            const url = `${backendUrl}/api/geop/showservicing/${id_servicing}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                const servicing = data[0];
                setFormData({
                    invoice_no_servicing: servicing.invoice_no_servicing || "",
                    type_servicing: servicing.type_servicing ? servicing.type_servicing.toString() : "",
                    immatriculation_vehicule: servicing.immatriculation_vehicule || "",
                    date_servicing: servicing.date_servicing ? formatDateToTimestamp(servicing.date_servicing) : "",
                    place_servicing: servicing.place_servicing || "",
                    cost_servicing: servicing.cost_servicing || "",
                    depreciation_servicing: servicing.depreciation_servicing || "",
                    km_servicing: servicing.km_servicing || "",
                    next_oil_change_servicing: servicing.next_oil_change_servicing || "",
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
            const url = `${backendUrl}/api/geop/updateservicing/${id_servicing}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    // Convert empty strings to null for optional fields
                    invoice_no_servicing: formData.invoice_no_servicing || null,
                    type_servicing: formData.type_servicing || null,
                    cost_servicing: formData.cost_servicing || null,
                    depreciation_servicing: formData.depreciation_servicing || null,
                    km_servicing: formData.km_servicing || null,
                    next_oil_change_servicing: formData.next_oil_change_servicing || null,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.text(); // ou response.json() si votre serveur renvoie un JSON
                console.error('Error details:', errorData);
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

                    

<Form.Group controlId="immatriculation_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            type="text"
                            readOnly={!isEditable}
                            //placeholder="Entrez le véhicule"
                            value={formData.immatriculation_vehicule}
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

                    
                    <Form.Group controlId="km_servicing">
                        <Form.Label>{translate("KM")}</Form.Label>
                        <Form.Control
                            type="number"
                            readOnly={!isEditable}
                            //placeholder="Entrez le kilométrage"
                            value={formData.km_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
                        />
                    </Form.Group>


        <Form.Group controlId="invoice_no_servicing">
                        <Form.Label>{translate("Invoice No")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le véhicule"
                            value={formData.invoice_no_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="type_servicing">
                        <Form.Label>{translate("Service")}</Form.Label>
                        
                        <Form.Control as="select" value={formData.type_servicing} onChange={handleChange}>
                            <option value="">{translate("Select Service")}</option>
                            {Object.entries(serviceMapping).map(([key, label]) => (
                                <option key={key} value={key}>
                                     {translate(label)}
                                    
                                </option>

                                


                            ))}
                           
                        </Form.Control>
                    </Form.Group>

                
                  

                   

                    <Form.Group controlId="place_servicing">
                        <Form.Label>{translate("Place")}</Form.Label>
                        <Form.Control
                            type="text"
                            //placeholder="Entrez le nom du client"
                            value={formData.place_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="cost_servicing">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez le c"
                            value={formData.cost_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
                        />
                    </Form.Group>
                    <Form.Group controlId="depreciation_servicing">
                        <Form.Label>{translate("Depreciation servicing Period (days)")}</Form.Label>
                        <Form.Control
                            type="number"
                            //placeholder="Entrez la periode de depreciation_servicing (jour)"
                            value={formData.depreciation_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
                        />
                    </Form.Group>
                   

                    <Form.Group controlId="next_oil_change_servicing">
                        <Form.Label>{translate("Next oil change (days)")}</Form.Label>
                        <Form.Control
                            type="text"
                            //placeholder="Enter next oil change"
                            value={formData.next_oil_change_servicing}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Autorise seulement les touches numériques, suppr, backspace, tab, fleches
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  !allowedKeys.includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              min="0"
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
