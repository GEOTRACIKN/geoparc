import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ModalDeleteDeadline from "./DeleteDeadline";  // Import your delete modal component

interface CalendarDeadlineModalProps {
    show: boolean;
    onHide: () => void;
    id_deadline: number | null;
    onSuccess?: () => void;
    mode: "create" | "edit";
}

interface Driver {
    id_conducteur: number;
    nom_conducteur: string;
    prenom_conducteur: string;
}

const CalendarDeadlineModal: React.FC<CalendarDeadlineModalProps> = ({
    show,
    onHide,
    id_deadline,
    onSuccess,
    mode,
}) => {
    const [formData, setFormData] = useState({
        id_deadline: mode === "create" ? "" : id_deadline || "",
        id_conducteur: "",
        date_start_Deadline: "",
        date_end_Deadline: "",
        type_Deadline: "",
    });

    const { translate } = useTranslate();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isEditable, setIsEditable] = useState(false);  // Start in view mode (non-editable)
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal

    const geopuserID = localStorage.getItem("GeopUserID");
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
        if (!id_deadline) return;

        const fetchDeadline = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showDeadline/${id_deadline}`);
                const data = response.data;

                if (!data || !data.id_deadline) {
                    toast.error("Deadline data not found.");
                    return;
                }

                const toDateInputFormat = (date: string) => {
                    const [day, month, year] = date.split('/');
                    return `${year}-${month}-${day}`;
                };

                const formattedData = {
                    ...data,
                    date_start_Deadline: toDateInputFormat(data.date_start_Deadline),
                    date_end_Deadline: toDateInputFormat(data.date_end_Deadline),
                };

                setFormData((prev) => ({
                    ...prev,
                    ...formattedData,
                }));
            } catch (error: unknown) {
                console.error("Error fetching Deadline data:", error);
                toast.error("Error fetching Deadline data.");
            }
        };

        fetchDeadline();
    }, [id_deadline, backendUrl]);

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

        const startDate = new Date(formData.date_start_Deadline);
        const endDate = new Date(formData.date_end_Deadline);

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
                `${backendUrl}/api/geop/updateDeadline/${id_deadline}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating Deadline.");
            }

            const result = await response.json();

            toast.success("Deadline updated successfully!", {
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
            console.error("Error updating Deadline:", error);
            toast.error("Error updating Deadline. Please try again.", {
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
            <Modal.Header closeButton>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <Modal.Title>{isEditable ? translate("Edit Deadline") : translate("View Deadline")}</Modal.Title>
                    {!isEditable && (
                        <>
                            <Button variant="outline-primary" onClick={() => setIsEditable(true)} className="mx-1">
                                <FaEdit />
                            </Button>
                            <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)} className="mx-1">
                                <FaTrash />
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="id_conducteur">
                        <Form.Label>{translate("Driver")}</Form.Label>
                        <Form.Control
                            as="select"
                            value={formData.id_conducteur}
                            onChange={handleChange}
                            disabled={!isEditable}
                        >
                            <option value="">{translate("Select Driver")}</option>
                            {drivers.length === 0 ? (
                                <option value="">{translate("No drivers available")}</option>
                            ) : (
                                drivers.map((driver) => (
                                    <option key={driver.id_conducteur} value={driver.id_conducteur}>
                                        {`${driver.nom_conducteur} ${driver.prenom_conducteur}`}
                                    </option>
                                ))
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="date_start_Deadline">
                        <Form.Label>{translate("Start Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_start_Deadline}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </Form.Group>

                    <Form.Group controlId="date_end_Deadline">
                        <Form.Label>{translate("End Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_end_Deadline}
                            onChange={handleChange}
                            disabled={!isEditable}
                        />
                    </Form.Group>

                    <Form.Group controlId="type_Deadline">
                        <Form.Label>{translate("Deadline Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_Deadline}
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

            <ModalDeleteDeadline
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                id_deadline={id_deadline}
                onSuccess={() => {
                    handleDeleteSuccess();
                    onSuccess?.();  // Call the parent onSuccess as well
                }}
            />

        </Modal>
    );
};

export default CalendarDeadlineModal;
