import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';
import { PropagateLoader } from "react-spinners";

interface ModalShowPneuStockProps {
    show: boolean;
    onHide: () => void;
    id_pneu_stock: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowPneuStock: React.FC<ModalShowPneuStockProps> = ({ show, onHide, id_pneu_stock }) => {
    const [formData, setFormData] = useState({
        id_pneu_stock: "",
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

    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);

    const fetchPneuStock = async () => {
        setIsLoading(true);
        try {
            const url = `${backendUrl}/api/geop/pneu_stock/${id_pneu_stock}`;
            console.log('Request URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response for pneu stock:', data);

            const formatDatetimeLocal = (value: string) => {
                const date = new Date(value);
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - offset * 60 * 1000);
                return localDate.toISOString().slice(0, 16);
            };

            if (data && data.id_pneu_stock) {
                setFormData({
                    id_pneu_stock: data.id_pneu_stock,
                    type_pneu: data.type_pneu,
                    modele_pneu: data.modele_pneu,
                    ref_pneu: data.ref_pneu,
                    num_serie_pneu: data.num_serie_pneu,
                    loc_pneu: data.loc_pneu,
                    date_achat_pneu: formatDatetimeLocal(data.date_achat_pneu),
                    cout_pneu: data.cout_pneu,
                    fourn_pneu: data.fourn_pneu,
                    marque_pneu:data.marque_pneu,

                    fact_pneu: data.fact_pneu
                });
            } else {
                console.warn('No stock data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (show && id_pneu_stock) {
            fetchPneuStock();
        }
    }, [show, id_pneu_stock]);

    useEffect(() => {
        if (!show) {
            setFormData({
                id_pneu_stock: "",
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
        }
    }, [show]);

    const typePneuLabels: { [key: string]: string } = {
        utilitaire: translate("Utility/Van"),
        poids_lourd: translate("Heavy Truck"),
        suv: translate("SUV / 4x4"),
        remorque: translate("Trailer (small luggage)"),
        voiture: translate("Car/Passenger"),
        agricole: translate("Agricultural"),
      };
      
      const positionLabels: { [key: string]: string } = {
        front_left: translate("Front Left"),
        front_right: translate("Front Right"),
        rear_left: translate("Rear Left"),
        rear_right: translate("Rear Right"),
        spare: translate("Spare Tire"),
      };
      

    return (
        <Modal show={show && !isLoading} onHide={onHide} backdrop="static">
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
                        <div className="row">
                            <Form.Group controlId="marque_pneu">
                                    <Form.Label>{translate("Brand")} *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.marque_pneu} 
                                        readOnly 
                                    />
                                </Form.Group>
                                <Form.Group controlId="type_pneu">
                                    <Form.Label>{translate("Type")}</Form.Label>
                                    <Form.Control
                                    value={typePneuLabels[formData.type_pneu] || formData.type_pneu}                                      readOnly />
                                </Form.Group>

                                <Form.Group controlId="modele_pneu">
                                    <Form.Label>{translate("Model")}</Form.Label>
                                    <Form.Control value={formData.modele_pneu} readOnly />
                                </Form.Group>

                                <Form.Group controlId="ref_pneu">
                                    <Form.Label>{translate("Reference")}</Form.Label>
                                    <Form.Control value={formData.ref_pneu} readOnly />
                                </Form.Group>

                                <Form.Group controlId="num_serie_pneu">
                                    <Form.Label>{translate("Serial Number")}</Form.Label>
                                    <Form.Control value={formData.num_serie_pneu} readOnly />
                                </Form.Group>

                                <Form.Group controlId="loc_pneu">
                                    <Form.Label>{translate("Storage Location")}</Form.Label>
                                    <Form.Control value={positionLabels[formData.loc_pneu] || formData.loc_pneu} readOnly />
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

                                

                                <Form.Group controlId="fourn_pneu">
                                    <Form.Label>{translate("Supplier")}</Form.Label>
                                    <Form.Control value={formData.fourn_pneu} readOnly />
                                </Form.Group>

                                <Form.Group controlId="fact_pneu">
                                    <Form.Label>{translate("Invoice Number")}</Form.Label>
                                    <Form.Control value={formData.fact_pneu} readOnly />
                                </Form.Group>
                                <Form.Group controlId="cout_pneu">
                                    <Form.Label>{translate("Cost")} (DZD)</Form.Label>
                                    <Form.Control
                                        value={`${formData.cout_pneu}`}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
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

export default ModalShowPneuStock;