import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";
import moment from "moment";

interface ShowPieceStockProps {
    show: boolean;
    onHide: () => void;
    id_piece_stock: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function ShowPieceStockModal({ show, onHide, id_piece_stock }: ShowPieceStockProps) {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<any>(null);

    // Liste des catégories (identique à l'édition)
    const categories : { [key: string]: string } = {
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

    // Liste des types de pièces (identique à l'édition)
    const typesPiece : { [key: string]: string } = {
        origine: translate("Pièce d'origine"),
        apresmarket: translate("Pièce après-vente"),
        reconditionne: translate("Reconditionné"),
        occasion: translate("Occasion")
    };

    

    useEffect(() => {
        const fetchData = async () => {
            if (!id_piece_stock || !show) return;
            
            try {
                const response = await axios.get(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`);
                const data = response.data;

                           setFormData(data); // Ne pas modifier la date ici

            } catch (error) {
                console.error("Erreur de chargement:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (show) {
            setIsLoading(true);
            fetchData();
        }
    }, [show, id_piece_stock]);

    const handleClose = () => {
        setFormData(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Détails de la pièce")}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center py-5">
                        <PropagateLoader color="#0d6efd" size={15} />
                    </div>
                ) : (
                    formData && (
                       <Form>
    {/* Line 1 - Invoice Number & Purchase Date */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Invoice Number")}</Form.Label>
                <Form.Control readOnly value={formData.num_facture_ps || '-'} />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Purchase Date")}</Form.Label>
                <Form.Control readOnly 
                value={
                formData.date_achat_ps
                    ? moment(formData.date_achat_ps).format('YYYY-MM-DD hh:mm A')

                    : ""
            } />
                </Form.Group>
        </div>
    </div>

    {/* Line 2 - Manufacturer & Brand */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Manufacturer")}</Form.Label>
                <Form.Control readOnly value={formData.constructeur_ps || '-'} />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Brand")}</Form.Label>
                <Form.Control readOnly value={formData.marque_ps || '-'} />
            </Form.Group>
        </div>
    </div>

    {/* Line 3 - Model & Category */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Model")}</Form.Label>
                <Form.Control readOnly value={formData.modele_ps || '-'} />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Category")}</Form.Label>
                <Form.Control
                    readOnly
                    value={categories[formData.categorie_ps] || formData.categorie_ps || '-'}
                />
            </Form.Group>
        </div>
    </div>

    {/* Line 4 - Type & Designation */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Type")}</Form.Label>
                <Form.Control
                    readOnly
                    value={typesPiece[formData.type_piece_ps] || formData.type_piece_ps || '-'}
                />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Designation")}</Form.Label>
                <Form.Control
                    readOnly
                    as="textarea"
                    value={formData.designation_ps || '-'}
                />
            </Form.Group>
        </div>
    </div>

    {/* Line 5 - Reference & Supplier */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Reference")}</Form.Label>
                <InputGroup>
                    <Form.Control
                        readOnly
                        value={formData.reference_ps || '-'}
                    />
                </InputGroup>
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Supplier")}</Form.Label>
                <Form.Control
                    readOnly
                    value={formData.fournisseur_ps || '-'}
                />
            </Form.Group>
        </div>
    </div>

    {/* Line 6 - Cost & Stock */}
    <div className="row">
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Cost (DZD)")}</Form.Label>
                <Form.Control readOnly value={formData.cout_achat_ps} />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Quantity")}</Form.Label>
                <Form.Control readOnly value={formData.quantite_ps || '0'} />
            </Form.Group>
        </div>
        <div className="col-md-4">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Minimum Stock")}</Form.Label>
                <Form.Control readOnly value={formData.stock_min_ps || '0'} />
            </Form.Group>
        </div>
    </div>

    {/* Line 7 - Depreciation */}
    <div className="row">
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Depreciation Duration (days)")}</Form.Label>
                <Form.Control readOnly value={formData.duree_amort_ps || '0'} />
            </Form.Group>
        </div>
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Depreciation KM")}</Form.Label>
                <Form.Control readOnly value={`${formData.km_amort_ps || '0'} km`} />
            </Form.Group>
        </div>
    </div>
</Form>

                    )
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {translate("Fermer")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}