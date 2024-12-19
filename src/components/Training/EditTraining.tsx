import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';


interface EditTrainingModalProps {
    show: boolean;
    onHide: () => void;
    id_training: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const EditTrainingModal: React.FC<EditTrainingModalProps> = ({
    show,
    onHide,
    id_training,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_training: "",
        nom_training: "",
        date_start_training: "",
        date_end_training: "",
        type_training: "",
     
    });

    const { translate } = useTranslate();
   
    useEffect(() => {
        // Vérifie si l'id_training est valide avant de faire l'appel API
        if (!id_training) {
            console.error("id_training is invalid");
            return;
        }
    
        const fetchTraining = async () => {
            try {
                // Logge l'URL de l'API pour vérifier qu'elle est correcte
                console.log("URL de l'API :", `${backendUrl}/api/geop/showtraining/${id_training}`);
    
                const response = await axios.get(`${backendUrl}/api/geop/showtraining/${id_training}`);
                const data = response.data;
    
                // Logge les données reçues pour s'assurer que tout est bien là
                console.log("Données reçues : ", JSON.stringify(data, null, 2));
    
                if (!data || !data.id_training) {
                    toast.error("Training data not found.");
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
                    date_start_training: toDateInputFormat(data.date_start_training),
                    date_end_training: toDateInputFormat(data.date_end_training),
                };
                
                // Lors de l’envoi des données au backend
                const payload = {
                    ...formData,
                    date_start_training: fromDateInputFormat(formData.date_start_training),
                    date_end_training: fromDateInputFormat(formData.date_end_training),
                };
                
                console.log("Données formatées :", formattedData);
                
                // Mettre à jour le state avec les dates formatées
                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
                
            } catch (error: unknown) {  // Typage explicite de l'erreur ici
                console.error("Error fetching training data:", error);
    
                // Vérifie et log l'erreur en cas de problème
                if (error instanceof AxiosError) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
    
                toast.error("Error fetching training data.");
            }
        };
    
        fetchTraining();
    }, [id_training, backendUrl]);
    
    


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const validateForm = () => {
        if (
            !formData.nom_training ||
            !formData.date_start_training ||
            !formData.date_end_training ||
            !formData.type_training 
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

       

       

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(
                `${backendUrl}/api/geop/updatetraining/${id_training}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating training.");
            }

            const result = await response.json();

            toast.success("Training updated successfully!", {
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
            console.error("Error updating training:", error);
            toast.error("Error updating training. Please try again.", {
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
                    <Form.Group controlId="nom_training">
                        <Form.Label>{translate("Nom")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.nom_training}
                            onChange={handleChange}
                        />
                    </Form.Group>
                   
                    <Form.Group controlId="date_start_training">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_training}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="date_end_training">
                        <Form.Label>{translate("Expiration Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_end_training}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="type_training">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_training}
                            onChange={handleChange}
                        />
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

export default EditTrainingModal;
