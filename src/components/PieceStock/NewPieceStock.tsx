import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";

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

    // Liste des types de pièces
    const typesPiece = {
        origine: translate("Pièce d'origine"),
        apresmarket: translate("Pièce après-vente"),
        reconditionne: translate("Reconditionné"),
        occasion: translate("Occasion")
    };

    useEffect(() => {
        // Charger les listes depuis l'API
        // fetch(`${backendUrl}/api/constructeur_pss`).then(...)
        setConstructeurs(['Facel Vega', 'Renault', 'Peugeot', 'Citroën', 'Autre']);
        setFournisseurs(['Fournisseur A', 'Fournisseur B', 'Fournisseur C']);
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
        }
    };

    

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Nouvelle pièce en stock")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
           <Form>
    {/* 1 - Date d'achat & N° Facture */}
    <div className="row">
            <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("N° Facture")}</Form.Label>
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
                <Form.Label>{translate("Date d'achat")}</Form.Label>
                <Form.Control
                    type="date"
                    name="date_achat_ps"
                    value={newPiece.date_achat_ps}
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
                <Form.Label>{translate("Marque")}</Form.Label>
                <Form.Control
                    name="marque_ps"
                    value={newPiece.marque_ps}
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
                    value={newPiece.modele_ps}
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

    {/* 4 - Type & Désignation */}
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
                <Form.Label>{translate("Désignation")}</Form.Label>
                <Form.Control
                    name="designation_ps"
                    value={newPiece.designation_ps}
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
                        value={newPiece.reference_ps}
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

    {/* 6 - Coût d'achat, Quantité, Stock min */}
    <div className="row">
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Coût d'achat")} (€)</Form.Label>
                <Form.Control
                    type="number"
                    step="0.01"
                    name="cout_achat_ps"
                    value={newPiece.cout_achat_ps}
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
                    value={newPiece.quantite_ps}
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
                    value={newPiece.stock_min_ps}
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
                    value={newPiece.duree_amort_ps}
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
                    value={newPiece.km_amort_ps}
                    onChange={handleChange}
                    min="0"
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