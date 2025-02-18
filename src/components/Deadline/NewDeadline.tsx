import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";

// Définir les types pour les props
interface ModalNewDeadlineProps {
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

const ModalNewDeadline: React.FC<ModalNewDeadlineProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_conducteur: "",
        date_start_Deadline: "",
        date_end_Deadline: "",
        type_Deadline: "",
      
    });

    const { translate } = useTranslate();
      const [drivers, setDrivers] = useState<Driver[]>([]);

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

    const validateForm = () => {
        // Vérifier si tous les champs sont remplis
        if (
            !formData.id_conducteur ||
            !formData.date_start_Deadline ||
            !formData.date_end_Deadline ||
            !formData.type_Deadline
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
    
        // Vérifier que la date de début est antérieure à la date de fin
        const startDate = new Date(formData.date_start_Deadline); // Convertir en objet Date
        const endDate = new Date(formData.date_end_Deadline); // Convertir en objet Date
    
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
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewDeadline/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error adding Deadline.");
            }

            const result = await response.json();

            toast.success("Deadline added successfully!", {
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
                date_start_Deadline: "",
                date_end_Deadline: "",
                type_Deadline: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error adding Deadline:", error);
            toast.error("Error adding Deadline. Please try again.", {
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
                    <Form.Group controlId="id_conducteur">
                       <Form.Label>{translate("Driver")}</Form.Label>
                       <Form.Control
                           as="select"
                           value={formData.id_conducteur}
                           onChange={handleChange}
                       >
                           <option value="">{translate("Select Driver")}</option>
                           {drivers.length === 0 ? (
                               <option value="">{translate("No drivers available")}</option>
                           ) : (
                               drivers.map((driver) => (
                                   <option key={driver.id_conducteur} value={driver.id_conducteur}>
                                       {`${driver.prenom_conducteur} ${driver.nom_conducteur}`}
                                   </option>
                               ))
                           )}
                       </Form.Control>
                   </Form.Group>

                  
                    {/* Purchase Date */}
                    <Form.Group controlId="date_start_Deadline">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_Deadline}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* Expiry Date */}
                    <Form.Group controlId="date_end_Deadline">
                        <Form.Label>{translate("End Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_end_Deadline}
                            onChange={handleChange}
                        />
                    </Form.Group>

                 

                    {/* Type */}
                    <Form.Group controlId="type_Deadline">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_Deadline}
                            onChange={handleChange}
                        />
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

export default ModalNewDeadline;
