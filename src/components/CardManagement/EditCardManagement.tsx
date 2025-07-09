import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface EditCardManagementProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
    recordId?: number;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

interface FuelCardRecord {
    id_fc: number;
    facture_fc: string;
    id_vehicule: number;
    carb_fc: string;
    cout_fc: string;
    qte_fc: string;
    date_fc: string;
    carte_fc: string;
    station_fc: string;
    amort_fc: string;
    km_fc: string;
    new_km_fc: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditCardManagement: React.FC<EditCardManagementProps> = ({ 
    show, 
    onHide, 
    onSuccess,
    recordId 
}) => {
    const [formData, setFormData] = useState<FuelCardRecord>({
        id_fc: 0,
        facture_fc: "",
        id_vehicule: 0,
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
                    const recordResponse = await fetch(`${backendUrl}/api/geop/fuelcard/${recordId}`);
                    if (!recordResponse.ok) throw new Error("Failed to fetch record data");
                    const recordData = await recordResponse.json();
                    
                    // Format date for datetime-local input
                    /*const formattedDate = recordData.date_fc 
                        ? new Date(recordData.date_fc).toISOString().slice(0, 16)
                        : "";
                    */
                    setFormData({
                        ...recordData,
                        //date_fc: formattedDate
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
            id_fc: 0,
            facture_fc: "",
            id_vehicule: 0,
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
            const url = recordId 
                ? `${backendUrl}/api/geop/updatefuelcard/${recordId}`
                : `${backendUrl}/api/geop/addfuelcard/${geopuserID}`;

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
                    {recordId ? translate("Edit Fuel Card Record") : translate("New Fuel Card Record")}
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
                                            setFormData(prev => ({ ...prev, id_vehicule: 0, km_fc: "" }));
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="km_fc" className="mb-3">
                                <Form.Label>{translate("Current Km")}</Form.Label>
                                <Form.Control type="text" value={formData.km_fc} onChange={handleChange} readOnly />
                            </Form.Group>

                            <Form.Group controlId="new_km_fc" className="mb-3">
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

                           <Form.Group controlId="date_fc" className="mb-3">
                            <Form.Label>{translate("Date")}{translate(" *")}</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={formatDateForInput(formData.date_fc)}
                                min="2000-01-01T00:00"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                            <Form.Group controlId="carb_fc" className="mb-3">
                                <Form.Label>{translate("Fuel Type")}{translate(" *")}</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={formData.carb_fc} 
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

                            <Form.Group controlId="qte_fc" className="mb-3">
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

                            <Form.Group controlId="cout_fc" className="mb-3">
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

                            <Form.Group controlId="facture_fc" className="mb-3">
                                <Form.Label>{translate("Invoice Number")}</Form.Label>
                                <Form.Control type="text" value={formData.facture_fc} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="carte_fc" className="mb-3">
                                <Form.Label>{translate("Card Number")}</Form.Label>
                                <Form.Control type="text" value={formData.carte_fc} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="station_fc" className="mb-3">
                                <Form.Label>{translate("Gas Station")}</Form.Label>
                                <Form.Control type="text" value={formData.station_fc} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="amort_fc" className="mb-3">
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

export default EditCardManagement;