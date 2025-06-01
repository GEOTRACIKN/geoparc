import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

interface EditPieceStockProps {
    show: boolean;
    onHide: () => void;
    id_piece_stock: number | null;
    onSuccess: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function EditPieceStockModal({ show, onHide, id_piece_stock, onSuccess }: EditPieceStockProps) {
    const { translate } = useTranslate();
    const id_user = localStorage.getItem("GeopUserID");

    const [constructeurs_ps, setConstructeurs] = useState<string[]>([]);
    const [fournisseurs, setFournisseurs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        num_facture_ps: '',
        date_achat_ps: '',
        constructeur_ps: '',
        modele_ps: '',
        marque_ps: '',
        categorie_ps: '',
        type_piece_ps: '',
        duree_amort_ps: 0,
        km_amort_ps: 0,
        designation_ps: '',
        reference_ps: '',
        fournisseur_ps: '',
        cout_achat_ps: 0,
        quantite_ps: 0,
        stock_min_ps: 0
    });

const categories: { [key: string]: string } = {
    freinage: translate("Braking"),
    filtration: translate("Filtration"),
    moteur: translate("Engine"),
    suspension_direction: translate("Suspension/Steering"),
    echappement: translate("Exhaust"),
    electricite: translate("Electricity"),
    chauffage_refroidissement: translate("Heating/Cooling"),
    carrosserie: translate("Bodywork"),
    accessoires: translate("Accessories"),
    liquide_lubrifiant: translate("Fluids/Lubricants"),
    autres: translate("OTHERS"),
};

// List of part types
const typesPiece: { [key: string]: string } = {
    origine: translate("Original part"),
    apresmarket: translate("Aftermarket part"),
    reconditionne: translate("Refurbished"),
    occasion: translate("Used"),
};

    useEffect(() => {
        const fetchData = async () => {
            if (!id_piece_stock) return;
            
            try {
                const response = await axios.get(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`);
                const data = response.data;
                 const formatDatetimeLocal = (value: string) => {
                    const date = new Date(value);
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - offset * 60 * 1000);
                    return localDate.toISOString().slice(0, 16);
                };

                setFormData({
                    ...data,
                    date_achat_ps: formatDatetimeLocal(data.date_achat_ps)
                });

                // Charger les listes
                setConstructeurs(['Facel Vega', 'Renault', 'Peugeot', 'Citroën', 'Autre']);
                setFournisseurs(['A', 'B', 'C']);
                
            } catch (error) {
                console.error("Erreur de chargement des données:", error);
                toast.error(translate("Error loading stock data"));
            } finally {
                setIsLoading(false);
            }
        };

        if (show) fetchData();
    }, [id_piece_stock, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const numericFields = ['duree_amort_ps', 'km_amort_ps', 'cout_achat_ps', 'quantite_ps', 'stock_min_ps'];
        
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) || 0 : value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`, {
                ...formData,
                id_user: id_user
            });

            onSuccess();
            onHide();
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
            console.error("Erreur de mise à jour:", error);
            toast.error(translate("Update failed. Please try again."), { 
                            position: "bottom-right", 
                            autoClose: 2400, 
                            transition: Bounce 
                        });
        }
    };

    const handleClose = () => {
        setFormData({
            num_facture_ps: '',
            date_achat_ps: '',
            constructeur_ps: '',
            modele_ps: '',
            marque_ps: '',
            categorie_ps: '',
            type_piece_ps: '',
            duree_amort_ps: 0,
            km_amort_ps: 0,
            designation_ps: '',
            reference_ps: '',
            fournisseur_ps: '',
            cout_achat_ps: 0,
            quantite_ps: 0,
            stock_min_ps: 0
        });
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Edit")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                   <Form>
    {/* 1 - Purchase Date & Invoice Number */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Invoice Number")}</Form.Label>
                <Form.Control
                    name="num_facture_ps"
                    value={formData.num_facture_ps}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
        </div>

        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Purchase Date")}</Form.Label>
                  <Form.Control
            type="datetime-local"
            name="date_achat_ps"
            value={formData.date_achat_ps || ""}
            onChange={handleChange}
            required
        />
            </Form.Group>
        </div>
    </div>

    {/* 2 - Manufacturer & Brand */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Manufacturer")}</Form.Label>
                <Form.Control
                    as="select"
                    name="constructeur_ps"
                    value={formData.constructeur_ps}
                    onChange={handleChange}
                >
                    <option value="">{translate("Select")}</option>
                    {constructeurs_ps.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Brand")}</Form.Label>
                <Form.Control
                    name="marque_ps"
                    value={formData.marque_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
    </div>

    {/* 3 - Model & Category */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Model")}</Form.Label>
                <Form.Control
                    name="modele_ps"
                    value={formData.modele_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>


        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Category")}</Form.Label>
                <Form.Control
                    as="select"
                    name="categorie_ps"
                    value={formData.categorie_ps}
                    onChange={handleChange}
                >
                    <option value="">{translate("Select")}</option>
                    {Object.entries(categories).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </div>
    </div>

    {/* 4 - Type & Designation */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Type")}</Form.Label>
                <Form.Control
                    as="select"
                    name="type_piece_ps"
                    value={formData.type_piece_ps}
                    onChange={handleChange}
                >
                    <option value="">{translate("Select")}</option>
                    {Object.entries(typesPiece).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Designation")}</Form.Label>
                <Form.Control
                    name="designation_ps"
                    value={formData.designation_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
    </div>

    {/* 5 - Reference & Supplier */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Reference")}</Form.Label>
                <InputGroup>
                    <Form.Control
                        name="reference_ps"
                        value={formData.reference_ps}
                        onChange={handleChange}
                    />
                </InputGroup>
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Supplier")}</Form.Label>
                <Form.Control
                    as="select"
                    name="fournisseur_ps"
                    value={formData.fournisseur_ps}
                    onChange={handleChange}
                >
                    <option value="">{translate("Select")}</option>
                    {fournisseurs.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </div>
    </div>

    {/* 6 - Purchase Cost, Quantity, Min Stock */}
    <div className="row">
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Cost (DZD)")} </Form.Label>
                <Form.Control
                    type="text"
                    name="cout_achat_ps"
                    value={formData.cout_achat_ps}
                    onChange={handleChange}
                    min="0"
                     onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Quantity")}</Form.Label>
                <Form.Control
                    type="text"
                    name="quantite_ps"
                    value={formData.quantite_ps}
                    onChange={handleChange}
                    min="0"
                    onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Minimum Stock")}</Form.Label>
                <Form.Control
                    type="text"
                    name="stock_min_ps"
                    value={formData.stock_min_ps}
                    onChange={handleChange}
                    min="0"
                     onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                />
            </Form.Group>
        </div>
    </div>

    {/* 7 - Depreciation */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Depreciation Duration (days)")}</Form.Label>
                <Form.Control
                    type="text"
                    name="duree_amort_ps"
                    value={formData.duree_amort_ps}
                    onChange={handleChange}
                    min="0"
                     onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Depreciation KM")}</Form.Label>
                <Form.Control
                    type="text"
                    name="km_amort_ps"
                    value={formData.km_amort_ps}
                    onChange={handleChange}
                    min="0"
                     onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                />
            </Form.Group>
        </div>
    </div>
</Form>

                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {translate("Annuler")}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {translate("Enregistrer les modifications")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}