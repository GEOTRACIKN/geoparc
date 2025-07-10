import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface EditCashManagementProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
    recordId?: number;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

interface CashPaymentRecord {
    id_fb: number;
    num_fact_fb: string;
    id_vehicule: number;
    conducteur_fb: string;
    km_fb: string;
    new_km_fb: string;
    km_amort_fb: string;
    duree_amort_fb: string;
    qte_fb: string;
    cout_fb: string;
    paytype_fb: string;
    date_fb: string;
    station_fb: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditCashManagement: React.FC<EditCashManagementProps> = ({ 
    show, 
    onHide, 
    onSuccess,
    recordId 
}) => {
    const [formData, setFormData] = useState<CashPaymentRecord>({
        id_fb: 0,
        num_fact_fb: "",
        id_vehicule: 0,
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
                    const recordResponse = await fetch(`${backendUrl}/api/geop/cashpayment/${recordId}`);
                    if (!recordResponse.ok) throw new Error("Failed to fetch record data");
                    const recordData = await recordResponse.json();
                    
                    setFormData(recordData);
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
            id_fb: 0,
            num_fact_fb: "",
            id_vehicule: 0,
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
            const url = recordId 
                ? `${backendUrl}/api/geop/updatecashpayment/${recordId}`
                : `${backendUrl}/api/geop/addcashpayment/${geopuserID}`;

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
                    {recordId ? translate("Edit Cash Payment Record") : translate("New Cash Payment Record")}
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
                                            setFormData(prev => ({ ...prev, id_vehicule: 0, km_fb: "" }));
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="km_fb" className="mb-3">
                                <Form.Label>{translate("Current Km")}</Form.Label>
                                <Form.Control type="text" value={formData.km_fb} onChange={handleChange} readOnly />
                            </Form.Group>

                            <Form.Group controlId="new_km_fb" className="mb-3">
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

                            <Form.Group controlId="date_fb" className="mb-3">
                                <Form.Label>{translate("Date")}{translate(" *")}</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formatDateForInput(formData.date_fb)}
                                    min="2000-01-01T00:00"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="paytype_fb" className="mb-3">
                                <Form.Label>{translate("Payment Type")}{translate(" *")}</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={formData.paytype_fb} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">{translate("Select Payment Type")}</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="check">Check</option>
                                    <option value="transfer">Transfer</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="qte_fb" className="mb-3">
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

                            <Form.Group controlId="cout_fb" className="mb-3">
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

                            <Form.Group controlId="num_fact_fb" className="mb-3">
                                <Form.Label>{translate("Invoice Number")}</Form.Label>
                                <Form.Control type="text" value={formData.num_fact_fb} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="conducteur_fb" className="mb-3">
                                <Form.Label>{translate("Driver")}</Form.Label>
                                <Form.Control type="text" value={formData.conducteur_fb} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="station_fb" className="mb-3">
                                <Form.Label>{translate("Gas Station")}</Form.Label>
                                <Form.Control type="text" value={formData.station_fb} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="km_amort_fb" className="mb-3">
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

                            <Form.Group controlId="duree_amort_fb" className="mb-3">
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

export default EditCashManagement;