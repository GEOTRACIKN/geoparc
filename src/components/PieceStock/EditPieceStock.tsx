import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";
import axios from "axios";

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

    const categories = {
        freinage: translate("Freinage"),
        filtration: translate("Filtration"),
        moteur: translate("Moteur"),
        suspension_direction: translate("Suspension/Direction"),
        echappement: translate("Échappement"),
        electricite: translate("Électricité"),
        chauffage_refroidissement: translate("Chauffage/Refroidissement"),
        carrosserie: translate("Carrosserie"),
        accessoires: translate("Accessoires"),
        liquide_lubrifiant: translate("Liquide/Lubrifiant"),
        autres: translate("AUTRES"),
    };

    const typesPiece = {
        origine: translate("Pièce d'origine"),
        apresmarket: translate("Pièce après-vente"),
        reconditionne: translate("Reconditionné"),
        occasion: translate("Occasion")
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id_piece_stock) return;
            
            try {
                const response = await axios.get(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`);
                const data = response.data;

                setFormData({
                    ...data,
                    date_achat_ps: data.date_achat_ps.split('T')[0] // Formatage de la date
                });

                // Charger les listes
                setConstructeurs(['Facel Vega', 'Renault', 'Peugeot', 'Citroën', 'Autre']);
                setFournisseurs(['Fournisseur A', 'Fournisseur B', 'Fournisseur C']);
                
            } catch (error) {
                console.error("Erreur de chargement des données:", error);
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
            await axios.put(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`, {
                ...formData,
                id_user: id_user
            });

            onSuccess();
            onHide();
        } catch (error) {
            console.error("Erreur de mise à jour:", error);
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
                <Modal.Title>{translate("Modifier la pièce en stock")}</Modal.Title>
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
    {/* 1 - Date d'achat & N° Facture */}
    <div className="row">
            <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("N° Facture")}</Form.Label>
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
                <Form.Label>{translate("Date d'achat")}</Form.Label>
                <Form.Control
                    type="date"
                    name="date_achat_ps"
                    value={formData.date_achat_ps}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
        </div>
    
    </div>

    {/* 2 - Constructeur & Marque */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Constructeur")}</Form.Label>
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
                <Form.Label>{translate("Marque")}</Form.Label>
                <Form.Control
                    name="marque_ps"
                    value={formData.marque_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
    </div>

    {/* 3 - Modèle & Catégorie */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Modèle")}</Form.Label>
                <Form.Control
                    name="modele_ps"
                    value={formData.modele_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Catégorie")}</Form.Label>
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

    {/* 4 - Type & Désignation */}
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
                <Form.Label>{translate("Désignation")}</Form.Label>
                <Form.Control
                    name="designation_ps"
                    value={formData.designation_ps}
                    onChange={handleChange}
                />
            </Form.Group>
        </div>
    </div>

    {/* 5 - Référence & Fournisseur */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Référence")}</Form.Label>
                <InputGroup>
                    <Form.Control
                        name="reference_ps"
                        value={formData.reference_ps}
                        onChange={handleChange}
                    />
                    <Button variant="outline-secondary">
                        <i className="las la-barcode"></i>
                    </Button>
                </InputGroup>
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Fournisseur")}</Form.Label>
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

    {/* 6 - Coût d'achat, Quantité, Stock min */}
    <div className="row">
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Coût d'achat")} (€)</Form.Label>
                <Form.Control
                    type="number"
                    step="0.01"
                    name="cout_achat_ps"
                    value={formData.cout_achat_ps}
                    onChange={handleChange}
                    min="0"
                />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Quantité")}</Form.Label>
                <Form.Control
                    type="number"
                    name="quantite_ps"
                    value={formData.quantite_ps}
                    onChange={handleChange}
                    min="0"
                />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Stock min")}</Form.Label>
                <Form.Control
                    type="number"
                    name="stock_min_ps"
                    value={formData.stock_min_ps}
                    onChange={handleChange}
                    min="0"
                />
            </Form.Group>
        </div>
    </div>

    {/* 7 - Amortissement */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Durée d'amort (jours)")}</Form.Label>
                <Form.Control
                    type="number"
                    name="duree_amort_ps"
                    value={formData.duree_amort_ps}
                    onChange={handleChange}
                    min="0"
                />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("KM d'amort")}</Form.Label>
                <Form.Control
                    type="number"
                    name="km_amort_ps"
                    value={formData.km_amort_ps}
                    onChange={handleChange}
                    min="0"
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