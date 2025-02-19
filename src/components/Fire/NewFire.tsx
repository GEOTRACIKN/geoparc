import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

// Définir les types pour les props
interface ModalNewFireProps {
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

const ModalNewFire: React.FC<ModalNewFireProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_fire: "",
        ref_fire: "",
        volume_fire: "",
        location_fire: "",
        purch_date_fire: "",
        exp_date_fire: "",
        cost_fire: "",
        type_fire: "",
        id_vehicule: "", // Store vehicle ID
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Liste des véhicules
    const { translate } = useTranslate();

    // Récupérer les véhicules selon l'ID utilisateur
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(
                    `${backendUrl}/api/geop/vehicule/${geopuserID}`
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
    const fireOptions = [
        { value: "A", label: translate("Class A fires: dry materials (wood, paper)") }, 
        { value: "B", label: translate("Class B fires: flammable liquids") },
        { value: "C", label: translate("Class C fires: flammable gases") },
        { value: "D", label: translate("Class D fires: combustible metals") },
        { value: "E", label: translate("Class E fires: electrical equipment") },
        { value: "F", label: translate("Class F fires: oils and fats") },
    ];
    
      const handleFireTypeChange = (selectedOption: any, actionMeta: any) => {
        const { name } = actionMeta;
        const value = selectedOption ? selectedOption.value : "";
    
        setFormData({
          ...formData,
          [name]: value,
        });
        console.log(formData); 
    
      };
    

    const validateForm = () => {
        if (
            !formData.volume_fire ||
            !formData.ref_fire ||
            !formData.location_fire ||
            !formData.purch_date_fire ||
            !formData.exp_date_fire ||
            !formData.cost_fire ||
            !formData.type_fire ||
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
            const response = await fetch(`${backendUrl}/api/geop/addnewfire/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error adding fire.");
            }

            const result = await response.json();

            toast.success("Fire added successfully!", {
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
                id_fire: "",
                ref_fire: "",
                volume_fire: "",
                location_fire: "",
                purch_date_fire: "",
                exp_date_fire: "",
                cost_fire: "",
                type_fire: "",
                id_vehicule: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error adding fire:", error);
            toast.error("Error adding fire. Please try again.", {
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
                <Modal.Title>{translate("New")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                <Form.Group controlId="ref_fire">
                        <Form.Label>{translate("Reference")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.ref_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {/* Volume */}
                    <Form.Group controlId="volume_fire">
                        <Form.Label>{translate("Volume")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.volume_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Location */}
                    <Form.Group controlId="location_fire">
                        <Form.Label>{translate("Location")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.location_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Purchase Date */}
                    <Form.Group controlId="purch_date_fire">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.purch_date_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Expiry Date */}
                    <Form.Group controlId="exp_date_fire">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.exp_date_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Cost */}
                    <Form.Group controlId="cost_fire">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cost_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Type */}
                    <Form.Group controlId="type_fire">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Select
                        options={fireOptions}
                        onChange={handleFireTypeChange}
                        name="type_fire"
                        value={fireOptions.find(
                        (option) => option.value === formData.type_fire) || null} 
                        isClearable
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

export default ModalNewFire;
