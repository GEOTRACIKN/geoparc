import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";

interface EditPharmacyModalProps {
    show: boolean;
    onHide: () => void;
    id_pharmacy: number | null; // ID de la pharmacie à modifier
    onSuccess?: () => void;
}

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: string;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const EditPharmacyModal: React.FC<EditPharmacyModalProps> = ({
    show,
    onHide,
    id_pharmacy,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_pharmacy: "",
        product_pharmacy: "",
        purch_date_pharmacy: "",
        exp_date_pharmacy: "",
        cost_pharmacy: "",
        type_pharmacy: "",
        id_vehicule: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { translate } = useTranslate();

    // Charger les données de la pharmacie existante
    useEffect(() => {
        const fetchPharmacy = async () => {
            try {
                if (!id_pharmacy) {
                    console.warn("No pharmacy ID provided");
                    return;
                }
    
                const response = await fetch(
                    `${backendUrl}/api/geop/showpharmacy/${id_pharmacy}`
                );
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch pharmacy data. Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("API response for pharmacy:", data); // Log pour voir la réponse complète
    
                // Vérifiez si `data` est un tableau
                if (Array.isArray(data) && data.length > 0) {
                    // Prenez le premier élément du tableau
                    const pharmacyData = data[0];
    
                    // Mettez à jour les données du formulaire
                    setFormData((prev) => ({
                        ...prev,
                        ...pharmacyData, // Fusionne les données de la pharmacie avec l'état actuel
                    }));
                } else {
                    console.warn("No pharmacy data found in response.");
                    toast.warn("No pharmacy data found.", {
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
            } catch (error) {
                console.error("Error fetching pharmacy:", error);
                toast.error("Error fetching pharmacy data.", {
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
    
        fetchPharmacy();
    }, [id_pharmacy, backendUrl]);
    
    
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                if (!geopuserID) {
                    console.warn("No user ID provided");
                    return;
                }
    
                const response = await fetch(
                    `${backendUrl}/api/geop/vehicule/${geopuserID}`
                );
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch vehicles. Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("API response for vehicles:", data); // Log pour déboguer les véhicules
    
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
    
        fetchVehicles();
    }, [geopuserID, backendUrl]); // Ajout de `backendUrl` comme dépendance
    

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
            const response = await fetch(
                `${backendUrl}/api/geop/updatepharmacy/${id_pharmacy}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating pharmacy.");
            }

            const result = await response.json();

            toast.success("Pharmacy updated successfully!", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error updating pharmacy:", error);
            toast.error("Error updating pharmacy. Please try again.", {
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
                <Modal.Title>{translate("Edit")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="product_pharmacy">
                        <Form.Label>{translate("Product")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.product_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="purch_date_pharmacy">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.purch_date_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="exp_date_pharmacy">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.exp_date_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="cost_pharmacy">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cost_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="type_pharmacy">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_pharmacy}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.id_vehicule}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Vehicle")}</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id_vehicule} value={vehicle.id_vehicule}>
                                    {vehicle.immatriculation_vehicule}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Update")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditPharmacyModal;
