import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalNewPneuProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewPneu: React.FC<ModalNewPneuProps> = ({
    show,
    onHide,
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

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

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
    }, []);

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
            //!formData.reference_pneu ||
            //!formData.date_expiration_pneu ||
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
            const response = await fetch(`${backendUrl}/api/geop/addnewtire/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Error adding tire.");
            }

            toast.success(translate("Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });

            setFormData({
                id_pneu: "",
                reference_pneu: "",
                date_achat_pneu: "",
                cout_pneu: "",
                type_pneu: "",
                id_vehicule: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Error adding tire:", error);
            toast.error(translate("Error adding. Please try again"), {
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
                <Modal.Title>{translate("New Pneu")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="reference_pneu">
                        <Form.Label>{translate("Brand")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.reference_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
                        <Select
                            options={vehicles.map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            })) as { value: number; label: string }[]}
                            placeholder={translate("Select Vehicle")}
                            isLoading={vehicles.length === 0}
                            noOptionsMessage={() => translate("No vehicles available")}
                            isSearchable
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
                                    id_vehicule: selectedOption ? String(selectedOption.value) : ""
                                }));
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date_achat_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="cout_pneu">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="number"
                            value={formData.cout_pneu}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group controlId="type_pneu">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.type_pneu}
                            onChange={handleChange}
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

export default ModalNewPneu;
