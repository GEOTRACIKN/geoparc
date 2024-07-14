import React, { useState } from "react";
import {Container,Row,Col,Form,Button,ProgressBar,} 
from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

import marchePiedImg from '../assets/images/checklist/1MZL5_AS01.jpg';
import batterie from '../assets/images/checklist/2720003_3quart_900px_1.jpg';
import triangle from '../assets/images/checklist/triangle.jpg';


type FormData = {
    checker: string;
    date: string;
    incomingDriver: string;
    matriculetrac: string;
    km: string;
    outgoingDriver: string;
    matriculerem: string;
    operating_hours: string;
    papierStatus: string;
};

// Définition des règles de validation par champ
const initialValidationState = {
    checker: false,
    date: false,
    incomingDriver: true,
    matriculetrac: false,
    km: false,
    outgoingDriver: true,
    matriculerem: false,
    operating_hours: false,
    papierStatus: false,
};

export function Vehiclecheck() {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        checker: "",
        date: "",
        incomingDriver: "",
        matriculetrac: "",
        km: "",
        outgoingDriver: "",
        matriculerem: "",
        operating_hours: "",
        papierStatus: "",
    });
    const [formValidation, setFormValidation] = useState(initialValidationState);
    const navigate = useNavigate();

    const validateForm = () => {
        const {
            checker,
            date,
            matriculetrac,
            km,
            matriculerem,
            operating_hours,
            papierStatus,
        } = formData;
        const isValid =
            checker !== "" &&
            date !== "" &&
            matriculetrac !== "" &&
            km !== "" &&
            matriculerem !== "" &&
            operating_hours !== "" &&
            papierStatus !== "";
        setFormValidation({
            ...formValidation,
            checker: checker !== "",
            date: date !== "",
            matriculetrac: matriculetrac !== "",
            km: km !== "",
            matriculerem: matriculerem !== "",
            operating_hours: operating_hours !== "",
            papierStatus: papierStatus !== "",
        });
        return isValid;
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const nextStep = () => {
        setStep(step + 1);
        // if (validateForm()) { //vérifie les permiers champ si ils ont remplie ou pas 
           
        // } else {
        //     toast.error("Veuillez remplir tous les champs obligatoires. ", {
        //         position: "bottom-right",
        //         autoClose: 3000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //         transition: Bounce,
        //     });
        // }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const goToVehicleChecks = () => {
        navigate("/vehicles_checks"); // Naviguer vers la page Vehicle_checks
    };


    return (
        <Container>
            <h3 className="text-center mb-4">Vérification véhicule</h3>
            <ProgressBar
                now={(step / 7) * 100}
                label={`Étape ${step}`}
                className="mb-4"
            />
            {step === 1 && (
                <Form className="p-3 shadow-sm">
                    <h4>Informations générales</h4>
                    <Row>
                        <Col sm={6}>
                            <Form.Group as={Row} controlId="formVerifier" className="mb-3">
                                <Form.Label column sm={10}>
                                    Vérifié par*
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="checker"
                                        value={formData.checker}
                                        onChange={handleChange}
                                        placeholder="Nom du vérificateur"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                controlId="formIncomingDriver"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Chauffeur entrant
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="incomingDriver"
                                        value={formData.incomingDriver}
                                        onChange={handleChange}
                                        placeholder="Entrez le chauffeur entrant"
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group
                                as={Row}
                                controlId="formmatriculetrac"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Immatriculation tracteur
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="matriculetrac"
                                        value={formData.matriculetrac}
                                        onChange={handleChange}
                                        placeholder="Entrez l'immatriculation du tracteur"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formKm" className="mb-3">
                                <Form.Label column sm={10}>
                                    Km
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="km"
                                        value={formData.km}
                                        onChange={handleChange}
                                        placeholder="Entrez le nombre de kilomètres"
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formpapier" className="mb-3">
                                <Form.Label column sm={10}>
                                    Papiers *
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            checked={formData.papierStatus === "Conforme"}
                                            onChange={handleChange}
                                            name="papierStatus"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            checked={formData.papierStatus === "Non Conforme"}
                                            onChange={handleChange}
                                            name="papierStatus"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group as={Row} controlId="formDate" className="mb-3">
                                <Form.Label column sm={10}>
                                    Date*
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                controlId="formOutgoingDriver"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Chauffeur sortant
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="outgoingDriver"
                                        value={formData.outgoingDriver}
                                        onChange={handleChange}
                                        placeholder="Entrez le chauffeur sortant"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group
                                as={Row}
                                controlId="formmatriculerem"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Immatriculation remorque
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="matriculerem"
                                        value={formData.matriculerem}
                                        onChange={handleChange}
                                        placeholder="Entrez l'immatriculation de la remorque"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHeures" className="mb-3">
                                <Form.Label column sm={10}>
                                    Heure de fonctionnement
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="time"
                                        name="operating_hours"
                                        value={formData.operating_hours}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={goToVehicleChecks}
                        >
                            Quitter
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step === 2 && (
                <Form className="p-3 shadow-sm">
                    <h4>Information véhicule</h4>
                    <Row>
                        <Col sm={6}>
                            {/* Marche pied form */}
                            <Form.Group as={Row} controlId="marchePied" className="mb-3">
                                <Form.Label column sm={10}>
                                    Marche pied
                                </Form.Label>
                                <img className="check_item_img" src={marchePiedImg} alt="" />
                                <Form.Label column sm={10}>
                                    Droite
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Droite"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Droite"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                                <Form.Label column sm={10}>
                                    Gauche
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Gauche"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Gauche"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Batterie */}
                            <Form.Group
                                as={Row}
                                controlId=" "
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Batterie
                                </Form.Label>
                                <img className="check_item_img" src={batterie} alt="" />

                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Batterie"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Batterie"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Pneu (tracteur) */}
                            <Form.Group as={Row} controlId="Pneutracteur" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pneu (tracteur)
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                {['g_av_tr', 'd_av_tr', 'g_ar_tr_int', 'd_ar_tr_int', 'g_ar_tr_ext', 'd_ar_tr_ext'].map(position => (
                                    <Form.Group as={Row} key={position} className="mb-2">
                                        <Form.Label column sm={10}>
                                            {position.replace('_', ' ').toUpperCase()} :
                                        </Form.Label>
                                        <Col sm={10}>
                                            <div>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Conforme"
                                                    name="Pneutracteur"
                                                    value="Conforme"
                                                    inline
                                                    className="mr-4"
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Non Conforme"
                                                    name="Pneutracteur"
                                                    value="Non Conforme"
                                                    inline
                                                    className="ml-4"
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                ))}

                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/* Triangles cales */}
                            <Form.Group
                                as={Row}
                                controlId="Triangles"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Triangles/cales
                                </Form.Label>
                                <img className="check_item_img" src={triangle} alt="" />

                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Triangles"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Triangles"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Extincteur (date d'expiration) */}
                            <Form.Group as={Row} controlId="extincteurDate" className="mb-3">
                                <Form.Label column sm={10}>
                                    Extincteur (date d'expiration)
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="date"
                                        name="extincteur_date"
                                    />
                                </Col>
                            </Form.Group>
                            {/* Pneu (Remorque) */}
                            <Form.Group as={Row} controlId="PneuRemorque" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pneu (Remorque)
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                {['g_issue1_rm', 'd_issue1_rm', 'g_issue2_rm', 'd_issue2_rm', 'g_issue3_rm', 'd_issue3_rm'].map(position => (
                                    <Form.Group as={Row} key={position} className="mb-2">
                                        <Form.Label column lg={6}>
                                            {position.replace('_', ' ').toUpperCase()} :
                                        </Form.Label>
                                        <Col sm={10}>
                                            <div>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Conforme"
                                                    name="PneuRemorque"
                                                    value="Conforme"
                                                    inline
                                                    className="mr-4"
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Non Conforme"
                                                    name="PneuRemorque"
                                                    value="Non Conforme"
                                                    inline
                                                    className="ml-4"
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                ))}

                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step === 3 && (
                <Form className="p-3 shadow-sm">
                    <h4>Information véhicule</h4>
                    <Row>
                        <Col sm={6}>
                            {/* Crique form */}
                            <Form.Group as={Row} controlId="Crique" className="mb-3">
                                <Form.Label column sm={10}>
                                    Crique
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Crique"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Crique"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/*Trousse outils */}
                            <Form.Group
                                as={Row}
                                controlId="Trousse"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Trousse outils
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Trousse"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Trousse"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Mannon de pression */}
                            <Form.Group as={Row} controlId="Mannon" className="mb-3">
                                <Form.Label column sm={10}>
                                    Mannon de pression
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Mannon"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Mannon"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* étiquette géolocalisation */}
                            <Form.Group as={Row} controlId="étiquette" className="mb-3">
                                <Form.Label column sm={10}>
                                    étiquette géolocalisation
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="étiquette"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="étiquette"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/* Réservoir (fissure, bouchon) */}
                            <Form.Group
                                as={Row}
                                controlId="Réservoir"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Réservoir (fissure, bouchon)
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Réservoir"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Réservoir"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Boite pharmacie */}
                            <Form.Group as={Row} controlId="pharmacie" className="mb-3">
                                <Form.Label column sm={10}>
                                    Boite pharmacie
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="pharmacie"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="pharmacie"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Pipe d'admission */}
                            <Form.Group as={Row} controlId="Pipe" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pipe d'admission
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Pipe"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Pipe"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Sangle (03), câble scellé */}
                            <Form.Group as={Row} controlId="Sangle" className="mb-3">
                                <Form.Label column sm={10}>
                                    Sangle (03), câble scellé
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Sangle"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Sangle"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>

                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step === 4 && (
                <Form className="p-3 shadow-sm">
                    <h4>Information véhicule</h4>
                    <Row>
                        <Col sm={6}>
                            {/* Pied parc */}
                            <Form.Group as={Row} controlId="Piedparc" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pied parc
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Piedparc"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Piedparc"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/*Butoir remorque */}
                            <Form.Group
                                as={Row}
                                controlId="Butoirremorque"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Butoir remorque
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Butoirremorque"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Butoirremorque"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/*Twis lock squelette */}
                            <Form.Group as={Row} controlId="Twis" className="mb-3">
                                <Form.Label column sm={10}>
                                    Twis lock squelette
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Twis"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Twis"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Bâche remorque*/}
                            <Form.Group as={Row} controlId="Bâche" className="mb-3">
                                <Form.Label column sm={10}>
                                    Bâche remorque
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Bâche"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Bâche"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/* Lattes */}
                            <Form.Group
                                as={Row}
                                controlId="Lattes"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Lattes
                                </Form.Label>
                                <Col sm={10}>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Nombre de lattes :</span></div>
                                        <div className="col-lg-6"><input type="number" name="nbr_lattes" /></div>
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Moteur cellule frigo */}
                            <Form.Group as={Row} controlId="Moteurcellule" className="mb-3">
                                <Form.Label column sm={10}>
                                    Moteur cellule frigo
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Fonctionnel"
                                            name="Moteurcellule"
                                            value="Fonctionnel"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Alerte"
                                            name="Moteurcellule"
                                            value="Alerte"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                    <Col sm={10}>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Niveau gasoile :</span></div>
                                            <div className="col-lg-6"><input type="number" name="niv_gasoile" /></div>
                                        </div>
                                    </Col>
                                </Col>
                            </Form.Group>
                            {/* Rétroviseur vitres */}
                            <Form.Group as={Row} controlId="Rétroviseur" className="mb-3">
                                <Form.Label column sm={10}>
                                    Rétroviseur vitres
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Rétroviseur"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Rétroviseur"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Pare-brise + essuie glasses */}
                            <Form.Group as={Row} controlId="Pare-brise" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pare-brise + essuie glasses
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Pare-brise"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Pare-brise"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step === 5 && (
                <Form className="p-3 shadow-sm">
                    <h4>Information véhicule</h4>
                    <Row>
                        <Col sm={6}>
                            {/* Feux + clignotants */}
                            <Form.Group as={Row} controlId="Feuxclignotants" className="mb-3">
                                <Form.Label column sm={10}>
                                    Feux + clignotants
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Feuxclignotants"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Feuxclignotants"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/*Loquet */}
                            <Form.Group
                                as={Row}
                                controlId="Loquet"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Loquet
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Loquet"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Loquet"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/*Feux de stop, clignotants, garde boue*/}
                            <Form.Group as={Row} controlId="Feuxclignotants" className="mb-3">
                                <Form.Label column sm={10}>
                                    Feux de stop, clignotants, garde boue
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Feux"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Feux"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Cataphote feux de gabarit*/}
                            <Form.Group as={Row} controlId="Cataphote" className="mb-3">
                                <Form.Label column sm={10}>
                                    Cataphote feux de gabarit
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Cataphote"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Cataphote"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Pression Pneu (Remorque) */}
                            <Form.Group as={Row} controlId="PressionPneuRemorque" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pression Pneu (Remorque)
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche avant :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuGaucheavant" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite avant :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuDroiteavant" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche arrière (int) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuGauchearrière" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite arrière (int) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuDroitearrière" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche arrière(ext) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuGauchearrière" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite arrière (ext) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuDroitearrière" /></div>
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/* Feux de stop + clignotants maraicher */}
                            <Form.Group
                                as={Row}
                                controlId="feuxS_clign_maraicher"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Feux de stop + clignotants maraicher
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="feuxS_clign_maraicher"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="feuxS_clign_maraicher"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Roue de secours et 2 cannes de sécurité */}
                            <Form.Group as={Row} controlId="secours_tracteur" className="mb-3">
                                <Form.Label column sm={10}>
                                    Roue de secours et 2 cannes de sécurité
                                </Form.Label>
                                <Form.Label column sm={10}>
                                    Tracteur
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="secours_tracteur"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="secours_tracteur"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                                <Form.Label column sm={10}>
                                    Tractée
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="secours_tractee"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="secours_tractee"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Pression Pneu (tracteur) */}
                            <Form.Group as={Row} controlId="" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pression Pneu (tracteur)
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Col sm={10}>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche 1ère issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="g_av_tr_pression" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite 1ère issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="d_av_tr_pression" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche 2ème issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="g_ar_tr_int_pression" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite 2ème issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="d_ar_tr_int_pression" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche 3ème issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="g_ar_tr_ext_pression" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite 3ème issue :</span></div>
                                        <div className="col-lg-6"><input type="number" name="d_ar_tr_ext_pression" /></div>
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step === 6 && (
                <Form className="p-3 shadow-sm">
                    <h4>Confirmation !</h4>
                    <Row>
                        <Col sm={6}>
                            {/* Propreté (tracteur + remorque) */}
                            <Form.Group as={Row} controlId="proprete_int" className="mb-3">
                                <Form.Label column sm={10}>
                                    Propreté (tracteur + remorque)
                                </Form.Label>
                                <img className="check_item_img" src="../assets/images/checklist/1MZL5_AS01.jpg" alt="" />
                                <Form.Label column sm={10}>
                                    intérieur
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="proprete_int"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="proprete_int"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                                <Form.Label column sm={10}>
                                    Extérieur
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="proprete_ext"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="proprete_ext"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/*Maintenence */}
                            <Form.Group
                                as={Row}
                                controlId="maintenance"
                                className="mb-3"
                            >
                                <Form.Label column sm={10}>
                                    Maintenence ?
                                </Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Oui"
                                            name="maintenance"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non"
                                            name="maintenance"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={nextStep}>
                            Suivant
                        </Button>
                    </div>
                </Form>
            )}
            {step > 6 && (
                <div>
                    <h5>Vérification terminée</h5>
                    <p>Merci d'avoir complété la vérification.</p>
                    <Button variant="primary" className="mr-2" onClick={() => setStep(1)}>
                        Recommencer
                    </Button>
                    <Button variant="danger" onClick={goToVehicleChecks}>
                        Quitter
                    </Button>
                </div>
            )}
        </Container>
    );
}
