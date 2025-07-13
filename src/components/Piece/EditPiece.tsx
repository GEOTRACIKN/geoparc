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

interface StockPiece {
    id_piece_stock: number;
    designation_ps: string;
    reference_ps: string;
    constructeur_ps: string;
    modele_ps: string;
    marque_ps: string;
}

interface StockPieceSelectProps {
    onSelect: (id: number) => void;
    value?: number;
}

interface EditPieceModalProps {
    show: boolean;
    onHide: () => void;
    id_piece: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditPieceModal: React.FC<EditPieceModalProps> = ({ show, onHide, id_piece, onSuccess }) => {
    const [formData, setFormData] = useState({
        id_piece: "",
        type_operation_piece: "",
        id_vehicule_piece: "",
        source_piece: "",
        position_piece: "",
        technicien_piece: "",
        num_facture_piece: "",
        fournisseur_piece: "",
        date_piece: "",
        duree_piece: "",
        cout_piece: "",
        details_piece: "",
        id_piece_stock: "",
        immatriculation_vehicule: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [stockPieces, setStockPieces] = useState<StockPiece[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const geopuserID = localStorage.getItem("GeopUserID");
    const { translate } = useTranslate();

    const toLocalISOString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    useEffect(() => {
        if (!id_piece || !show) return;
    
        const fetchPiece = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showpiece/${id_piece}`);
                const data = response.data;
                if (!data || !data.id_piece) {
                    toast.error(translate("Piece data not found."));
                    return;
                }
                setFormData((prev) => ({ ...prev, ...data }));
            } catch (error: unknown) {
                console.error("Error fetching piece data:", error);
                if (error instanceof AxiosError) {
                    console.error("Server response:", error.response?.data);
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchPiece();
    }, [id_piece, show, translate]);
    

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
                toast.error(translate("Error fetching vehicles."), { 
                    position: "bottom-right", 
                    autoClose: 2400, 
                    transition: Bounce 
                });
            }
        };
        fetchVehicles();
    }, [geopuserID, translate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    const handleStockPieceSelect = (selectedPiece: StockPiece) => {
        setFormData(prev => ({
            ...prev,
            id_piece_stock: selectedPiece.id_piece_stock.toString(),
            designation_ps: selectedPiece.designation_ps,
            reference_ps: selectedPiece.reference_ps,
            constructeur_ps: selectedPiece.constructeur_ps,
            modele_ps: selectedPiece.modele_ps,
            marque_ps: selectedPiece.marque_ps
        }));
    };
    
    function formatDatetimeLocal(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }


    

    const handleClose = () => {
        setFormData({
            id_piece: "",
            type_operation_piece: "",
            id_vehicule_piece: "",
            source_piece: "",
            position_piece: "",
            technicien_piece: "",
            num_facture_piece: "",
            fournisseur_piece: "",
            date_piece: "",
            duree_piece: "",
            cout_piece: "",
            details_piece: "",
            id_piece_stock: "",
            immatriculation_vehicule: ""
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.id_vehicule_piece || !formData.type_operation_piece) {
            toast.error(translate("Please fill all required fields."), { 
                position: "bottom-right", 
                autoClose: 2400, 
                transition: Bounce 
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            const response = await fetch(`${backendUrl}/api/geop/updatepiece/${id_piece}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update piece.");
            
            toast.success(translate("Update successful!"), { 
                position: "bottom-right", 
                autoClose: 2400, 
                transition: Bounce 
            });

            if (onSuccess) onSuccess();
            onHide();
        } catch (error) {
            console.error("Error updating piece:", error);
            toast.error(translate("Update failed. Please try again."), { 
                position: "bottom-right", 
                autoClose: 2400, 
                transition: Bounce 
            });
        }
    };

    useEffect(() => {
        const fetchStockPieces = async () => {
            if (!geopuserID || formData.source_piece !== "internal") return;
            
            try {
                const response = await fetch(`${backendUrl}/api/geop/piece_stock/available/${geopuserID}`, {
                    headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setStockPieces(data);
                
            } catch (error) {
                console.error("Error fetching stock pieces:", error);
                setStockPieces([]);
            }
        };
        fetchStockPieces();
    }, [formData.source_piece, geopuserID]);

    const StockPieceSelect: React.FC<StockPieceSelectProps> = ({ onSelect, value }) => (
        <Form.Group controlId="id_piece_stock" className="mb-3">
            <Form.Label>{translate("Select Stock Piece")} *</Form.Label>
            <Select
                options={stockPieces.map(piece => ({
                    value: piece.id_piece_stock,
                    label: `${piece.designation_ps} - ${piece.reference_ps} (${piece.marque_ps})`
                }))}
                onChange={(selectedOption) => {
                    if (selectedOption) {
                        const selected = stockPieces.find(p => p.id_piece_stock === selectedOption.value);
                        if (selected) {
                            onSelect(selected.id_piece_stock);
                            handleStockPieceSelect(selected);
                        }
                    }
                }}
                value={stockPieces
                    .map(piece => ({ 
                        value: piece.id_piece_stock, 
                        label: `${piece.designation_ps} - ${piece.reference_ps} (${piece.marque_ps})` 
                    }))
                    .find(option => option.value === value)}
                placeholder={translate("Select a piece from stock")}
                isSearchable
                noOptionsMessage={() => translate("No pieces available in stock")}
            />
        </Form.Group>
    );

    useEffect(() => {
        if (!show) {
            setFormData({
                id_piece: "",
                type_operation_piece: "",
                id_vehicule_piece: "",
                source_piece: "",
                position_piece: "",
                technicien_piece: "",
                num_facture_piece: "",
                fournisseur_piece: "",
                date_piece: "",
                duree_piece: "",
                cout_piece: "",
                details_piece: "",
                id_piece_stock: "",
                immatriculation_vehicule: ""
            });
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
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
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="type_operation_piece" className="mb-3">
                                        <Form.Label>{translate("Operation Type")} *</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={formData.type_operation_piece}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">{translate("Select Operation")}</option>
                                            <option value="add">{translate("Add")}</option>
                                            <option value="replace">{translate("Replace")}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="id_vehicule_piece" className="mb-3">
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
                                            })).find(option => String(option.value) === String(formData.id_vehicule_piece)) || null}
                                            onChange={(selectedOption) => {
                                                const id = selectedOption ? String(selectedOption.value) : "";
                                                setFormData(prev => ({ 
                                                    ...prev, 
                                                    id_vehicule_piece: id,
                                                    immatriculation_vehicule: selectedOption?.label || ""
                                                }));
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="source_piece" className="mb-3">
                                        <Form.Label>{translate("Source")}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={formData.source_piece}
                                            onChange={handleChange}
                                            disabled
                                        >
                                            <option value="">{translate("Select Source")}</option>
                                            <option value="internal">{translate("Internal")}</option>
                                            <option value="external">{translate("External")}</option>
                                             
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="position_piece" className="mb-3">
                                        <Form.Label>{translate("Position")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.position_piece}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            {formData.source_piece === "external" && (
                                <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="num_facture_piece" className="mb-3">
                                                <Form.Label>{translate("Invoice Number")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.num_facture_piece}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="fournisseur_piece" className="mb-3">
                                                <Form.Label>{translate("Supplier")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.fournisseur_piece}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="duree_piece" className="mb-3">
                                                <Form.Label>{translate("Duration")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.duree_piece}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                        const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                                        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group controlId="cout_piece" className="mb-3">
                                                <Form.Label>{translate("Cost (DZD)")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.cout_piece}
                                                    onChange={handleChange}
                                                    onKeyDown={(e) => {
                                                        const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                                        if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.source_piece === "internal" && (
                                <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group controlId="technicien_piece" className="mb-3">
                                                <Form.Label>{translate("Technician")}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.technicien_piece || ""}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        technicien_piece: e.target.value
                                                    }))}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <StockPieceSelect
                                                onSelect={(id) => setFormData(prev => ({
                                                    ...prev,
                                                    id_piece_stock: id.toString()
                                                }))}
                                                value={Number(formData.id_piece_stock)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="date_piece" className="mb-3">
                                        <Form.Label>{translate("Date")}</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.date_piece ? toLocalISOString(new Date(formData.date_piece)) : ""}                                            min="2000-01-01T00:00"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="details_piece" className="mb-3">
                                        <Form.Label>{translate("Details")}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={formData.details_piece}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
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

export default EditPieceModal;