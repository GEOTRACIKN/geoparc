import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import Select from "react-select";

import dayjs from "dayjs"; 
import moment from "moment";

interface EditFireModalProps {
    show: boolean;
    onHide: () => void;
    id_fire: number | null; // ID de la pharmacie à modifier
    onSuccess?: () => void;
}

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: string;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const EditFireModal: React.FC<EditFireModalProps> = ({
    show,
    onHide,
    id_fire,
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
        id_vehicule: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { translate } = useTranslate();
   

    // Charger les données de la pharmacie existante

    useEffect(() => {
        // Vérifie si l'id_fire est valide avant de faire l'appel API
        if (!id_fire) {
            console.error("id_fire is invalid");
            return;
        }
    
        const fetchFire = async () => {
            try {
                // Logge l'URL de l'API pour vérifier qu'elle est correcte
                console.log("URL de l'API :", `${backendUrl}/api/geop/showfire/${id_fire}`);
    
                const response = await axios.get(`${backendUrl}/api/geop/showfire/${id_fire}`);
                const data = response.data;
    
                // Logge les données reçues pour s'assurer que tout est bien là
                console.log("Données reçues : ", JSON.stringify(data, null, 2));
    
                if (!data || !data.id_fire) {
                    toast.error("Fire data not found.");
                    return;
                }
    
                const toDateInputFormat = (date: string) => {
                    const [day, month, year] = date.split('/');
                    return `${year}-${month}-${day}`;
                };
                
                const fromDateInputFormat = (date: string) => {
                    const [year, month, day] = date.split('-');
                    return `${day}/${month}/${year}`;
                };
                
                // Lors de la récupération des données
                const formattedData = {
                    ...data,
                    purch_date_fire: toDateInputFormat(data.purch_date_fire),
                    exp_date_fire: toDateInputFormat(data.exp_date_fire),
                };
                
                // Lors de l’envoi des données au backend
                const payload = {
                    ...formData,
                    purch_date_fire: fromDateInputFormat(formData.purch_date_fire),
                    exp_date_fire: fromDateInputFormat(formData.exp_date_fire),
                };
                
                console.log("Données formatées :", formattedData);
                
                // Mettre à jour le state avec les dates formatées
                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
                
                
                
                
            } catch (error: unknown) {  // Typage explicite de l'erreur ici
                console.error("Error fetching fire data:", error);
    
                // Vérifie et log l'erreur en cas de problème
                if (error instanceof AxiosError) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
    
                toast.error("Error fetching fire data.");
            }
        };
    
        fetchFire();
    }, [id_fire, backendUrl]);
    
    
    useEffect(() => {
        const fetchVehicles = async () => {
            if (!geopuserID) {
                console.warn("No user ID provided");
                return;
            }
    
            console.log("Fetching vehicles for user ID:", geopuserID); // Ajout du log pour voir si l'ID est correct
    
            try {
                const response = await fetch(
                    `${backendUrl}/api/geop/vehicule/${geopuserID}`
                );
    
                if (!response.ok) {
                    throw new Error(`Failed to fetch vehicles. Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("API response for vehicles:", data); // Debug: voir la structure de data
    
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
    }, [geopuserID, backendUrl]); // Déclenchement à chaque changement de `geopuserID`
    
    

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
            !formData.volume_fire ||
            !formData.ref_fire ||
            !formData.purch_date_fire ||
            !formData.exp_date_fire ||
            !formData.cost_fire ||
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
                `${backendUrl}/api/geop/updatefire/${id_fire}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating fire.");
            }

            const result = await response.json();

            toast.success(translate("Fire updated successfully!"), {
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
            console.error("Error updating fire:", error);
            toast.error(translate("Error updating fire. Please try again"), {
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
                <Modal.Title>{translate("Edit")}</Modal.Title>
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
                    <Form.Group controlId="volume_fire">
                        <Form.Label>{translate("Volume")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.volume_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="purch_date_fire">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.purch_date_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="exp_date_fire">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.exp_date_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="cost_fire">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cost_fire}
                            onChange={handleChange}
                        />
                    </Form.Group>
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
                    <Button variant="secondary" onClick={handleClose}>
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

export default EditFireModal;
