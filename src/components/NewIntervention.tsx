import React, {useState} from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "./LanguageProvider";


interface ModalNewInterventionnProps {
    show: boolean;
    handleClose: () => void;
    refreshintervention?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = 1;

const ModalNewIntervention: React.FC<ModalNewInterventionnProps> = ({
    show,
    handleClose,
    refreshintervention,
}) => {
    const [formData, setFormData] = useState({

    });

    const { translate } = useTranslate();



    return (
        <Modal show={show} onHide={handleClose} responsive>
            <Modal.Header closeButton>
                <Modal.Title>{translate("New Request")}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body
                    style={{ maxHeight: "calc(80vh - 200px)", overflowY: "auto" }}
                >
                    <Form.Group controlId="formDate">
                        <Form.Label>{translate("Request Date")}</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group controlId="formPriority">
                        <Form.Label></Form.Label>
                        <Form.Control as="select">
                            <option>{translate("Priority")}</option>
                            <option>{translate("Normal")}</option>
                            <option>{translate("Urgent")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formVehicle">
                        <Form.Label>{translate("Vehicle")}</Form.Label>
                        <Form.Control type="text" placeholder="Entrez le véhicule" />
                    </Form.Group>

                    <Form.Group controlId="formMileage">
                        <Form.Label>{translate("Km")}</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le kilométrage"
                        />
                    </Form.Group>

                    <Form.Group controlId="formSubject">
                        <Form.Label>{translate("Subject")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez l'objet de la demande"
                        />
                    </Form.Group>
                    <Form.Group controlId="formClient">
                        <Form.Label>{translate("Client")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du client"
                        />
                    </Form.Group>

                    <Form.Group controlId="formClientPhone">
                        <Form.Label>{translate("Client Phone")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le numéro de téléphone du client"
                        />
                    </Form.Group>

                    <Form.Group controlId="formReceptionistName">
                        <Form.Label>{translate("Receptionist's Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom du réceptionniste"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Close")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Add")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalNewIntervention;
