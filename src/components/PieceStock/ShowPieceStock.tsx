import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';
import { PropagateLoader } from "react-spinners";

interface ModalShowPieceStockProps {
    show: boolean;
    onHide: () => void;
    id_piece_stock: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowPieceStock: React.FC<ModalShowPieceStockProps> = ({ show, onHide, id_piece_stock }) => {
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

    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);

    const categoryLabels: { [key: string]: string } = {
        freinage: translate("Braking"),
        suspension: translate("Suspension"),
        moteur: translate("Engine"),
        carrosserie: translate("Bodywork")
    };

    const partTypeLabels: { [key: string]: string } = {
        origine: translate("OEM"),
        apres_marche: translate("Aftermarket"),
        reconditionne: translate("Refurbished")
    };

    const fetchPieceStock = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/geop/piece_stock/${id_piece_stock}`);
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data?.id_piece_stock) {
                setFormData({
                    num_facture_ps: data.num_facture_ps,
                    date_achat_ps: data.date_achat_ps,
                    constructeur_ps: data.constructeur_ps,
                    modele_ps: data.modele_ps,
                    marque_ps: data.marque_ps,
                    categorie_ps: data.categorie_ps,
                    type_piece_ps: data.type_piece_ps,
                    duree_amort_ps: data.duree_amort_ps,
                    km_amort_ps: data.km_amort_ps,
                    designation_ps: data.designation_ps,
                    reference_ps: data.reference_ps,
                    fournisseur_ps: data.fournisseur_ps,
                    cout_achat_ps: data.cout_achat_ps,
                    quantite_ps: data.quantite_ps,
                    stock_min_ps: data.stock_min_ps
                });
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show && id_piece_stock) fetchPieceStock();
    }, [show, id_piece_stock]);

    useEffect(() => {
        if (!show) {
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
        }
    }, [show]);

    return (
        <Modal show={show && !isLoading} onHide={onHide} backdrop="static" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Stock Details")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <PropagateLoader color="#0059b3" size={12} />
                        </div>
                    ) : (
                        <div className="row gap-2">
                            <div className="col-md-5">
                                <Form.Group controlId="constructeur_ps">
                                    <Form.Label>{translate("Manufacturer")}</Form.Label>
                                    <Form.Control value={formData.constructeur_ps} readOnly />
                                </Form.Group>

                                <Form.Group controlId="modele_ps">
                                    <Form.Label>{translate("Model")}</Form.Label>
                                    <Form.Control value={formData.modele_ps} readOnly />
                                </Form.Group>

                                <Form.Group controlId="marque_ps">
                                    <Form.Label>{translate("Brand")}</Form.Label>
                                    <Form.Control value={formData.marque_ps} readOnly />
                                </Form.Group>

                                <Form.Group controlId="categorie_ps">
                                    <Form.Label>{translate("Category")}</Form.Label>
                                    <Form.Control 
                                        value={categoryLabels[formData.categorie_ps] || formData.categorie_ps} 
                                        readOnly 
                                    />
                                </Form.Group>

                                <Form.Group controlId="type_piece_ps">
                                    <Form.Label>{translate("Part Type")}</Form.Label>
                                    <Form.Control 
                                        value={partTypeLabels[formData.type_piece_ps] || formData.type_piece_ps} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>

                            <div className="col-md-6">
                                <Form.Group controlId="designation_ps">
                                    <Form.Label>{translate("Designation")}</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        value={formData.designation_ps} 
                                        readOnly 
                                    />
                                </Form.Group>

                                <Form.Group controlId="reference_ps">
                                    <Form.Label>{translate("Reference")}</Form.Label>
                                    <Form.Control value={formData.reference_ps} readOnly />
                                </Form.Group>

                                <Form.Group controlId="fournisseur_ps">
                                    <Form.Label>{translate("Supplier")}</Form.Label>
                                    <Form.Control value={formData.fournisseur_ps} readOnly />
                                </Form.Group>

                                <div className="row">
                                    <div className="col">
                                        <Form.Group controlId="cout_achat_ps">
                                            <Form.Label>{translate("Purchase Cost")} (DZD)</Form.Label>
                                            <Form.Control
                                                value={formData.cout_achat_ps.toLocaleString()}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col">
                                        <Form.Group controlId="quantite_ps">
                                            <Form.Label>{translate("Quantity")}</Form.Label>
                                            <Form.Control
                                                value={formData.quantite_ps}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col">
                                        <Form.Group controlId="date_achat_ps">
                                            <Form.Label>{translate("Purchase Date")}</Form.Label>
                                            <Form.Control
                                                value={moment(formData.date_achat_ps).format('YYYY-MM-DD HH:mm')}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col">
                                        <Form.Group controlId="num_facture_ps">
                                            <Form.Label>{translate("Invoice Number")}</Form.Label>
                                            <Form.Control value={formData.num_facture_ps} readOnly />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col">
                                        <Form.Group controlId="duree_amort_ps">
                                            <Form.Label>{translate("Amort. Duration (months)")}</Form.Label>
                                            <Form.Control
                                                value={formData.duree_amort_ps}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col">
                                        <Form.Group controlId="km_amort_ps">
                                            <Form.Label>{translate("Amort. KM")}</Form.Label>
                                            <Form.Control
                                                value={formData.km_amort_ps.toLocaleString()}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <Form.Group controlId="stock_min_ps" className="mt-2">
                                    <Form.Label>{translate("Min Stock")}</Form.Label>
                                    <Form.Control
                                        value={formData.stock_min_ps}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {translate("Close")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalShowPieceStock;