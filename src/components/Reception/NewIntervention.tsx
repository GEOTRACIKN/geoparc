import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../../utilities/functions";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

const geopuserID = localStorage.getItem("GeopUserID");

interface ModalNewInterventionnProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const ModalNewIntervention: React.FC<ModalNewInterventionnProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        date: "",
        priority: "",
        statut: "Demande",
        id_vehicule: "",
        km: "",
        subject: "",
        client: "",
        clientPhone: "",
        receptionistName: "",
        service: 0,
    });

    const { translate } = useTranslate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Liste des véhicules
    

    const serviceOptions: { [key: string]: number } = {
        "Garage": 1,
        "Planification d'entretien": 2,
        "Entretien": 3,
        "Changement De Pneu": 4,
        "Changement de Pièce": 5,
    };
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

        if (id === "service") {
            // Convertir la valeur sélectionnée en nombre
            const serviceId = serviceOptions[value] || 0;
            setFormData(prevState => ({
                ...prevState,
                [id]: serviceId,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
            }));
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formattedDate = formatDateToTimestamp(formData.date);

        // Mettre à jour formData avec la date formatée
        const updatedFormData = {
            ...formData,
            date: formattedDate,
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewintervention/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de l'ajout de l'intervention.");
            }

            const result = await response.json();
            console.log(result);

            // Afficher une notification de succès
            toast.success(translate("Added successfully!"), {
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

            // Réinitialiser le formulaire
            setFormData({
                date: "",
                priority: "",
                statut: "",
                id_vehicule: "",
                km: "",
                subject: "",
                client: "",
                clientPhone: "",
                receptionistName: "",
                service: 0,
            });

            // Rafraîchir les données
            if (onSuccess) {
                onSuccess(); // Appel du callback pour rafraîchir le tableau
            }
            // Fermer le modal
            onHide();

        } catch (error) {
            console.error(error);

            // Afficher une notification d'erreur
            toast.error("Error adding intervention. Please try again.", {
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
                    <Form.Group controlId="date">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="priority">
                        <Form.Label>{translate("Priority")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Priority")}</option>
                            <option value="Normal">{translate("Normal")}</option>
                            <option value="Urgent">{translate("Urgent")}</option>
                        </Form.Control>
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

                    <Form.Group controlId="km">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le kilométrage"
                            value={formData.km}
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

                    <Form.Group controlId="subject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez l'objet de la demande"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="client">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du client"
                            value={formData.client}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="clientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le numéro de téléphone du client"
                            value={formData.clientPhone}
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

                    <Form.Group controlId="receptionistName">
                        <Form.Label>{translate("Receptionist Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du réceptionniste"
                            value={formData.receptionistName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="service">
                        <Form.Label>{translate("Service")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={Object.keys(serviceOptions).find(key => serviceOptions[key] === formData.service) || ""}
                            onChange={handleChange}
                        >
                            <option value="">{translate("Select Service")}</option>
                            {Object.entries(serviceOptions).map(([key, value]) => (
                                <option key={value} value={key}>{translate(key)}</option>
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

export default ModalNewIntervention;
