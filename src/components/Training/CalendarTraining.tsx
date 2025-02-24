import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModalDeleteTraining from "./DeleteTraining";  // Import your delete modal component

interface CalendarTrainingModalProps {
    show: boolean;
    onHide: () => void;
    id_training: number | null;
    onSuccess?: () => void;
    mode: "create" | "edit";
}

interface Driver {
    id_conducteur: number;
    nom_conducteur: string;
    prenom_conducteur: string;
}

const CalendarTrainingModal: React.FC<CalendarTrainingModalProps> = ({
    show,
    onHide,
    id_training,
    onSuccess,
    mode,
}) => {
    const [formData, setFormData] = useState({
        id_training: mode === "create" ? "" : id_training || "",
        id_conducteur: "",
        date_start_training: "",
        date_end_training: "",
        type_training: "",
    });

    const { translate } = useTranslate();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isEditable, setIsEditable] = useState(false);  // Start in view mode (non-editable)
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal

    const geopuserID = localStorage.getItem("GeopUserID");
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const trainingOptions = [
        { value: "DT", label: translate("Driving Test") },
    ];
    
    const mapTrainingType = (type: string) => {
        const found = trainingOptions.find(option => option.value === type);
        return found ? found.label : type; // Retourne le label ou la valeur brute si non trouvée
    };



    useEffect(() => {
        if (show) {
            const fetchDrivers = async () => {
                try {
                    const response = await fetch(`${backendUrl}/api/geop/drivers/${geopuserID}`);
                    if (!response.ok) throw new Error("Failed to fetch drivers");

                    const data = await response.json();
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

                    setDrivers(drivers);
                } catch (error) {
                    console.error("Error fetching drivers:", error);
                    setDrivers([]);
                }
            };

            fetchDrivers();
        }

        // Reset isEditable to false whenever the modal is shown to ensure it's in view mode
        setIsEditable(false);
    }, [show, backendUrl, geopuserID]);

    useEffect(() => {
        if (!id_training) return;

        const fetchTraining = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showtraining/${id_training}`);
                const data = response.data;

                if (!data || !data.id_training) {
                    toast.error("Training data not found.");
                    return;
                }

                const toDateInputFormat = (date: string) => {
                    const [day, month, year] = date.split('/');
                    return `${year}-${month}-${day}`;
                };

                const formattedData = {
                    ...data,
                    date_start_training: toDateInputFormat(data.date_start_training),
                    date_end_training: toDateInputFormat(data.date_end_training),
                };

                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
            } catch (error: unknown) {
                console.error("Error fetching training data:", error);
                toast.error("Error fetching training data.");
            }
        };

        fetchTraining();
    }, [id_training, backendUrl]);


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

    const validateForm = () => {
        if (
            !formData.id_conducteur ||
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

        const startDate = new Date(formData.date_start_training);
        const endDate = new Date(formData.date_end_training);

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

    const handleClose = () => {
        onHide();
        setIsEditable(false);  // Reset to view mode when modal is closed
    };

    const handleDeleteSuccess = () => {
        onHide();  // Close the modal when delete is successful
    };

    return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header>
        <div className="d-flex justify-content-between align-items-center w-100">
    <Modal.Title>{isEditable ? translate("Edit Training") : translate("View Training")}</Modal.Title>
    <div className="d-flex gap-1">
        {!isEditable && (
            <Button variant="outline-primary" onClick={() => setIsEditable(true)}>
                <FaEdit />
            </Button>
        )}
        <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
            <FaTrash />
        </Button>
    </div>
</div>

</Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                <Form.Group controlId="id_conducteur">
    <Form.Label>{translate("Driver")}</Form.Label>
    <Form.Control
        as="select"
        value={String(formData.id_conducteur)} // 🔥 Convertit en string pour éviter l'erreur
        onChange={handleChange}
        disabled={!isEditable}
    >
        <option value="">{translate("Select Driver")}</option>
        {drivers.length === 0 ? (
            <option value="">{translate("No drivers available")}</option>
        ) : (
            drivers.map((driver) => (
                <option key={driver.id_conducteur} value={String(driver.id_conducteur)}> 
                    {`${driver.nom_conducteur} ${driver.prenom_conducteur}`}
                </option>
            ))
        )}
    </Form.Control>
</Form.Group>


                    <Form.Group controlId="date_start_training">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_training}
                            onChange={handleStartDateChange}
                            disabled={!isEditable}
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
                        <Form.Label>{translate("Training Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={isEditable ? formData.type_training : mapTrainingType(formData.type_training)}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    {isEditable ? (
                        <Button type="submit">{translate("Save")}</Button>
                        
                    ) : (
                        <Button variant="secondary" onClick={handleClose}>
                            {translate("Close")}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>

            <ModalDeleteTraining
    show={showDeleteModal}
    onHide={() => setShowDeleteModal(false)}
    id_training={id_training}
    onSuccess={() => {
        handleDeleteSuccess();
        onSuccess?.();  // Call the parent onSuccess as well
    }}
/>

        </Modal>
    );
};

export default CalendarTrainingModal;
