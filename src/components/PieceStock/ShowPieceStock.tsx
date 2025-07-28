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
                <Modal.Title>{translate("Details")}</Modal.Title>
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
                    } 
                />
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
                <Form.Control readOnly value={`${formData.km_amort_ps || '0'} `} />
            </Form.Group>
        </div>
    </div>

    {/* Line 8 - Expiration (nouvelle section séparée) */}
    <div className="row mt-3">
        
        
        <div className="col-md-6">
            <Form.Group className="mb-3">
                <Form.Label>{translate("Expiration Type")}</Form.Label>
                <Form.Control 
                    readOnly
                    value={
                        formData.exp_type_ps === "date" ? translate("By Date Only") :
                        formData.exp_type_ps === "km" ? translate("By Kilometer Only") :
                        formData.exp_type_ps === "both" ? translate("By Date and Kilometer") :
                        translate("No Expiration")
                    }
                />
            </Form.Group>
        </div>

        {formData.exp_type_ps === "date" || formData.exp_type_ps === "both" ? (
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>{translate("Expiration Date")}</Form.Label>
                    <Form.Control
                        readOnly
                        value={formData.exp_date_ps 
                            ? moment(formData.exp_date_ps).format('YYYY-MM-DD')
                            : '-'}
                    />
                </Form.Group>
            </div>
        ) : null}

        {formData.exp_type_ps === "km" || formData.exp_type_ps === "both" ? (
            <div className="col-md-6">
                <Form.Group className="mb-3">
                    <Form.Label>{translate("Kilometer Limit")}</Form.Label>
                    <Form.Control
                        readOnly
                        value={formData.exp_km_ps 
                            ? `${formData.exp_km_ps} `
                            : '-'}
                    />
                </Form.Group>
            </div>
        ) : null}
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