import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";


interface NewPieceStockProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ModalNewPieceStock({ show, onHide, onSuccess }: NewPieceStockProps) {
    const { translate } = useTranslate();
        const geopuserID = localStorage.getItem("GeopUserID");

    const id_user = localStorage.getItem("GeopUserID");

    const [constructeurs_ps, setConstructeurs] = useState<string[]>([]);
    const [fournisseurs, setFournisseurs] = useState<string[]>([]);

    const [newPiece, setNewPiece] = useState({
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

    // Liste des catégories
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
        // Charger les listes depuis l'API
        // fetch(`${backendUrl}/api/constructeur_pss`).then(...)
        setConstructeurs(['Facel Vega', 'Renault', 'Peugeot', 'Citroën', 'Autre']);
        setFournisseurs(['A', 'B', 'C']);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const numericFields = ['duree_amort_ps', 'km_amort', 'cout_achat', 'quantite', 'stock_min'];
        
        setNewPiece(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) || 0 : value
        }));
    };
       const handleClose = () => {
        setNewPiece({
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

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/geop/piece_stock/${geopuserID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newPiece,
                    id_user: id_user
                })
            });

            if (response.ok) {
                  toast.success(translate("Added to stock successfully!"), {
                                position: "bottom-right",
                                autoClose: 2400,
                                transition: Bounce,
                            });
                onSuccess();
                onHide();
                setNewPiece(prev => ({
                    ...prev,
                    num_facture_ps: '',
                    quantite: 0,
                    stock_min: 0
                }));
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
              toast.error(translate("Error adding to stock. Please try again"), {
                            position: "bottom-right",
                            autoClose: 2400,
                            transition: Bounce,
                        });
        }
    };

    

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Nouvelle pièce en stock")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
         <Form>
    {/* 1 - Date & Invoice Number */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Invoice Number")}</Form.Label>
                <Form.Control
                    name="num_facture_ps"
                    value={newPiece.num_facture_ps}
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
                    value={newPiece.date_achat_ps}
                    onChange={handleChange}
                    min="2000-01-01T00:00"
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
                    value={newPiece.constructeur_ps}
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
                    value={newPiece.marque_ps}
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
                    value={newPiece.modele_ps}
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
                    value={newPiece.categorie_ps}
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
                    value={newPiece.type_piece_ps}
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
                    value={newPiece.designation_ps}
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
                        value={newPiece.reference_ps}
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
                    value={newPiece.fournisseur_ps}
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

    <div className="row">
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Cost (DZD)")}</Form.Label>
                <Form.Control
                    type="text"
                    name="cout_achat_ps"
                    value={newPiece.cout_achat_ps}
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
                    value={newPiece.quantite_ps}
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
                    value={newPiece.stock_min_ps}
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
                    value={newPiece.duree_amort_ps}
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
                    value={newPiece.km_amort_ps}
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


            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {translate("Annuler")}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {translate("Enregistrer")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}