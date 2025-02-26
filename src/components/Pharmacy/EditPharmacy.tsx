import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import dayjs from "dayjs"; 
import Select from "react-select";

interface EditPharmacyModalProps {
    show: boolean;
    onHide: () => void;
    id_pharmacy: number | null; // ID de la pharmacie à modifier
    onSuccess?: () => void;
}

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
    const geopuserID = localStorage.getItem("GeopUserID");

    const { translate } = useTranslate();
    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Charger les données de la pharmacie existante

    useEffect(() => {
        // Vérifie si l'id_pharmacy est valide avant de faire l'appel API
        if (!id_pharmacy) {
            console.error("id_pharmacy is invalid");
            return;
        }
    
        const fetchPharmacy = async () => {
            try {
                // Logge l'URL de l'API pour vérifier qu'elle est correcte
                console.log("URL de l'API :", `${backendUrl}/api/geop/showpharmacy/${id_pharmacy}`);
    
                const response = await axios.get(`${backendUrl}/api/geop/showpharmacy/${id_pharmacy}`);
                const data = response.data;
    
                // Logge les données reçues pour s'assurer que tout est bien là
                console.log("Données reçues : ", JSON.stringify(data, null, 2));
    
                if (!data || !data.id_pharmacy) {
                    toast.error("Pharmacy data not found.");
                    return;
                }
    
                // Parse et formate les dates, en vérifiant leur validité
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
                    purch_date_pharmacy: toDateInputFormat(data.purch_date_pharmacy),
                    exp_date_pharmacy: toDateInputFormat(data.exp_date_pharmacy),
                };
                
                // Lors de l’envoi des données au backend
                const payload = {
                    ...formData,
                    purch_date_pharmacy: fromDateInputFormat(formData.purch_date_pharmacy),
                    exp_date_pharmacy: fromDateInputFormat(formData.exp_date_pharmacy),
                };
                
                console.log("Données formatées :", formattedData);
                
                // Mettre à jour le state avec les dates formatées
                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
                // Logge les données formatées pour vérifier
                console.log("Données formatées :", formattedData);
    
                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
            } catch (error: unknown) {  // Typage explicite de l'erreur ici
                console.error("Error fetching pharmacy data:", error);
    
                // Vérifie et log l'erreur en cas de problème
                if (error instanceof AxiosError) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
    
                toast.error("Error fetching pharmacy data.");
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
    const handleClose = () => {
        setFormData({
            id_pharmacy: "",
        product_pharmacy: "",
        purch_date_pharmacy: "",
        exp_date_pharmacy: "",
        cost_pharmacy: "",
        type_pharmacy: "",
        id_vehicule: "",
        });
        onHide(); // Fermer le modal après la réinitialisation
    };


    const validateForm = () => {
        if (
            !formData.product_pharmacy ||
            
            !formData.exp_date_pharmacy ||
           
            
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
        <Modal show={show} onHide={onHide} backdrop="static">
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
                        <Form.Group controlId="id_vehicule">
                    <Form.Label>{translate("Vehicle")}</Form.Label>
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

export default EditPharmacyModal;
