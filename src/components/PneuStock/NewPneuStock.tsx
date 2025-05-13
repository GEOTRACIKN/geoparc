import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalNewPneuStockProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewPneuStock: React.FC<ModalNewPneuStockProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        type_pneu: "",
        modele_pneu: "",
        ref_pneu: "",
        num_serie_pneu: "",
        loc_pneu: "",
        date_achat_pneu: "",
        cout_pneu: "",
        fourn_pneu: "",
        marque_pneu:"",
        fact_pneu: ""
    });

    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
            type_pneu: "",
            modele_pneu: "",
            ref_pneu: "",
            num_serie_pneu: "",
            loc_pneu: "",
            date_achat_pneu: "",
            cout_pneu: "",
            fourn_pneu: "",
            marque_pneu:"",

            fact_pneu: ""
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.type_pneu || !formData.modele_pneu) {
            toast.error(translate("Please fill required fields"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${backendUrl}/api/geop/pneu_stock/${geopuserID}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({
                    ...formData,
                    id_user: geopuserID,
                    cout_pneu: Number(formData.cout_pneu) || 0
                }),
            });

            if (!response.ok) throw new Error("Error adding to stock");

            toast.success(translate("Added to stock successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error adding to stock:", error);
            toast.error(translate("Error adding to stock. Please try again"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };
   
      

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Add to Stock")}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                <div className="row">
                    <Form.Group controlId="type_pneu">
                        <Form.Label>{translate("Tire Type")} *</Form.Label>
                        <Form.Control as="select" value={formData.type_pneu} onChange={handleChange} required>
                            <option value="">{translate("-- Tire type --")}</option>
                            <option value="utilitaire">{translate("Utility/Van")}</option>
                            <option value="poids_lourd">{translate("Heavy Truck")}</option>
                            <option value="suv">{translate("SUV / 4x4")}</option>
                            <option value="remorque">{translate("Trailer (small luggage)")}</option>
                            <option value="voiture">{translate("Car/Passenger")}</option>
                            <option value="agricole">{translate("Agricultural")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="marque_pneu">
                        <Form.Label>{translate("Brand")} *</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.marque_pneu} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group controlId="modele_pneu">
                        <Form.Label>{translate("Model")} *</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.modele_pneu} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group controlId="ref_pneu">
                        <Form.Label>{translate("Reference")}* </Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder={translate("Dimension/Load/Speed")}
                            value={formData.ref_pneu} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="num_serie_pneu">
                        <Form.Label>{translate("Serial Number")}</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.num_serie_pneu} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="loc_pneu">
                        <Form.Label>{translate("Position")}</Form.Label>
                        <Form.Control as="select" value={formData.loc_pneu} onChange={handleChange}>
                            <option value="">{translate("Select Position")}</option>
                            <option value="front_left">{translate("Front Left")}</option>
                            <option value="front_right">{translate("Front Right")}</option>
                            <option value="rear_left">{translate("Rear Left")}</option>
                            <option value="rear_right">{translate("Rear Right")}</option>
                            <option value="spare">{translate("Spare Tire")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_achat_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="fourn_pneu">
                        <Form.Label>{translate("Supplier")}</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.fourn_pneu} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="fact_pneu">
                        <Form.Label>{translate("Invoice Number")}</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.fact_pneu} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group controlId="cout_pneu">
                        <Form.Label>{translate("Cost")} (DZD)</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.cout_pneu}
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
                </div>


                    
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Cancel")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Save to Stock")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewPneuStock;