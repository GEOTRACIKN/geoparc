import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";
    const geopuserID = localStorage.getItem("GeopUserID");

// Définir les types pour les props
interface ModalNewFireProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewFire: React.FC<ModalNewFireProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_fire: "",
        ref_fire: "",
        volume_fire: "",
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
                console.log("Fetched vehicles:", data); // Vérifie la structure de la réponse
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
    }, [geopuserID]); // Ajoute `geopuserID` comme dépendance
    
     

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

      const handleClose = () => {
        setFormData({
            id_fire: "",
            ref_fire: "",
            volume_fire: "",
            purch_date_fire: "",
            exp_date_fire: "",
            cost_fire: "",
            type_fire: "",
            id_vehicule: "",
        });
        onHide(); // Fermer le modal après la réinitialisation
    };

    

    const validateForm = () => {
        if (
            !formData.exp_date_fire ||
            !formData.type_fire ||
            !formData.id_vehicule
        ) {
            toast.error(translate("Please fill out all fields"), {
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

            toast.success(translate("Added successfully!"), {
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
            toast.error(translate("Error adding. Please try again"), {
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
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("New")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                       {/* Type */}
                       <Form.Group controlId="type_fire">
                        <Form.Label>{translate("Type")}{translate(" *")}</Form.Label>
                        <Select
                        options={fireOptions}
                        onChange={handleFireTypeChange}
                        name="type_fire"
                        value={fireOptions.find(
                        (option) => option.value === formData.type_fire) || null} 
                        isClearable
                        />

                    </Form.Group>

                    <Form.Group controlId="id_vehicule">
                    <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
                    <Select
                        options={vehicles.map(vehicle => ({
                                                value: vehicle.id_vehicule, // ID du véhicule
                                                label: vehicle.immatriculation_vehicule // Immatriculation
                                            })) as unknown as { value: number; label: string }[]} // 🔥 Correction du typage

                        placeholder={translate("Select Vehicle")}
                        isLoading={vehicles.length === 0} // Affiche un loader si les données ne sont pas encore chargées
                        noOptionsMessage={() => translate("No vehicles available")}
                        isSearchable // Active la recherche

                        // 🔥 Correction de la sélection automatique avec conversion en string
                        value={vehicles
                            .map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            }))
                            .find(option => String(option.value) === String(formData.id_vehicule)) || null
                        }

                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                id_vehicule: selectedOption ? String(selectedOption.value) : "" // 🔥 Correction de l'affectation
                            }));
                        }}
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
                        <Form.Label>{translate("Expiration Date")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.exp_date_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
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

                    {/* Cost */}
                    <Form.Group controlId="cost_fire">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cost_fire}
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
                    <Button variant="secondary" onClick={handleClose}>
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
