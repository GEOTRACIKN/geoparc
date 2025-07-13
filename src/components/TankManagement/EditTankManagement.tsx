import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface EditTankManagementProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
    recordId?: number;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

interface TankRecord {
    id_ft: number;
    id_vehicule: number;
    carb_ft: string;
    amort_ft: string;
    citerne_ft: string;
    total_ft: string;
    qte_ft: string;
    date_ft: string;
    km_ft: string;
    prix_ft: string;
    new_km_ft: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditTankManagement: React.FC<EditTankManagementProps> = ({ 
    show, 
    onHide, 
    onSuccess,
    recordId 
}) => {
    const [formData, setFormData] = useState<TankRecord>({
        id_ft: 0,
        id_vehicule: 0,
        carb_ft: "",
        amort_ft: "",
        citerne_ft: "",
        total_ft: "",
        qte_ft: "",
        date_ft: "",
        km_ft: "",
        prix_ft: "",
        new_km_ft: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch vehicles
                const vehiclesResponse = await fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`);
                if (!vehiclesResponse.ok) throw new Error("Failed to fetch vehicles");
                const vehiclesData = await vehiclesResponse.json();
                setVehicles(vehiclesData.vehicles || []);

                // If editing, fetch the record data
                if (recordId) {
                    const recordResponse = await fetch(`${backendUrl}/api/geop/tank/${recordId}`);
                    if (!recordResponse.ok) throw new Error("Failed to fetch record data");
                    const recordData = await recordResponse.json();
                    
                    setFormData({
                        ...recordData,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(translate("Error fetching data."), {
                    position: "bottom-right",
                    autoClose: 2400,
                    transition: Bounce,
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (geopuserID) fetchData();
    }, [geopuserID, recordId, translate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
            id_ft: 0,
            id_vehicule: 0,
            carb_ft: "",
            amort_ft: "",
            citerne_ft: "",
            total_ft: "",
            qte_ft: "",
            date_ft: "",
            km_ft: "",
            prix_ft: "",
            new_km_ft: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.id_vehicule || !formData.date_ft || !formData.carb_ft || !formData.qte_ft) {
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
            const url = recordId 
                ? `${backendUrl}/api/geop/updatetank/${recordId}`
                : `${backendUrl}/api/geop/addtank/${geopuserID}`;

            const method = recordId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    id_user: geopuserID
                }),
            });

            if (!response.ok) throw new Error(recordId ? "Error updating record" : "Error adding record");

            toast.success(translate(recordId ? "Updated successfully!" : "Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error saving record:", error);
            toast.error(translate("Error saving. Please try again"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        // Compense le décalage du fuseau horaire
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - timezoneOffset);
        
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {recordId ? translate("Edit Tank Record") : translate("New Tank Record")}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Form.Group controlId="id_vehicule" className="mb-3">
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
                                        .find(option => option.value === formData.id_vehicule) || null
                                    }
                                    onChange={async (selectedOption) => {
                                        const id = selectedOption ? selectedOption.value : 0;
                                        if (id) {
                                            try {
                                                const data = await getVehicleKm(id);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    id_vehicule: id,
                                                    km_ft: data.kilometrage_vehicule || "",
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
                                            setFormData(prev => ({ ...prev, id_vehicule: 0, km_ft: "" }));
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="km_ft" className="mb-3">
                                <Form.Label>{translate("Current Km")}</Form.Label>
                                <Form.Control type="text" value={formData.km_ft} onChange={handleChange} readOnly />
                            </Form.Group>

                            <Form.Group controlId="new_km_ft" className="mb-3">
                                <Form.Label>{translate("New Km")}</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={formData.new_km_ft} 
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="date_ft" className="mb-3">
                                <Form.Label>{translate("Date")}{translate(" *")}</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formatDateForInput(formData.date_ft)}
                                    min="2000-01-01T00:00"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="carb_ft" className="mb-3">
                                <Form.Label>{translate("Fuel Type")}{translate(" *")}</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={formData.carb_ft} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">{translate("Select Fuel Type")}</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="essence">Essence</option>
                                    <option value="gpl">GPL</option>
                                    <option value="electrique">Electrique</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="qte_ft" className="mb-3">
                                <Form.Label>{translate("Quantity (L)")}{translate(" *")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.qte_ft}
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

                            <Form.Group controlId="prix_ft" className="mb-3">
                                <Form.Label>{translate("Price per Liter")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.prix_ft}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                        if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="total_ft" className="mb-3">
                                <Form.Label>{translate("Total Cost")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.total_ft}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                        if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="citerne_ft" className="mb-3">
                                <Form.Label>{translate("Tank Capacity")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.citerne_ft}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
                                        if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="amort_ft" className="mb-3">
                                <Form.Label>{translate("Amortization (days)")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.amort_ft}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {translate("Saving...")}
                            </>
                        ) : (
                            translate(recordId ? "Update" : "Add")
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditTankManagement;