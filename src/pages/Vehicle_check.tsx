import React, { useState } from "react";
import { Container, Row, Col, Form, Button, ProgressBar, Card, }
    from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";


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
                            <Card className="mb-3">
                                <Card.Header>Marche pied</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/1MZL5_AS01.jpg'} alt="Marche pied" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="marchePiedDroite" className="mb-3">
                                        <Form.Label column sm={10}>Droite</Form.Label>
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Droite" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Droite" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="marchePiedGauche" className="mb-3">
                                        <Form.Label column sm={10}>Gauche</Form.Label>
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Gauche" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Gauche" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Batterie</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/2720003_3quart_900px_1.jpg'} alt="Batterie" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="batterie" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Batterie" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Batterie" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pneu (tracteur)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pneumatique_tracteur.jpg'} alt="Pneu (tracteur)" style={{ width: '100%', height: 'auto' }} />
                                    {['g_av_tr', 'd_av_tr', 'g_ar_tr_int', 'd_ar_tr_int', 'g_ar_tr_ext', 'd_ar_tr_ext'].map(position => (
                                        <Form.Group as={Row} key={position} className="mb-2">
                                            <Form.Label column sm={10}>
                                                {position.replace('_', ' ').toUpperCase()} :
                                            </Form.Label>
                                            <Col sm={10}>
                                                <div>
                                                    <Form.Check type="checkbox" label="Conforme" name="Pneutracteur" value="Conforme" inline className="mr-4" />
                                                    <Form.Check type="checkbox" label="Non Conforme" name="Pneutracteur" value="Non Conforme" inline className="ml-4" />
                                                </div>
                                            </Col>
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Triangles/cales</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/triangle.jpg'} alt="Triangles/cales" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Triangles" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Triangles" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Triangles" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Extincteur (date d'expiration)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/extincteur.png'} alt="Extincteur (date d'expiration)" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="extincteurDate" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Control type="date" name="extincteur_date" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pneu (Remorque)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pneu_remorque.jpg'} alt="Pneu (Remorque)" style={{ width: '100%', height: 'auto' }} />
                                    {['g_issue1_rm', 'd_issue1_rm', 'g_issue2_rm', 'd_issue2_rm', 'g_issue3_rm', 'd_issue3_rm'].map(position => (
                                        <Form.Group as={Row} key={position} className="mb-2">
                                            <Form.Label column lg={6}>
                                                {position.replace('_', ' ').toUpperCase()} :
                                            </Form.Label>
                                            <Col sm={10}>
                                                <div>
                                                    <Form.Check type="checkbox" label="Conforme" name="PneuRemorque" value="Conforme" inline className="mr-4" />
                                                    <Form.Check type="checkbox" label="Non Conforme" name="PneuRemorque" value="Non Conforme" inline className="ml-4" />
                                                </div>
                                            </Col>
                                        </Form.Group>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button variant="danger" className="mr-2" onClick={prevStep}>
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
                            <Card className="mb-3">
                                <Card.Header>Crique</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/crique.jpg'} alt="Crique" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Crique" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Crique" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Crique" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Trousse outils</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/trousse_outils.jpg'} alt="Trousse outils" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Trousse" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Trousse" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Trousse" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Mannon de pression</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/manon.jpg'} alt="Mannon de pression" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Mannon" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Mannon" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Mannon" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>étiquette géolocalisation</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/1MZL5_AS01.jpg'} alt="étiquette géolocalisation" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="étiquette" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="étiquette" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="étiquette" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Réservoir (fissure, bouchon)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/reservoir.jpg'} alt="Réservoir (fissure, bouchon)" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Réservoir" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Réservoir" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Réservoir" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Boite pharmacie</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/boite_pharmacie.jpg'} alt="Boite pharmacie" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="pharmacie" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="pharmacie" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="pharmacie" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pipe d'admission</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pipe_admission.jpg'} alt="Pipe d'admission" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Pipe" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Pipe" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Pipe" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Sangle (03), câble scellé</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/sangle.png'} alt="Sangle (03), câble scellé" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Sangle" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Sangle" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Sangle" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button variant="danger" className="mr-2" onClick={prevStep}>
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
                            <Card className="mb-3">
                                <Card.Header>Pied parc</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pied_parc.jpg'} alt="Pied parc" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Piedparc" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Piedparc" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Piedparc" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Butoir remorque</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/buttoir.png'} alt="Butoir remorque" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Butoirremorque" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Butoirremorque" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Butoirremorque" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Twis lock squelette</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/twis_lock.jpg'} alt="Twis lock squelette" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Twis" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Twis" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Twis" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Bâche remorque</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/bache_remorque.jpg'} alt="Bâche remorque" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Bâche" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Bâche" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Bâche" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Lattes</Card.Header>
                                <Card.Body>
                                    <Form.Group as={Row} controlId="Lattes" className="mb-3">
                                        <Col sm={10}>
                                            <div className="d-flex">
                                                <div className="flex-grow-1"><span>Nombre de lattes :</span></div>
                                                <div><input type="number" name="nbr_lattes" /></div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Moteur cellule frigo</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/moteur_cellule_frigo.jpg'} alt="Moteur cellule frigo" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Moteurcellule" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Fonctionnel" name="Moteurcellule" value="Fonctionnel" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Alerte" name="Moteurcellule" value="Alerte" inline className="ml-4" />
                                        </Col>
                                        <Col sm={10}>
                                            <div className="d-flex">
                                                <div className="flex-grow-1"><span>Niveau gasoil :</span></div>
                                                <div><input type="number" name="niv_gasoile" /></div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Rétroviseur vitres</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/retroviseur.jpg'} alt="Rétroviseur vitres" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Rétroviseur" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Rétroviseur" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Rétroviseur" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pare-brise + essuie-glaces</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/retroviseur.jpg'} alt="Pare-brise + essuie-glaces" style={{ width: '100%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Pare-brise" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" name="Pare-brise" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" name="Pare-brise" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center">
                        <Button variant="danger" className="mr-2" onClick={prevStep}>
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
                                <img className="check_item_img" src={'../asset/images/checklist/feux_clignotant.jpg'} alt="" />
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
                            {/* Feux de stop, clignotants, garde boue */}
                            <Form.Group as={Row} controlId="Feuxstop" className="mb-3">
                                <Form.Label column sm={10}>
                                    Feux de stop, clignotants, garde boue
                                </Form.Label>
                                <img className="check_item_img" src={'../asset/images/checklist/garde_bouet.jpg'} alt="" />
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Feuxstop"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Feuxstop"
                                            value="Non Conforme"
                                            inline
                                            className="ml-4"
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                            {/* Cataphote feux de gabarit */}
                            <Form.Group as={Row} controlId="Cataphote" className="mb-3">
                                <Form.Label column sm={10}>
                                    Cataphote feux de gabarit
                                </Form.Label>
                                <img className="check_item_img" src={'../asset/images/checklist/cataphote.jpg'} alt="" />
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
                                <img className="check_item_img" src={'../asset/images/checklist/pneu_remorque.jpg'} alt="" />
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
                                        <div className="col-lg-6"><input type="number" name="PneuGauchearrièreInt" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite arrière (int) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuDroitearrièreInt" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Gauche arrière (ext) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuGauchearrièreExt" /></div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="col-lg-6"><span>Droite arrière (ext) :</span></div>
                                        <div className="col-lg-6"><input type="number" name="PneuDroitearrièreExt" /></div>
                                    </div>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            {/* Loquet */}
                            <Form.Group as={Row} controlId="Loquet" className="mb-3">
                                <Form.Label column sm={10}>
                                    Loquet
                                </Form.Label>
                                <img className="check_item_img" src={'../asset/images/checklist/loquet.jpg'} alt="" />
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
                            {/* Feux de stop + clignotants maraicher */}
                            <Form.Group as={Row} controlId="feuxS_clign_maraicher" className="mb-3">
                                <Form.Label column sm={10}>
                                    Feux de stop + clignotants maraicher
                                </Form.Label>
                                <img className="check_item_img" src={'../asset/images/checklist/feux_stop_maricher.jpg'} alt="" />
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
                                <img className="check_item_img" src={'../asset/images/checklist/roue_de_secours.jpg'} alt="" />
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
                            <Form.Group as={Row} controlId="PressionPneuTracteur" className="mb-3">
                                <Form.Label column sm={10}>
                                    Pression Pneu (tracteur)
                                </Form.Label>
                                <img className="check_item_img" src={'../asset/images/checklist/pneumatique_tracteur.jpg'} alt="" />
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
                                <img className="check_item_img" src={'../asset/images/checklist/4434898_5 mercedes Axor.jpg'} alt="" />
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
                                <img className="check_item_img" src={'../asset/images/checklist/4434898_5 mercedes Axor.jpg'} alt="" />
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
