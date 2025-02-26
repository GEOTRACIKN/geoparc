import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";


// Définir les types pour les props
interface ModalNewTrainingProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}
type Driver = {
    id_conducteur: number;
    nom_conducteur: string;
    prenom_conducteur: string;
  };
// Définir le type pour un véhicule


const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalNewTraining: React.FC<ModalNewTrainingProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_conducteur: "",
        date_start_training: "",
        date_end_training: "",
        type_training: "",
      
    });

    const { translate } = useTranslate();
      const [drivers, setDrivers] = useState<Driver[]>([]);
      const id_user = localStorage.getItem("GeopUserID");


      useEffect(() => {
        console.log("🔄 useEffect triggered!");
        console.log("✅ show:", show, "🆔 geopuserID:", id_user);
    
        if (show && id_user) { // Vérifie que id_user est bien défini
            const fetchDrivers = async () => {
                try {
                    console.log("🚀 Fetching drivers for id_user:", id_user);
                    const response = await fetch(`${backendUrl}/api/geop/drivers/${id_user}`);
    
                    if (!response.ok) {
                        throw new Error(`❌ Failed to fetch drivers: ${response.status}`);
                    }
    
                    const data = await response.json();
                    console.log("📦 Drivers data received from API:", data);
    
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
    
                    console.log("✅ Filtered drivers:", drivers);
                    setDrivers(drivers);
                } catch (error) {
                    console.error("❌ Error fetching drivers:", error);
                    setDrivers([]);
                }
            };
    
            fetchDrivers();
        } else {
            console.log("⚠️ Conditions non remplies: soit `show` est faux, soit `id_user` est undefined.");
        }
    }, [show, backendUrl, id_user]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };
    const handleClose = () => {
      setFormData({
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
            toast.error("Start date must be earlier than end date.", {
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
            const response = await fetch(`${backendUrl}/api/geop/addnewtraining/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error adding training.");
            }

            const result = await response.json();

            toast.success("Training added successfully!", {
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
                id_conducteur: "",
                date_start_training: "",
                date_end_training: "",
                type_training: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error adding training:", error);
            toast.error("Error adding training. Please try again.", {
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
                <Form.Group controlId="id_conducteur">
    <Form.Label>{translate("Driver")}</Form.Label>
    <Select
    options={drivers.map(driver => ({
        value: driver.id_conducteur,
        label: `${driver.prenom_conducteur} ${driver.nom_conducteur}`
    }))}
    placeholder={translate("Select Driver")}
    isLoading={drivers.length === 0}
    noOptionsMessage={() => translate("No drivers available")}
    onChange={(selectedOption) => {
        setFormData(prev => ({
            ...prev,
            id_conducteur: selectedOption ? String(selectedOption.value) : ""
        }));
    }}
/>

</Form.Group>

                  
                    {/* Purchase Date */}
                    <Form.Group controlId="date_start_training">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_training}
                            onChange={handleStartDateChange}
                        />
                    </Form.Group>

                    {/* Expiry Date */}
                    <Form.Group controlId="date_end_training">
                        <Form.Label>{translate("End Date")}</Form.Label>
                    <Form.Control
                        type="date"
                        value={formData.date_end_training} // La date est calculée automatiquement
                        readOnly // Empêche la modification manuelle
                    />
                </Form.Group>
                                

                    {/* Type */}
                    <Form.Group controlId="type_training">
                        <Form.Label>{translate("Type")}</Form.Label>
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
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewTraining;
function setSelectedTrainingType(arg0: { value: string; label: string; } | null) {
    throw new Error("Function not implemented.");
}

