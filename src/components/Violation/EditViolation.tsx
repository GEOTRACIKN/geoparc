import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosError } from 'axios';
import Select from "react-select";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";

import dayjs from "dayjs"; 
import { formatDateToTimestamp } from "../../utilities/functions";

interface ModalEditViolationProps {
    show: boolean;
    onHide: () => void;
    id_violation: number | null; // ID de la pharmacie à modifier
    onSuccess?: () => void;
}
type Driver = {
  id_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
};
// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalEditViolation: React.FC<ModalEditViolationProps> = ({
    show,
    onHide,
    id_violation,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_violation: "",
        id_conducteur: "",
        type_violation: "",
        id_vehicule: "",
        date_violation: "",
        cost: 0,
        description: "",
    });
    const geopuserID = localStorage.getItem("GeopUserID");



    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
      const [drivers, setDrivers] = useState<Driver[]>([]);
    
    const { translate } = useTranslate();

    useEffect(() => {
        // Vérifie si l'id_violation est valide avant de faire l'appel API
        if (!id_violation) {
            console.error("id_violation is invalid");
            return;
        }
    
        const fetchViolation = async () => {
            try {
                // Log de l'URL de l'API
                console.log("URL de l'API :", `${backendUrl}/api/geop/showviolation/${id_violation}`);
    
                const response = await axios.get(`${backendUrl}/api/geop/showviolation/${id_violation}`);
                const data = response.data;
    
                // Log des données reçues
                console.log("Données reçues : ", JSON.stringify(data, null, 2));
    
                if (!data || !data.id_violation) {
                    toast.error("Violation data not found.");
                    return;
                }
    
                // Fonction pour convertir une date au format 'YYYY-MM-DDTHH:mm' attendu par le champ datetime-local
                const toDatetimeLocalFormat = (date: string) => {
                    const [day, month, year, time] = date.split(/[/ ]/); // Sépare par "/" et espace
                    return `${year}-${month}-${day}T${time}`;
                };
    
                // Formater la date pour le champ input
                const formattedData = {
                    ...data,
                    date_violation: toDatetimeLocalFormat(data.date_violation), // Conversion au format 'YYYY-MM-DDTHH:mm'
                };
    
                // Log des données formatées
                console.log("Données formatées :", formattedData);
    
                // Mise à jour du state avec les données formatées
                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
            } catch (error: unknown) {
                console.error("Error fetching violation data:", error);
    
                // Gestion explicite des erreurs
                if (axios.isAxiosError(error)) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
    
                toast.error("Error fetching violation data.");
            }
        };
    
        fetchViolation();
    }, [id_violation, backendUrl]);
    
    
    
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



     useEffect(() => {
        if (show) {
          const fetchDrivers = async () => {
            try {
              const response = await fetch(`${backendUrl}/api/geop/drivers/${geopuserID}`);
      
              if (!response.ok) {
                throw new Error("Failed to fetch drivers");
              }
      
              const data = await response.json();
              console.log("Drivers data received from API:", data);
      
              const drivers = Array.isArray(data.vehicles)
                ? data.vehicles
                    .filter(
                      (driver: any) =>
                        driver.nom_conducteur?.trim() !== "" &&
                        driver.prenom_conducteur?.trim() !== ""
                    )
                    .map((driver: any) => ({
                      id_conducteur: driver.id_conducteur,
                      nom_conducteur: driver.nom_conducteur,
                      prenom_conducteur: driver.prenom_conducteur,
                    }))
                : [];
      
              setDrivers(drivers);
            } catch (error) {
              console.error("Error fetching drivers:", error);
              setDrivers([]);
            }
          };
      
          fetchDrivers();
        }
      }, [show, backendUrl, geopuserID]);
    
     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const { id, value } = e.target;
            setFormData((prevState) => ({
                ...prevState,
                [id]: value,
            }));
        };
    
      // Pour le champ de type de violation
      const violationOptions = [
        { value: "Speed", label: translate("Speed")}, 
        { value: "Over Speed", label: translate("Over Speed") },
        { value: "Insufficient Break", label: translate("Insufficient Break") },
        { value: "Night Driving", label: translate("Night Driving")},
        { value: "Overtime Driving", label: translate("Overtime Driving") },
        { value: "Other", label: translate("Other")},
      ];
      const handleViolationTypeChange = (selectedOption: any, actionMeta: any) => {
        const { name } = actionMeta;
        const value = selectedOption ? selectedOption.value : "";
    
        setFormData({
          ...formData,
          [name]: value,
        });
        console.log(formData); 
    
      };
    
      const handleCustomTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData});
        console.log(formData);  // Affiche les données dans la console
      };
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleClose = () => {
        setFormData({
            id_violation: "",
            id_conducteur: "",
            type_violation: "",
            id_vehicule: "",
            date_violation: "",
            cost: 0,
            description: "",
        });
        onHide(); // Fermer le modal après la réinitialisation
    };

    const validateForm = () => {
        console.log("Validation du formulaire...");
        console.log("ID Conducteur :", formData.id_conducteur);
        console.log("Type Violation :", formData.type_violation);
        console.log("ID Véhicule :", formData.id_vehicule);
        console.log("Date Violation :", formData.date_violation);
        console.log("Coût :", formData.cost);
        console.log("Description :", formData.description);
    
        let isValid = true;
    
        if (!formData.id_conducteur) {
            toast.error("L'ID Conducteur est requis !");
            isValid = false;
        }
    
        if (!formData.type_violation) {
            toast.error("Le type de violation est requis !");
            isValid = false;
        }
    
        if (!formData.id_vehicule) {
            toast.error("L'ID Véhicule est requis !");
            isValid = false;
        }
    
        if (!formData.date_violation || !dayjs(formData.date_violation, "YYYY-MM-DDTHH:mm", true).isValid()) {
            toast.error("La date de violation est invalide !");
            isValid = false;
        }
    
       
    
      
    
        return isValid;
    };
    
  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(
                `${backendUrl}/api/geop/updateviolation/${id_violation}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating violation.");
            }

            const result = await response.json();

            toast.success(translate("Updated successfully!"), {        
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
            console.error("Error updating violation:", error);
            toast.error("Error updating violation. Please try again.", {
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
            <Modal.Body
          style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
        >
           <Form.Group controlId="type_violation">
            <Form.Label>{translate("Violation type")}{translate(" *")}</Form.Label>
            <Select
              options={violationOptions}
              onChange={handleViolationTypeChange}
              name="type_violation"
              value={violationOptions.find(
                (option) => option.value === formData.type_violation
              )}
              isClearable
            />
          </Form.Group>
         
          <Form.Group controlId="id_conducteur">
            <Form.Label>{translate("Driver")}{translate(" *")}</Form.Label>
            <Select
                options={drivers.map(driver => ({
                    value: driver.id_conducteur, // Numéro du conducteur
                    label: `${driver.nom_conducteur} ${driver.prenom_conducteur}` // Nom complet
                })) as { value: number; label: string }[]} // 🔥 Correction du typage

                placeholder={translate("Select Driver")}
                isLoading={drivers.length === 0} // Affiche un loader si les données ne sont pas encore chargées
                noOptionsMessage={() => translate("No drivers available")}
                isSearchable // Active la recherche

                // 🔥 Correction de la sélection automatique avec conversion en string
                value={drivers
                    .map(driver => ({
                        value: driver.id_conducteur,
                        label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`
                    }))
                    .find(option => String(option.value) === String(formData.id_conducteur)) || null
                }

                onChange={(selectedOption) => {
                    setFormData(prev => ({
                        ...prev,
                        id_conducteur: selectedOption ? String(selectedOption.value) : "" // 🔥 Correction de l'affectation
                    }));
                }}
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

          <Form.Group controlId="date">
            <Form.Label>{translate("Date Violation")}{translate(" *")}</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date_violation}
              onChange={handleInputChange}
              placeholder="Enter Date and Time here"
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>{translate("Description")}</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description here"
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

export default ModalEditViolation;
