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

const ModalNewPneu: React.FC<ModalNewPneuProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        num_facture_pneu: "",
        source_pneu:"",
        km_pneu: "",
        date_achat_pneu: "",
        etat_pneu: "",
        position_pneu: "",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu: "",
        technicien_pneu:"",        
        temps_amort: "",
        id_vehicule: "",
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
        if (!formData.id_vehicule) {
            toast.error(translate("Please fill out all fields"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewpneu/${geopuserID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding tire");

            toast.success(translate("Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error adding tire:", error);
            toast.error(translate("Error adding. Please try again"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };

    const getVehicleKm = async (id_vehicule: string | number) => {
        const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
        if (!res.ok) throw new Error("Erreur récupération km");
        return res.json();
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("New")}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="num_facture_pneu">
                        <Form.Label>{translate("Inv. No.")}</Form.Label>
                        <Form.Control type="text" value={formData.num_facture_pneu} onChange={handleChange} />
                    </Form.Group>

                    

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
                                            km_pneu: data.kilometrage_vehicule || "",
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
                                    setFormData(prev => ({ ...prev, id_vehicule: "", km_pneu: "" }));
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="km_pneu">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control type="text" value={formData.km_pneu} onChange={handleChange} readOnly />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={
                                formData.date_achat_pneu
                                    ? new Date(formData.date_achat_pneu).toISOString().slice(0, 16)
                                    : ""
                            }
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
