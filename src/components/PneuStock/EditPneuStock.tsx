import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import { PropagateLoader } from "react-spinners";

interface EditPneuStockModalProps {
    show: boolean;
    onHide: () => void;
    id_pneu_stock: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditPneuStockModal: React.FC<EditPneuStockModalProps> = ({ show, onHide, id_pneu_stock, onSuccess }) => {
    const [formData, setFormData] = useState({
        type_pneu: "",
        modele_pneu: "",
        ref_pneu: "",
        num_serie_pneu: "",
        loc_pneu: "",
        date_achat_pneu: "",
        cout_pneu: "",
        fourn_pneu: "",
        marque_pneu:"",

        fact_pneu: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslate();

    useEffect(() => {
        if (!id_pneu_stock || !show) return;

        const fetchPneuStock = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${backendUrl}/api/geop/pneu_stock/${id_pneu_stock}`);
                const data = response.data;
                
                if (!data || !data.id_pneu_stock) {
                    toast.error(translate("Stock data not found."));
                    return;
                }

                setFormData({
                    type_pneu: data.type_pneu,
                    modele_pneu: data.modele_pneu,
                    ref_pneu: data.ref_pneu,
                    num_serie_pneu: data.num_serie_pneu,
                    loc_pneu: data.loc_pneu,
                    date_achat_pneu: data.date_achat_pneu,
                    cout_pneu: data.cout_pneu,
                    fourn_pneu: data.fourn_pneu,
                    marque_pneu:data.marque_pneu,
                    

                    fact_pneu: data.fact_pneu
                });

            } catch (error: unknown) {
                console.error("Error fetching stock data:", error);
                if (error instanceof AxiosError) {
                    console.error("Server response:", error.response?.data);
                }
                toast.error(translate("Error loading stock data"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchPneuStock();
    }, [id_pneu_stock, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
            type_pneu: "",
            modele_pneu: "",
            ref_pneu: "",
            num_serie_pneu: "",
            loc_pneu: "",
            date_achat_pneu: "",
            cout_pneu: "",
            fourn_pneu: "",
            marque_pneu:"",

            fact_pneu: ""
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.type_pneu || !formData.modele_pneu) {
            toast.error(translate("Please fill required fields"), { 
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
            const response = await axios.put(
                `${backendUrl}/api/geop/pneu_stock/${id_pneu_stock}`,
                {
                    ...formData,
                    cout_pneu: Number(formData.cout_pneu) || 0
                }
            );

            if (response.status === 200) {
                toast.success(translate("Update successful!"), { 
                    position: "bottom-right", 
                    autoClose: 2400, 
                    transition: Bounce 
                });
                if (onSuccess) onSuccess();
                handleClose();
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            toast.error(translate("Update failed. Please try again."), { 
                position: "bottom-right", 
                autoClose: 2400, 
                transition: Bounce 
            });
        }
    };

    return (
        <Modal show={show && !isLoading} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Edit Stock Entry")}</Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <PropagateLoader color="#0059b3" size={12} />
                        </div>
                    ) : (                        

                        <div className="row">
                                <Form.Group controlId="type_pneu">
                                    <Form.Label>{translate("Type")} *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.type_pneu} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group controlId="marque_pneu">
                                    <Form.Label>{translate("Brand")} *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.marque_pneu} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group controlId="modele_pneu">
                                    <Form.Label>{translate("Model")} *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.modele_pneu} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group controlId="ref_pneu">
                                    <Form.Label>{translate("Reference")}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.ref_pneu} 
                                        onChange={handleChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="num_serie_pneu">
                                    <Form.Label>{translate("Serial Number")}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.num_serie_pneu} 
                                        onChange={handleChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="loc_pneu">
                                    <Form.Label>{translate("Storage Location")}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.loc_pneu} 
                                        onChange={handleChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="date_achat_pneu">
                                    <Form.Label>{translate("Purchase Date")}</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={formData.date_achat_pneu}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="cout_pneu">
                                    <Form.Label>{translate("Cost")}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={formData.cout_pneu}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="fourn_pneu">
                                    <Form.Label>{translate("Supplier")}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.fourn_pneu} 
                                        onChange={handleChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="fact_pneu">
                                    <Form.Label>{translate("Invoice Number")}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.fact_pneu} 
                                        onChange={handleChange} 
                                    />
                                </Form.Group>
                            
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Cancel")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Save Changes")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditPneuStockModal;