import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";

// Définir les types pour les props
interface ModalNewPharmacyProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: string;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalNewPharmacy: React.FC<ModalNewPharmacyProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_pharmacy: "",
        product_pharmacy: "",
        purch_date_pharmacy: "",
        exp_date_pharmacy: "",
        cost_pharmacy: "",
        type_pharmacy: "",
        id_vehicule: "", // Store vehicle ID
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Liste des véhicules
    const { translate } = useTranslate();

    // Récupérer les véhicules selon l'ID utilisateur
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(
                    `${backendUrl}/api/geop/pharmacy/vehicule/${geopuserID}`
                );
        
                if (!response.ok) {
                    throw new Error("Failed to fetch vehicles");
                }
        
                const data = await response.json();
                console.log("Fetched vehicles:", data); // Ensure the correct structure
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error("Error fetching vehicles.", {
                    position: "bottom-right",
                    autoClose: 2400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
        };
        

        if (geopuserID) {
            fetchVehicles();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const validateForm = () => {
        if (
            !formData.product_pharmacy ||
            !formData.purch_date_pharmacy ||
            !formData.exp_date_pharmacy ||
            !formData.cost_pharmacy ||
            !formData.type_pharmacy ||
            !formData.id_vehicule
        ) {
            toast.error("Please fill out all fields.", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }
    
        // Ensure formData.id_vehicule and vehicle.id_vehicule are the same type
        const selectedVehicle = vehicles.find(
            (vehicle) => String(vehicle.id_vehicule) === String(formData.id_vehicule)
        );
    
        if (!selectedVehicle) {
            toast.error("Please select a valid vehicle.", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }
    
        return true;
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewpharmacy/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error adding pharmacy.");
            }

            const result = await response.json();

            toast.success("Pharmacy added successfully!", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });

            // Reset form data
            setFormData({
                id_pharmacy: "",
                product_pharmacy: "",
                purch_date_pharmacy: "",
                exp_date_pharmacy: "",
                cost_pharmacy: "",
                type_pharmacy: "",
                id_vehicule: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error adding pharmacy:", error);
            toast.error("Error adding pharmacy. Please try again.", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{translate("New Request")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Product */}
                    <Form.Group controlId="product_pharmacy">
                        <Form.Label>{translate("Product")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.product_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Purchase Date */}
                    <Form.Group controlId="purch_date_pharmacy">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.purch_date_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Expiry Date */}
                    <Form.Group controlId="exp_date_pharmacy">
                        <Form.Label>{translate("Expiry Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.exp_date_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Cost */}
                    <Form.Group controlId="cost_pharmacy">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cost_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Type */}
                    <Form.Group controlId="type_pharmacy">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Vehicle */}
                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.id_vehicule}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Vehicle")}</option>
                            {vehicles.length === 0 ? (
                                <option value="">{translate("No vehicles available")}</option>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <option key={vehicle.id_vehicule} value={vehicle.id_vehicule}>
                                        {vehicle.immatriculation_vehicule}
                                    </option>
                                ))
                            )}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewPharmacy;
