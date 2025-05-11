import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import Select from "react-select";
import { PropagateLoader } from "react-spinners";

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

interface EditPneuModalProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditPneuModal: React.FC<EditPneuModalProps> = ({ show, onHide, id_pneu, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        num_facture_pneu: "",
        source_pneu:"",
        technicien_pneu:"",        

        km_pneu: "",
        date_achat_pneu: "",
        etat_pneu: "",
        position_pneu: "",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu: "",
        temps_amort: "",
        id_vehicule: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const geopuserID = localStorage.getItem("GeopUserID");
    const { translate } = useTranslate();

    useEffect(() => {
        if (!id_pneu || !show) return;
    
        const fetchPneu = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showpneu/${id_pneu}`);
                const data = response.data;
                if (!data || !data.id_pneu) {
                    toast.error(translate("Tire data not found."));
                    return;
                }
                setFormData((prev) => ({ ...prev, ...data }));
            } catch (error: unknown) {
                console.error("Error fetching tire data:", error);
                if (error instanceof AxiosError) {
                    console.error("Server response:", error.response?.data);
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchPneu();
    }, [id_pneu, show]); // <-- ajout de show ici
    

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                if (!geopuserID) return;
                const response = await fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`);
                if (!response.ok) throw new Error(`Failed to fetch vehicles: ${response.status}`);
                const data = await response.json();
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
                toast.error(translate("Error fetching vehicles."), { position: "bottom-right", autoClose: 2400, transition: Bounce });
            }
        };
        fetchVehicles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
            id_pneu: "",
            num_facture_pneu: "",
            source_pneu:"",
            technicien_pneu:"",        
            km_pneu: "",
            date_achat_pneu: "",
            etat_pneu: "",
            position_pneu: "",
            cout_pneu: "",
            type_pneu: "",
            fournisseur_pneu: "",
            temps_amort: "",
            id_vehicule: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.num_facture_pneu || !formData.id_vehicule) {
            toast.error(translate("Please fill all required fields."), { position: "bottom-right", autoClose: 2400, transition: Bounce });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await fetch(`${backendUrl}/api/geop/updatepneu/${id_pneu}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update tire.");
            toast.success(translate("Update successful!"), { position: "bottom-right", autoClose: 2400, transition: Bounce });

            if (onSuccess) onSuccess();
            onHide();
        } catch (error) {
            console.error("Error updating tire:", error);
            toast.error(translate("Update failed. Please try again."), { position: "bottom-right", autoClose: 2400, transition: Bounce });
        }
    };

    const getVehicleKm = async (id_vehicule: string | number) => {
        const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
        if (!res.ok) throw new Error("Error fetching mileage");
        return await res.json();
    };

    useEffect(() => {
        if (!show) {
            setFormData({
                id_pneu: "",
                num_facture_pneu: "",
                source_pneu:"",
                technicien_pneu:"",        
                km_pneu: "",
                date_achat_pneu: "",
                etat_pneu: "",
                position_pneu: "",
                cout_pneu: "",
                type_pneu: "",
                fournisseur_pneu: "",
                temps_amort: "",
                id_vehicule: "",
            });
        }
    }, [show]);
    

    return (
        <Modal show={show && !isLoading} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Edit")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <PropagateLoader color="#0059b3" size={12} />
                        </div>
                    ) : (
                        <>
                    

                    <Form.Group controlId="id_vehicule">
                        <Form.Label>{translate("Vehicle")} *</Form.Label>
                        <Select
                            options={vehicles.map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            }))}
                            placeholder={translate("Select a vehicle")}
                            isLoading={vehicles.length === 0}
                            noOptionsMessage={() => translate("No vehicles available")}
                            isSearchable
                            value={vehicles.map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            })).find(option => String(option.value) === String(formData.id_vehicule)) || null}
                            onChange={async (selectedOption) => {
                                const id = selectedOption ? String(selectedOption.value) : "";
                                if (id) {
                                    try {
                                        const data = await getVehicleKm(id);
                                        setFormData(prev => ({ ...prev, id_vehicule: id, km_pneu: data.kilometrage_vehicule || "" }));
                                    } catch (error) {
                                        console.error("Error fetching mileage:", error);
                                        toast.error(translate("Error retrieving mileage"), { position: "bottom-right", autoClose: 2400, transition: Bounce });
                                    }
                                } else {
                                    setFormData(prev => ({ ...prev, id_vehicule: "", km_pneu: "" }));
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="km_pneu">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control type="text" value={formData.km_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formData.date_achat_pneu ? new Date(formData.date_achat_pneu).toISOString().slice(0, 16) : ""}
                            min="2000-01-01T00:00"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="etat_pneu">
                        <Form.Label>{translate("Tire Status")}</Form.Label>
                        <Form.Control as="select" value={formData.etat_pneu} onChange={handleChange}>
                        <option value="">{translate("Select Status")}</option>
                        <option value="installer">{translate("Install")}</option>
                        <option value="desinstaller">{translate("Uninstall")}</option>
                    </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="position_pneu">
                        <Form.Label>{translate("Position")}</Form.Label>
                        <Form.Control as="select" value={formData.position_pneu} onChange={handleChange}>
                            <option value="">{translate("Select Position")}</option>
                            <option value="front_left">{translate("Front Left")}</option>
                            <option value="front_right">{translate("Front Right")}</option>
                            <option value="rear_left">{translate("Rear Left")}</option>
                            <option value="rear_right">{translate("Rear Right")}</option>
                            <option value="spare">{translate("Spare Tire")}</option>
                        </Form.Control>
                    </Form.Group>


                    <Form.Group controlId="source_pneu">
                                        <Form.Label>{translate("Tire Source")}</Form.Label>
                                            <Form.Control as="select" value={formData.source_pneu} onChange={handleChange}>
                                            <option value="">{translate("Select Source")}</option>
                                            <option value="internal">{translate("Internal")}</option>
                                            <option value="external">{translate("External")}</option>
                                            </Form.Control>
                                        </Form.Group>

                    
                     
                    {formData.source_pneu === "external" && (
                         <>
                    <Form.Group controlId="num_facture_pneu">
                        <Form.Label>{translate("Inv. No.")}</Form.Label>
                        <Form.Control type="text" value={formData.num_facture_pneu} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="fournisseur_pneu">
                        <Form.Label>{translate("Supplier")}</Form.Label>
                        <Form.Control type="text" value={formData.fournisseur_pneu} onChange={handleChange} />
                    </Form.Group>
                     
                    <Form.Group controlId="temps_amort">
                        <Form.Label>{translate("Duration")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.temps_amort}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Group>
                     
                    <Form.Group controlId="cout_pneu">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.cout_pneu}
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
                     
                                 {formData.source_pneu === "internal" && (
                                     <Form.Group controlId="technicien_pneu">
                                         <Form.Label>{translate("Technician")}</Form.Label>
                                         <Form.Control
                                             type="text"
                                             value={formData.technicien_pneu || ""}
                                             onChange={(e) =>
                                                 setFormData((prev) => ({
                                                     ...prev,
                                                     technicien_pneu: e.target.value,
                                                 }))
                                             }
                                         />
                                     </Form.Group>
                                 )}
                    </>
    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Update")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditPneuModal;
