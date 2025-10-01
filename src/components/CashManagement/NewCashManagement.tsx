import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalNewCashManagementProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewCashManagement: React.FC<ModalNewCashManagementProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_fb: "",
        num_fact_fb: "",
        id_vehicule: "",
        conducteur_fb: "",
        km_fb: "",
        new_km_fb: "",
        km_amort_fb: "",
        duree_amort_fb: "",
        qte_fb: "",
        cout_fb: "",
        paytype_fb: "",
        date_fb: "",
        station_fb: "",
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
            id_fb: "",
            num_fact_fb: "",
            id_vehicule: "",
            conducteur_fb: "",
            km_fb: "",
            new_km_fb: "",
            km_amort_fb: "",
            duree_amort_fb: "",
            qte_fb: "",
            cout_fb: "",
            paytype_fb: "",
            date_fb: "",
            station_fb: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.id_vehicule || !formData.date_fb || !formData.qte_fb || !formData.paytype_fb) {
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
            const response = await fetch(`${backendUrl}/api/geop/addcashpayment/${geopuserID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    id_user: geopuserID
                }),
            });

            if (!response.ok) throw new Error("Error adding cash payment record");

            toast.success(translate("Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error adding cash payment record:", error);
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
                <Modal.Title>{translate("New Cash Payment Record")}</Modal.Title>
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
                                            km_fb: data.kilometrage_vehicule || "",
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
                                    setFormData(prev => ({ ...prev, id_vehicule: "", km_fb: "" }));
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="km_fb">
                        <Form.Label>{translate("Current Km")}</Form.Label>
                        <Form.Control type="text" value={formData.km_fb} onChange={handleChange} readOnly />
                    </Form.Group>

                    <Form.Group controlId="new_km_fb">
                        <Form.Label>{translate("New Km")}</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.new_km_fb} 
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="date_fb">
                        <Form.Label>{translate("Date")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_fb}
                            min="2000-01-01T00:00"
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="paytype_fb">
                        <Form.Label>{translate("Payment Type")}{translate(" *")}</Form.Label>
                        <Form.Control as="select" value={formData.paytype_fb} onChange={handleChange} required>
                            <option value="">{translate("Select Payment Type")}</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="check">Check</option>
                            <option value="transfer">Transfer</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="qte_fb">
                        <Form.Label>{translate("Quantity (L)")}{translate(" *")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.qte_fb}
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

                    <Form.Group controlId="cout_fb">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.cout_fb}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="num_fact_fb">
                        <Form.Label>{translate("Invoice Number")}</Form.Label>
                        <Form.Control type="text" value={formData.num_fact_fb} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="conducteur_fb">
                        <Form.Label>{translate("Driver")}</Form.Label>
                        <Form.Control type="text" value={formData.conducteur_fb} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="station_fb">
                        <Form.Label>{translate("Gas Station")}</Form.Label>
                        <Form.Control type="text" value={formData.station_fb} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="km_amort_fb">
                        <Form.Label>{translate("Amortization Km")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.km_amort_fb}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="duree_amort_fb">
                        <Form.Label>{translate("Amortization Duration")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.duree_amort_fb}
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

export default ModalNewCashManagement;