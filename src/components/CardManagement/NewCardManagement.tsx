import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalNewCardManagementProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewCardManagement: React.FC<ModalNewCardManagementProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_fc: "",
        facture_fc: "",
        id_vehicule: "",
        carb_fc: "",
        cout_fc: "",
        qte_fc: "",
        date_fc: "",
        carte_fc: "",
        station_fc: "",
        amort_fc: "",
        km_fc: "",
        new_km_fc: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`);
                if (!response.ok) throw new Error("Failed to fetch vehicles");
                const data = await response.json();
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error(translate("Error fetching vehicles."), {
                    position: "bottom-right",
                    autoClose: 2400,
                    transition: Bounce,
                });
            }
        };

        if (geopuserID) fetchVehicles();
    }, [geopuserID, translate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
            id_fc: "",
            facture_fc: "",
            id_vehicule: "",
            carb_fc: "",
            cout_fc: "",
            qte_fc: "",
            date_fc: "",
            carte_fc: "",
            station_fc: "",
            amort_fc: "",
            km_fc: "",
            new_km_fc: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.id_vehicule || !formData.date_fc || !formData.carb_fc || !formData.qte_fc) {
            toast.error(translate("Please fill out all required fields"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
            return false;
        }
        return true;
    };

    const getVehicleKm = async (id_vehicule: string | number) => {
        const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
        if (!res.ok) throw new Error("Erreur récupération km");
        return res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${backendUrl}/api/geop/addfuelcard/${geopuserID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    id_user: geopuserID
                }),
            });

            if (!response.ok) throw new Error("Error adding fuel card record");

            toast.success(translate("Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error adding fuel card record:", error);
            toast.error(translate("Error adding. Please try again"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("New Fuel Card Record")}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
                        <Select
                            options={vehicles.map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            }))}
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
                            onChange={async (selectedOption) => {
                                const id = selectedOption ? String(selectedOption.value) : "";
                                if (id) {
                                    try {
                                        const data = await getVehicleKm(id);
                                        setFormData(prev => ({
                                            ...prev,
                                            id_vehicule: id,
                                            km_fc: data.kilometrage_vehicule || "",
                                        }));
                                    } catch (error) {
                                        console.error("Erreur lors de la récupération du km:", error);
                                        toast.error("Erreur récupération kilométrage", {
                                            position: "bottom-right",
                                            autoClose: 2400,
                                            transition: Bounce,
                                        });
                                    }
                                } else {
                                    setFormData(prev => ({ ...prev, id_vehicule: "", km_fc: "" }));
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="km_fc">
                        <Form.Label>{translate("Current Km")}</Form.Label>
                        <Form.Control type="text" value={formData.km_fc} onChange={handleChange} readOnly />
                    </Form.Group>

                    <Form.Group controlId="new_km_fc">
                        <Form.Label>{translate("New Km")}</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.new_km_fc} 
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="date_fc">
                        <Form.Label>{translate("Date")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_fc}
                            min="2000-01-01T00:00"
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="carb_fc">
                        <Form.Label>{translate("Fuel Type")}{translate(" *")}</Form.Label>
                        <Form.Control as="select" value={formData.carb_fc} onChange={handleChange} required>
                            <option value="">{translate("Select Fuel Type")}</option>
                            <option value="diesel">Diesel</option>
                            <option value="essence">Essence</option>
                            <option value="gpl">GPL</option>
                            <option value="electrique">Electrique</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="qte_fc">
                        <Form.Label>{translate("Quantity (L)")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.qte_fc}
                            onChange={handleChange}
                            required
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="cout_fc">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.cout_fc}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="facture_fc">
                        <Form.Label>{translate("Invoice Number")}</Form.Label>
                        <Form.Control type="text" value={formData.facture_fc} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="carte_fc">
                        <Form.Label>{translate("Card Number")}</Form.Label>
                        <Form.Control type="text" value={formData.carte_fc} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="station_fc">
                        <Form.Label>{translate("Gas Station")}</Form.Label>
                        <Form.Control type="text" value={formData.station_fc} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="amort_fc">
                        <Form.Label>{translate("Amortization")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.amort_fc}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
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

export default ModalNewCardManagement;