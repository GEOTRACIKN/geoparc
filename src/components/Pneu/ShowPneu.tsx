import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment';

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
        km_pneu: "",
        date_achat_pneu: "",
        etat_pneu: "",
        position_pneu: "",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu: "",
        temps_amort: "",
        immatriculation_vehicule: "",
    });

    const { translate } = useTranslate();

    const fetchPneu = async () => {
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
                    date_achat_pneu: data.date_achat_pneu,
                    km_pneu: data.km_pneu,
                    cout_pneu: data.cout_pneu,
                    type_pneu: data.type_pneu,
                    immatriculation_vehicule: data.immatriculation_vehicule,
                    etat_pneu: data.etat_pneu || "",
                    position_pneu: data.position_pneu || "",
                    fournisseur_pneu: data.fournisseur_pneu || "",
                    temps_amort: data.temps_amort || ""
                });
            } else {
                console.warn('No pneu data found for the provided ID.');
            }
        } catch (error) {
            console.error('Error fetching pneu data:', error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchPneu();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    
                    <Form.Group controlId="num_facture_pneu">
                        <Form.Label>{translate("N° Facture")}</Form.Label>
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
                        <Form.Label>{translate("Pneu à installer/désinstaller")}</Form.Label>
                        <Form.Control type="text" value={formData.etat_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="position_pneu">
                        <Form.Label>{translate("Position")}</Form.Label>
                        <Form.Control type="text" value={formData.position_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="fournisseur_pneu">
                        <Form.Label>{translate("Fournisseur")}</Form.Label>
                        <Form.Control type="text" value={formData.fournisseur_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="temps_amort">
                        <Form.Label>{translate("Durée")}</Form.Label>
                        <Form.Control type="text" value={formData.temps_amort} readOnly />
                    </Form.Group>

                    <Form.Group controlId="cout_pneu">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control type="text" value={formData.cout_pneu} readOnly />
                    </Form.Group>

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

export default ModalShowPneu;
