import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';
import { PropagateLoader } from "react-spinners";

interface ModalShowPneuProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowPneu: React.FC<ModalShowPneuProps> = ({ show, onHide, id_pneu }) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        num_facture_pneu: "",
        source_pneu:"",
        km_pneu: "",
        date_achat_pneu: "",
        etat_pneu: "",
        position_pneu: "",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu: "",
        temps_amort: "",
        immatriculation_vehicule: "",
        technicien_pneu: "",
        marque_pneu: "",
        modele_pneu: "",
        ref_pneu: "",
        id_pneu_stock: ""
    });

    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);

    const fetchPneu = async () => {
        setIsLoading(true);
        try {
            const url = `${backendUrl}/api/geop/showpneu/${id_pneu}`;
            console.log('Request URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response for pneu:', data);

            if (data && data.id_pneu) {
                setFormData({
                    id_pneu: data.id_pneu,
                    num_facture_pneu: data.num_facture_pneu,
                    source_pneu:data.source_pneu,
                    technicien_pneu: data.technicien_pneu,

                    date_achat_pneu: data.date_achat_pneu,
                    km_pneu: data.km_pneu,
                    cout_pneu: data.cout_pneu,
                    type_pneu: data.type_pneu,
                    immatriculation_vehicule: data.immatriculation_vehicule,
                    etat_pneu: data.etat_pneu || "",
                    position_pneu: data.position_pneu || "",
                    fournisseur_pneu: data.fournisseur_pneu || "",
                    temps_amort: data.temps_amort || "",
                    marque_pneu: data.marque_pneu || "",
                    modele_pneu: data.modele_pneu || "",
                    ref_pneu: data.ref_pneu || "",
                    id_pneu_stock: data.id_pneu_stock || ""
                });
            } else {
                console.warn('No pneu data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching pneu data:', error);
        }
            finally {
                setIsLoading(false);
            }
    };

    useEffect(() => {
        if (show) {
            fetchPneu();
        }
    }, [show]);

      useEffect(() => {
            if (!show) {
                setFormData({
                    id_pneu: "",
                    num_facture_pneu: "",
                    technicien_pneu: "",

                    source_pneu:"",
                    km_pneu: "",
                    date_achat_pneu: "",
                    etat_pneu: "",
                    position_pneu: "",
                    cout_pneu: "",
                    type_pneu: "",
                    fournisseur_pneu: "",
                    temps_amort: "",
                    immatriculation_vehicule: "",
                    marque_pneu:  "",
                    modele_pneu: "",
                    ref_pneu:"",
                    id_pneu_stock:""
                });
            }
        }, [show]);

        

    return (
        <Modal show={show && !isLoading} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <PropagateLoader color="#0059b3" size={12} />
                        </div>
                    ) : (
                        <>
                    
                    <Form.Group controlId="num_facture_pneu">
                        <Form.Label>{translate("Inv. No.")}</Form.Label>
                        <Form.Control value={formData.num_facture_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control
                            value={
                                formData.date_achat_pneu
                                    ? moment(formData.date_achat_pneu).format('YYYY-MM-DD HH:mm')
                                    : ""
                            }
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="immatriculation_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control value={formData.immatriculation_vehicule} readOnly />
                    </Form.Group>

                    <Form.Group controlId="km_pneu">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control type="text" value={formData.km_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="etat_pneu">
                        <Form.Label>{translate("Tire Status")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.etat_pneu === "installer"
                                ? translate("Install")
                                : formData.etat_pneu === "desinstaller"
                                ? translate("Uninstall")
                                : formData.etat_pneu}
                            readOnly
                        />
                    </Form.Group>


                    <Form.Group controlId="position_pneu">
                        <Form.Label>{translate("Position")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={(() => {
                                switch (formData.position_pneu) {
                                    case "front_left": return translate("Front Left");
                                    case "front_right": return translate("Front Right");
                                    case "rear_left": return translate("Rear Left");
                                    case "rear_right": return translate("Rear Right");
                                    case "spare": return translate("Spare Tire");
                                    default: return formData.position_pneu;
                                }
                            })()}
                            readOnly
                        />
                    </Form.Group>

                    <Form.Group controlId="source_pneu">
                    <Form.Label>{translate("Tire Source")}</Form.Label>
                    <Form.Control
                        type="text"
                        value={
                            formData.source_pneu === "internal"
                                ? translate("Internal")
                                : formData.source_pneu === "external"
                                ? translate("External")
                                : formData.source_pneu
                        }
                        readOnly
                    />
                </Form.Group>
                                    

                     {formData.source_pneu === "internal" && (
                        <Form.Group controlId="technicien_pneu">
                            <Form.Label>{translate("Technician")}</Form.Label>
                            <Form.Control type="text" value={formData.technicien_pneu} readOnly />
                        </Form.Group>
                     )}
                      
        <Form.Group controlId="stock_pneu_info">
            <Form.Label>{translate("Stock Tire Details")}</Form.Label>
            <Form.Control 
                type="text" 
                value={`${formData.marque_pneu} ${formData.modele_pneu} (${formData.ref_pneu}) `} 
                readOnly 
            />
        </Form.Group>


                    {formData.source_pneu === "external" && (
                        <>
                            <Form.Group controlId="fournisseur_pneu">
                                <Form.Label>{translate("Supplier")}</Form.Label>
                                <Form.Control type="text" value={formData.fournisseur_pneu} readOnly />
                            </Form.Group>

                            <Form.Group controlId="temps_amort">
                                <Form.Label>{translate("Duration")}</Form.Label>
                                <Form.Control type="text" value={formData.temps_amort} readOnly />
                            </Form.Group>

                            <Form.Group controlId="cout_pneu">
                                <Form.Label>{translate("Cost")}</Form.Label>
                                <Form.Control type="text" value={formData.cout_pneu} readOnly />
                            </Form.Group>
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

export default ModalShowPneu;
