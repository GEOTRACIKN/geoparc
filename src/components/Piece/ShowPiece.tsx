import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';
import { PropagateLoader } from "react-spinners";

interface ModalShowPieceProps {
    show: boolean;
    onHide: () => void;
    id_piece: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowPiece: React.FC<ModalShowPieceProps> = ({ show, onHide, id_piece }) => {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);
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
        immatriculation_vehicule: "",
        stock_designation: "",
        stock_reference: "",
        stock_constructeur: "",
        stock_modele: "",
        stock_marque: ""
    });

    const fetchPiece = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/geop/showpiece/${id_piece}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (data && data.id_piece) {
                setFormData({
                    id_piece: data.id_piece,
                    type_operation_piece: data.type_operation_piece,
                    id_vehicule_piece: data.id_vehicule_piece,
                    source_piece: data.source_piece,
                    position_piece: data.position_piece,
                    technicien_piece: data.technicien_piece,
                    num_facture_piece: data.num_facture_piece,
                    fournisseur_piece: data.fournisseur_piece,
                    date_piece: data.date_piece,
                    duree_piece: data.duree_piece,
                    cout_piece: data.cout_piece,
                    details_piece: data.details_piece,
                    id_piece_stock: data.id_piece_stock,
                    immatriculation_vehicule: data.immatriculation_vehicule || "",
                    stock_designation: data.designation_ps || "",
                    stock_reference: data.reference_ps || "",
                    stock_constructeur: data.constructeur_ps || "",
                    stock_modele: data.modele_ps || "",
                    stock_marque: data.marque_ps || ""
                });
            }
        } catch (error) {
            console.error('Error fetching piece data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show && id_piece) fetchPiece();
    }, [show, id_piece]);

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
                immatriculation_vehicule: "",
                stock_designation: "",
                stock_reference: "",
                stock_constructeur: "",
                stock_modele: "",
                stock_marque: ""
            });
        }
    }, [show]);

    const translateOperationType = (type: string) => {
        switch (type) {
            case "add": return translate("Add");
            case "replace": return translate("Replace");
            default: return type;
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show Piece Details")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <PropagateLoader color="#0059b3" size={12} />
                    </div>
                ) : (
                    <>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Operation Type")}</Form.Label>
                                    <Form.Control 
                                        value={translateOperationType(formData.type_operation_piece)} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Vehicle")}</Form.Label>
                                    <Form.Control 
                                        value={formData.immatriculation_vehicule} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Source")}</Form.Label>
                                    <Form.Control 
                                        value={
                                            formData.source_piece === "internal" 
                                                ? translate("Internal") 
                                                : translate("External")
                                        } 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Position")}</Form.Label>
                                    <Form.Control 
                                        value={formData.position_piece} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Date")}</Form.Label>
                                    <Form.Control 
                                        value={moment(formData.date_piece).format('YYYY-MM-DD HH:mm')} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>{translate("Details")}</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        value={formData.details_piece} 
                                        readOnly 
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        {formData.source_piece === "internal" && (
                            <>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Technician")}</Form.Label>
                                            <Form.Control 
                                                value={formData.technicien_piece} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Stock Piece")}</Form.Label>
                                            <Form.Control 
                                                value={`${formData.stock_designation} - ${formData.stock_reference} (${formData.stock_marque} ${formData.stock_modele})`} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </>
                        )}

                        {formData.source_piece === "external" && (
                            <>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Invoice Number")}</Form.Label>
                                            <Form.Control 
                                                value={formData.num_facture_piece} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Supplier")}</Form.Label>
                                            <Form.Control 
                                                value={formData.fournisseur_piece} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Duration")}</Form.Label>
                                            <Form.Control 
                                                value={formData.duree_piece} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>{translate("Cost (DZD)")}</Form.Label>
                                            <Form.Control 
                                                value={formData.cout_piece} 
                                                readOnly 
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
                </Modal.Body>
                
                {!isLoading && (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            {translate("Close")}
                        </Button>
                    </Modal.Footer>
                )}
            </Form>
        </Modal>
    );
};

export default ModalShowPiece;