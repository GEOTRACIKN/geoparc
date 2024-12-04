import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";

// Define the types for props
interface ModalNewPharmacyProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

// Define the type for a vehicle
interface Vehicle {
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
        immatriculation_vehicule: "",
    });

    const [vehicles, setVehicles] = useState<string[]>([]); // Store vehicle registrations as strings
    const { translate } = useTranslate();

    // Fetch vehicle registrations based on user ID
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                console.log("Fetching vehicles...");
                const response = await fetch(
                    `${backendUrl}/api/geop/pharmacy/vehicule/${geopuserID}`
                );
                console.log(
                    `Request sent to: ${backendUrl}/api/geop/pharmacy/vehicule/${geopuserID}`
                );

                if (!response.ok) {
                    console.error(`Response status: ${response.status}`);
                    throw new Error("Failed to fetch vehicles");
                }

                const data = await response.json();
                console.log("Vehicles fetched successfully:", data);

                // Safely map the fetched data
                if (data.vehicles && Array.isArray(data.vehicles)) {
                    setVehicles(
                        data.vehicles.map((vehicle: Vehicle) => vehicle.immatriculation_vehicule)
                    );
                } else {
                    console.warn("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error("Error fetching vehicle registrations", {
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

        fetchVehicles();
    }, []); // Runs only once when the component mounts


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.product_pharmacy || !formData.purch_date_pharmacy || !formData.exp_date_pharmacy || !formData.cost_pharmacy || !formData.type_pharmacy) {
            toast.error("Please fill out all fields.", {
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
            return false;
        }
        return true;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
    
        const updatedFormData = { ...formData };
    
        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewpharmacy/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });
    
            if (!response.ok) {
                throw new Error("Error adding pharmacy.");
            }
    
            const result = await response.json();
            console.log(result);
    
            toast.success("Pharmacy added successfully!", {
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
    
            setFormData({
                id_pharmacy: "",
                product_pharmacy: "",
                purch_date_pharmacy: "",
                exp_date_pharmacy: "",
                cost_pharmacy: "",
                type_pharmacy: "",
                immatriculation_vehicule: "",
            });
    
            if (onSuccess) {
                onSuccess();
            }
    
            onHide();
    
        } catch (error) {
            console.error(error);
            toast.error("Error adding pharmacy. Please try again.", {
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
                <Modal.Title>{translate("New Request")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                 

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

                    {/* Vehicle Registration */}
                    <Form.Group controlId="immatriculation_vehicule">
                        <Form.Label>{translate("Vehicle Registration")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.immatriculation_vehicule}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Vehicle")}</option>
                            {vehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle}>
                                    {vehicle}
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
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewPharmacy;
