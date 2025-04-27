import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import moment from 'moment'; // Importation de moment.js
import { formatDateToTimestamp } from "../../utilities/functions";

interface ModalShowPneuProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalShowPneu: React.FC<ModalShowPneuProps> = ({
    show,
    onHide,
    id_pneu,
}) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        product_pneu: "",
        date_achat_pneu: "",
        cost_pneu: "",
        type_pneu: "",
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
                    product_pneu: data.product_pneu,
                    date_achat_pneu: formatDateToTimestamp(data.date_achat_pneu),
                    cost_pneu: data.cost_pneu,
                    type_pneu: data.type_pneu,
                    immatriculation_vehicule: data.immatriculation_vehicule
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
        <Modal show={show} onHide={onHide} backdrop="static" responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Show")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}>
                    <Form.Group controlId="product_pneu">
                        <Form.Label>{translate("Product")}</Form.Label>
                        <Form.Control value={formData.product_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="date_achat_pneu">
                        <Form.Label>{translate("Purchase Date")}</Form.Label>
                        <Form.Control value={formData.date_achat_pneu} readOnly />
                    </Form.Group>

                    

                    <Form.Group controlId="cost_pneu">
                        <Form.Label>{translate("Cost")}</Form.Label>
                        <Form.Control value={formData.cost_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="type_pneu">
                        <Form.Label>{translate("Type")}</Form.Label>
                        <Form.Control value={formData.type_pneu} readOnly />
                    </Form.Group>

                    <Form.Group controlId="immatriculation_vehicule">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control value={formData.immatriculation_vehicule} readOnly />
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
