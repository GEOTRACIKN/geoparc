import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import Select from "react-select";

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}


interface EditPneuModalProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null; // ID du pneu à modifier
    onSuccess?: () => void;
}
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditPneuModal: React.FC<EditPneuModalProps> = ({
    show,
    onHide,
    id_pneu,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        reference_pneu: "",
        date_achat_pneu: "",
        cout_pneu: "",
        type_pneu: "",
        id_vehicule: "",
    });

    const [vehicules, setVehicles] = useState<Vehicle[]>([]);
    const geopuserID = localStorage.getItem("GeopUserID");

    const { translate } = useTranslate();
    
  

    // Charger les données du pneu existant
    useEffect(() => {
        if (!id_pneu) {
            console.error("ID du pneu invalide");
            return;
        }

        const fetchPneu = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showpneu/${id_pneu}`);
                const data = response.data;

                if (!data || !data.id_pneu) {
                    toast.error("Données du pneu introuvables.");
                    return;
                }

               
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));

            } catch (error: unknown) {
                console.error("Erreur lors de la récupération des données du pneu:", error);
                if (error instanceof AxiosError) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
            }
        };

        fetchPneu();
    }, [id_pneu, backendUrl]);


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                if (!geopuserID) {
                    console.warn("Aucun ID utilisateur fourni");
                    return;
                }

                const response = await fetch(
                    `${backendUrl}/api/geop/vehicule/${geopuserID}`
                );

                if (!response.ok) {
                    throw new Error(`Échec de la récupération des véhicules. Statut: ${response.status}`);
                }

                const data = await response.json();
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des véhicules:", error);
                toast.error("Erreur lors de la récupération des véhicules.", {
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
    }, [geopuserID, backendUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleClose = () => {
        setFormData({
            id_pneu: "",
            reference_pneu: "",
            date_achat_pneu: "",
            cout_pneu: "",
            type_pneu: "",
            id_vehicule: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (
            !formData.reference_pneu ||
            !formData.id_vehicule
        ) {
            toast.error(translate("Veuillez remplir tous les champs"), {
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

        const selectedVehicle = vehicules.find(
            (vehicule) => String(vehicule.id_vehicule) === String(formData.id_vehicule)
        );

        if (!selectedVehicle) {
            toast.error("Veuillez sélectionner un véhicule valide.", {
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
                `${backendUrl}/api/geop/updatepneu/${id_pneu}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du pneu.");
            }

            const result = await response.json();

            toast.success(translate("Mise à jour réussie!"), {
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
            console.error("Erreur lors de la mise à jour du pneu:", error);
            toast.error(translate("Erreur lors de la mise à jour. Veuillez réessayer."), {
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
                <Modal.Title>{translate("Modifier le Pneu")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="reference_pneu">
                        <Form.Label>{translate("Référence")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.reference_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Véhicule")}{translate(" *")}</Form.Label>
                        <Select
                            options={vehicules.map(vehicule => ({
                                value: vehicule.id_vehicule,
                                label: vehicule.immatriculation_vehicule
                            })) as unknown as { value: number; label: string }[]}
                            placeholder={translate("Sélectionner le véhicule")}
                            isLoading={vehicules.length === 0}
                            noOptionsMessage={() => translate("Aucun véhicule disponible")}
                            isSearchable
                            value={vehicules
                                .map(vehicule => ({
                                    value: vehicule.id_vehicule,
                                    label: vehicule.immatriculation_vehicule
                                }))
                                .find(option => String(option.value) === String(formData.id_vehicule)) || null
                            }
                            onChange={(selectedOption) => {
                                setFormData(prev => ({
                                    ...prev,
                                    id_vehicule: selectedOption ? String(selectedOption.value) : ""
                                }));
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Date d'Achat")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_achat_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                 

                    <Form.Group controlId="cout_pneu">
                        <Form.Label>{translate("Coût")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cout_pneu}
                            onChange={handleChange}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="type_pneu">
                        <Form.Label>{translate("Type de Pneu")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Fermer")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Mettre à jour")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditPneuModal;
