import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import Select from "react-select";



interface EditTrainingModalProps {
    show: boolean;
    onHide: () => void;
    id_training: number | null;
    onSuccess?: () => void;
}

interface Driver {
    id_conducteur: number;
    nom_conducteur: string;
    prenom_conducteur: string;
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
        id_conducteur: "",
        date_start_training: "",
        date_end_training: "",
        type_training: "",
     
    });

    const { translate } = useTranslate();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const geopuserID = localStorage.getItem("GeopUserID");


    useEffect(() => {
        console.log("useEffect triggered - show:", show, "geopuserID:", geopuserID);
    
        if (show && geopuserID) { // Vérifie si geopuserID est défini avant d'exécuter la requête
            const fetchDrivers = async () => {
                try {
                    console.log("Fetching drivers for geopuserID:", geopuserID);
                    const response = await fetch(`${backendUrl}/api/geop/drivers/${geopuserID}`);
    
                    if (!response.ok) throw new Error("Failed to fetch drivers");
    
                    const data = await response.json();
                    console.log("Drivers data received from API:", data);
    
                    const drivers = Array.isArray(data.vehicles)
                        ? data.vehicles
                            .filter((driver: any) =>
                                driver.nom_conducteur?.trim() !== "" && driver.prenom_conducteur?.trim() !== ""
                            )
                            .map((driver: any) => ({
                                id_conducteur: driver.id_conducteur,
                                nom_conducteur: driver.nom_conducteur,
                                prenom_conducteur: driver.prenom_conducteur,
                            }))
                        : [];
    
                    console.log("Filtered drivers:", drivers);
                    setDrivers(drivers);
                } catch (error) {
                    console.error("Error fetching drivers:", error);
                    setDrivers([]);
                }
            };
    
            setTimeout(fetchDrivers, 500); // Ajoute un délai pour laisser le temps aux données de se charger
        }
    }, [show, backendUrl, geopuserID]);
    
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

    useEffect(() => {
        console.log("Valeur de geopuserID:", geopuserID); // Vérifier ce qui est stocké
      
        if (show && geopuserID) { // Vérification supplémentaire
          const fetchDrivers = async () => {
            try {
              const response = await fetch(`${backendUrl}/api/geop/drivers/${geopuserID}`);
      
              if (!response.ok) {
                throw new Error(`Failed to fetch drivers: ${response.status}`);
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
      
       useEffect(() => {
              if (formData.date_start_training) {
                const startDate = new Date(formData.date_start_training);
                if (!isNaN(startDate.getTime())) {
                  const endDate = new Date(startDate);
                  endDate.setFullYear(endDate.getFullYear() + 3);
                  // On utilise toISOString pour obtenir le format YYYY-MM-DD
                  const formattedEndDate = endDate.toISOString().split("T")[0];
                  setFormData(prev => ({
                    ...prev,
                    date_end_training: formattedEndDate,
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    date_end_training: "",
                  }));
                }
              } else {
                setFormData(prev => ({
                  ...prev,
                  date_end_training: "",
                }));
              }
            }, [formData.date_start_training]);
          
            // Mise à jour de la date de début via onChange
            const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              setFormData(prev => ({ ...prev, date_start_training: value }));
            };
      

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };
    const handleClose = () => {
        setFormData({
            id_training:"",
            id_conducteur: "",
            date_start_training: "",
            date_end_training: "",
            type_training: "",
        });
        onHide(); // Fermer le modal après la réinitialisation
    };
    

    const validateForm = () => {
        // Vérifier si tous les champs sont remplis
        if (
            !formData.id_conducteur ||
            !formData.date_start_training ||
            !formData.date_end_training ||
            !formData.type_training
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
    
        // Vérifier que la date de début est antérieure à la date de fin
        const startDate = new Date(formData.date_start_training); // Convertir en objet Date
        const endDate = new Date(formData.date_end_training); // Convertir en objet Date
    
        if (startDate > endDate) {
            toast.error(translate("Start date must be earlier than end date"), {
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

    const trainingOptions = [
        { value: "DT", label: translate("Driving Test")}, 
      ];
    
      const handletrainingTypeChange = (selectedOption: any, actionMeta: any) => {
        const { name } = actionMeta;
        const value = selectedOption ? selectedOption.value : "";
    
        setFormData({
          ...formData,
          [name]: value,
        });
        console.log(formData); 
    
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

            toast.success(translate("Updated successfully!"), {                position: "bottom-right",
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
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Edit")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    
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

                   

                    <Form.Group controlId="date_start_training">
                        <Form.Label>{translate("Start Date")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_training}
                            onChange={handleStartDateChange}
                        />
                    </Form.Group>


                    <Form.Group controlId="date_end_training">
                        <Form.Label>{translate("End Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_end_training}
                            readOnly
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="type_training">
                        <Form.Label>{translate("Type")}{translate(" *")}</Form.Label>
                        <Select
              options={trainingOptions}
              onChange={handletrainingTypeChange}
              name="type_training"
              value={trainingOptions.find(
                (option) => option.value === formData.type_training
              )}
              isClearable
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

export default EditTrainingModal;
