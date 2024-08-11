import React, { useCallback, useEffect, useState } from "react";
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
    truck_step_right: string;
    truck_step_left: string;
    battery: string;
    g_av_tr: string;
    d_av_tr: string;
    g_ar_tr_int: string;
    d_ar_tr_int: string;
    g_ar_tr_ext: string;
    d_ar_tr_ext: string;
    Triangles: string;
    extincteur_date: string;
    g_issue1_rm: string;
    d_issue1_rm: string;
    g_issue2_rm: string;
    d_issue2_rm: string;
    g_issue3_rm: string;
    d_issue3_rm: string;
    Crique: string;
    Trousse: string;
    Mannon: string;
    étiquette: string;
    Réservoir: string;
    pharmacie: string;
    Pipe: string;
    Sangle: string;
    Piedparc: string;
    Butoirremorque: string;
    Twis: string;
    Bâche: string;
    nbr_lattes: number;
    Moteurcellule: string;
    niv_gasoile: number;
    Rétroviseur: string;
    Parebrise: string;
    Feuxclignotants: string;
    Feuxstop: string;
    Cataphote: string;
    PneuGaucheavant_rem: number;
    PneuDroiteavant_rem: number;
    PneuGauchearrièreInt_rem: number;
    PneuDroitearrièreInt_rem: number;
    PneuGauchearrièreExt_rem: number;
    PneuDroitearrièreExt_rem: number;
    Loquet: string;
    feuxS_clign_maraicher: string;
    secours_tracteur: string;
    secours_tractee: string;
    g_av_tr_pression: number;
    d_av_tr_pression: number;
    g_ar_tr_int_pression: number;
    d_ar_tr_int_pression: number;
    g_ar_tr_ext_pression: number;
    d_ar_tr_ext_pression: number;
    proprete_int: string;
    proprete_ext: string;
    maintenance: string;
    commentaire: string;
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
        truck_step_right: "",
        truck_step_left: "",
        battery: "",
        g_av_tr: "",
        d_av_tr: "",
        g_ar_tr_int: "",
        d_ar_tr_int: "",
        g_ar_tr_ext: "",
        d_ar_tr_ext: "",
        Triangles: '',
        extincteur_date: '',
        g_issue1_rm: "",
        d_issue1_rm: "",
        g_issue2_rm: "",
        d_issue2_rm: "",
        g_issue3_rm: "",
        d_issue3_rm: "",
        Crique: '',
        Trousse: '',
        Mannon: '',
        étiquette: '',
        Réservoir: '',
        pharmacie: '',
        Pipe: '',
        Sangle: '',
        Piedparc: '',
        Butoirremorque: '',
        Twis: '',
        Bâche: '',
        nbr_lattes: 0,
        Moteurcellule: '',
        niv_gasoile: 0,
        Rétroviseur: '',
        Parebrise: '',
        Feuxclignotants: '',
        Feuxstop: '',
        Cataphote: '',
        PneuGaucheavant_rem: 0,
        PneuDroiteavant_rem: 0,
        PneuGauchearrièreInt_rem: 0,
        PneuDroitearrièreInt_rem: 0,
        PneuGauchearrièreExt_rem: 0,
        PneuDroitearrièreExt_rem: 0,
        Loquet: '',
        feuxS_clign_maraicher: '',
        secours_tracteur: '',
        secours_tractee: '',
        g_av_tr_pression: 0,
        d_av_tr_pression: 0,
        g_ar_tr_int_pression: 0,
        d_ar_tr_int_pression: 0,
        g_ar_tr_ext_pression: 0,
        d_ar_tr_ext_pression: 0,
        proprete_int: '',
        proprete_ext: '',
        maintenance: '',
        commentaire: '',
    });
    const [formValidation, setFormValidation] = useState(initialValidationState);
    const navigate = useNavigate();
    const [tractorMatricules, setTractorMatricules] = useState<string[]>([]);
    const [trailerMatricules, setTrailerMatricules] = useState<string[]>([]);


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

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const nextStep = () => {
        if (validateForm()) {
            setStep(step + 1);
        } else {
            toast.error("Veuillez remplir tous les champs obligatoires. ", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };
    const handleNext = () => {
        // Rediriger vers le haut de la fenêtre
        window.scrollTo(0, 0);
        // Appeler la fonction nextStep pour avancer au prochain étape
        nextStep();
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const goToVehicleChecks = () => {
        navigate("/vehicles_checks"); // Naviguer vers la page Vehicle_checks
    };

    const convertValue = (value: any) => {
        if (!value) {
            return 0;
        } else if (value === "Conforme" || value === "Oui" || value === "Fonctionnel") {
            return 1;
        } else if (value === "Non Conforme" || value === "Non" || value === "Alerte") {
            return 2;
        } else {
            return value;
        }
    };


    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                // Convertir les valeurs avant l'envoi
                const convertedFormData: { [key: string]: any } = { ...formData };
                for (let key in convertedFormData) {
                    convertedFormData[key] = convertValue(convertedFormData[key]);
                }

                const response = await fetch(`${backendUrl}/api/geop/addvehiclecheck`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(convertedFormData),
                });

                if (response.ok) {
                    toast.success("Vérification ajoutée avec succès.", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                    navigate("/vehicles_checks");
                } else {
                    throw new Error("Erreur lors de l'ajout de la vérification.");
                }
            } catch (error) {
                console.log('erreure', error);
                toast.error("Erreur lors de l'ajout de la vérification.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } else {
            toast.error("Veuillez remplir tous les champs obligatoires.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const getMatricules = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/geop/vehiclecheck/matricule/${1}`, { mode: "cors" });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    };

    useEffect(() => {
        const fetchMatricules = async () => {
            const tractorData = await getMatricules();
            const trailerData = await getMatricules();

            if (tractorData && Array.isArray(tractorData)) {
                const tractorImmatriculations = tractorData.map((item: { immatriculation_vehicule: string }) => item.immatriculation_vehicule);
                setTractorMatricules(tractorImmatriculations);
            }

            if (trailerData && Array.isArray(trailerData)) {
                const trailerImmatriculations = trailerData.map((item: { immatriculation_vehicule: string }) => item.immatriculation_vehicule);
                setTrailerMatricules(trailerImmatriculations);
            }
        };
        fetchMatricules();
    }, []);

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
                            </Form.Group >
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label>Matricule Tracteur</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        as="select"
                                        name="matriculetrac"
                                        value={formData.matriculetrac}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner un matricule</option>
                                        {tractorMatricules.map((matricule, index) => (
                                            <option key={index} value={matricule}>
                                                {matricule}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formKm" className="mb-3">
                                <Form.Label column sm={10}>
                                    Km
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="number"
                                        name="km"
                                        value={formData.km}
                                        onChange={handleChange}
                                        placeholder="Entrez le nombre de kilomètres"
                                        min="0"
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

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label>Matricule Remorque</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        as="select"
                                        name="matriculerem"
                                        value={formData.matriculerem}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner un matricule</option>
                                        {trailerMatricules.map((matricule, index) => (
                                            <option key={index} value={matricule}>
                                                {matricule}
                                            </option>
                                        ))}
                                    </Form.Control>
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
                                    <img className="check_item_img" src={'../asset/images/checklist/1MZL5_AS01.jpg'} alt="Marche pied" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="marchePiedDroite" className="mb-3">
                                        <Form.Label column sm={10}>Droite</Form.Label>
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.truck_step_right === "Conforme"} onChange={handleChange} name="truck_step_right" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.truck_step_right === "Non Conforme"} onChange={handleChange} name="truck_step_right" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="marchePiedGauche" className="mb-3">
                                        <Form.Label column sm={10}>Gauche</Form.Label>
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.truck_step_left === "Conforme"} onChange={handleChange} name="truck_step_left" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.truck_step_left === "Non Conforme"} onChange={handleChange} name="truck_step_left" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Batterie</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/2720003_3quart_900px_1.jpg'} alt="Batterie" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="batterie" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.battery === "Conforme"} onChange={handleChange} name="battery" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.battery === "Non Conforme"} onChange={handleChange} name="battery" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pneu (tracteur)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pneumatique_tracteur.jpg'} alt="Pneu (tracteur)" style={{ width: '50%', height: 'auto' }} />
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
                                                        name={position}
                                                        value="Conforme"
                                                        checked={formData[position as keyof FormData] === 'Conforme'}
                                                        onChange={handleChange}
                                                        inline
                                                        className="mr-4"
                                                    />
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Non Conforme"
                                                        name={position}
                                                        value="Non Conforme"
                                                        checked={formData[position as keyof FormData] === 'Non Conforme'}
                                                        onChange={handleChange}
                                                        inline
                                                        className="ml-4"
                                                    />
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
                                    <img className="check_item_img" src={'../asset/images/checklist/triangle.jpg'} alt="Triangles/cales" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Triangles" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Triangles === "Conforme"} onChange={handleChange} name="Triangles" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Triangles === "Non Conforme"} onChange={handleChange} name="Triangles" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Extincteur (date d'expiration)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/extincteur.png'} alt="Extincteur (date d'expiration)" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="extincteurDate" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Control type="date" name="extincteur_date" value={formData.extincteur_date || ""} onChange={handleChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pneu (Remorque)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pneu_remorque.jpg'} alt="Pneu (Remorque)" style={{ width: '50%', height: 'auto' }} />
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
                                                        name={position}
                                                        value="Conforme"
                                                        checked={formData[position as keyof FormData] === 'Conforme'}
                                                        onChange={handleChange}
                                                        inline
                                                        className="mr-4"
                                                    />
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Non Conforme"
                                                        name={position}
                                                        value="Non Conforme"
                                                        checked={formData[position as keyof FormData] === 'Non Conforme'}
                                                        onChange={handleChange}
                                                        inline
                                                        className="ml-4"
                                                    />
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
                        <Button variant="primary" onClick={handleNext}>
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
                                    <img className="check_item_img" src={'../asset/images/checklist/crique.jpg'} alt="Crique" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Crique" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Crique === "Conforme"} onChange={handleChange} name="Crique" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Crique === "Non Conforme"} onChange={handleChange} name="Crique" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Trousse outils</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/outils.jpg'} alt="Trousse outils" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Trousse" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Trousse === "Conforme"} onChange={handleChange} name="Trousse" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Trousse === "Non Conforme"} onChange={handleChange} name="Trousse" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Mannon de pression</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/manon.jpg'} alt="Mannon de pression" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Mannon" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Mannon === "Conforme"} onChange={handleChange} name="Mannon" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Mannon === "Non Conforme"} onChange={handleChange} name="Mannon" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>étiquette géolocalisation</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/1MZL5_AS01.jpg'} alt="étiquette géolocalisation" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="étiquette" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.étiquette === "Conforme"} onChange={handleChange} name="étiquette" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.étiquette === "Non Conforme"} onChange={handleChange} name="étiquette" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Réservoir (fissure, bouchon)</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/reservoir.jpg'} alt="Réservoir (fissure, bouchon)" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Réservoir" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Réservoir === "Conforme"} onChange={handleChange} name="Réservoir" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Réservoir === "Non Conforme"} onChange={handleChange} name="Réservoir" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Boite pharmacie</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/boite_pharmacie.jpg'} alt="Boite pharmacie" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="pharmacie" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.pharmacie === "Conforme"} onChange={handleChange} name="pharmacie" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.pharmacie === "Non Conforme"} onChange={handleChange} name="pharmacie" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pipe d'admission</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/pipe_admission.jpg'} alt="Pipe d'admission" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Pipe" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Pipe === "Conforme"} onChange={handleChange} name="Pipe" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Pipe === "Non Conforme"} onChange={handleChange} name="Pipe" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Sangle (03), câble scellé</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/sangle.png'} alt="Sangle (03), câble scellé" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Sangle" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Sangle === "Conforme"} onChange={handleChange} name="Sangle" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Sangle === "Non Conforme"} onChange={handleChange} name="Sangle" value="Non Conforme" inline className="ml-4" />
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
                        <Button variant="primary" onClick={handleNext}>
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
                                    <img className="check_item_img" src={'../asset/images/checklist/pied_parc.jpg'} alt="Pied parc" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Piedparc" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Piedparc === "Conforme"} onChange={handleChange} name="Piedparc" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Piedparc === "Non Conforme"} onChange={handleChange} name="Piedparc" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Butoir remorque</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/buttoir.png'} alt="Butoir remorque" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Butoirremorque" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Butoirremorque === "Conforme"} onChange={handleChange} name="Butoirremorque" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Butoirremorque === "Non Conforme"} onChange={handleChange} name="Butoirremorque" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Twis lock squelette</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/twis_lock.jpg'} alt="Twis lock squelette" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Twis" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Twis === "Conforme"} onChange={handleChange} name="Twis" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Twis === "Non Conforme"} onChange={handleChange} name="Twis" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Bâche remorque</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/bache_remorque.jpg'} alt="Bâche remorque" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Bâche" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Bâche === "Conforme"} onChange={handleChange} name="Bâche" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Bâche === "Non Conforme"} onChange={handleChange} name="Bâche" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Lattes</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/4434898_5 mercedes Axor.jpg'} alt="latte" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Lattes" className="mb-3">
                                        <Col sm={10}>
                                            <div className="d-flex">
                                                <div className="flex-grow-1"><span>Nombre de lattes :</span></div>
                                                <div><input type="number" name="nbr_lattes" value={formData.nbr_lattes} onChange={handleChange}
                                                /></div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Moteur cellule frigo</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/moteur_cellule_frigo.jpg'} alt="Moteur cellule frigo" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Moteurcellule" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Fonctionnel" checked={formData.Moteurcellule === "Fonctionnel"} onChange={handleChange} name="Moteurcellule" value="Fonctionnel" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Alerte" checked={formData.Moteurcellule === "Alerte"} onChange={handleChange} name="Moteurcellule" value="Alerte" inline className="ml-4" />
                                        </Col>
                                        <Col sm={10}>
                                            <div className="d-flex">
                                                <div className="flex-grow-1"><span>Niveau gasoil :</span></div>
                                                <div><input type="number" name="niv_gasoile" value={formData.niv_gasoile} onChange={handleChange}
                                                /></div>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Rétroviseur vitres</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/retroviseur.jpg'} alt="Rétroviseur vitres" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Rétroviseur" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Rétroviseur === "Conforme"} onChange={handleChange} name="Rétroviseur" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Rétroviseur === "Non Conforme"} onChange={handleChange} name="Rétroviseur" value="Non Conforme" inline className="ml-4" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pare-brise + essuie-glaces</Card.Header>
                                <Card.Body>
                                    <img className="check_item_img" src={'../asset/images/checklist/retroviseur.jpg'} alt="Pare-brise + essuie-glaces" style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group as={Row} controlId="Parebrise" className="mb-3">
                                        <Col sm={10}>
                                            <Form.Check type="checkbox" label="Conforme" checked={formData.Parebrise === "Conforme"} onChange={handleChange} name="Parebrise" value="Conforme" inline className="mr-4" />
                                            <Form.Check type="checkbox" label="Non Conforme" checked={formData.Parebrise === "Non Conforme"} onChange={handleChange} name="Parebrise" value="Non Conforme" inline className="ml-4" />
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
                        <Button variant="primary" onClick={handleNext}>
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
                            <Card className="mb-3">
                                <Card.Header>Feux + clignotants</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/feux_clignotant.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="Feuxclignotants" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Feuxclignotants"
                                            value="Conforme"
                                            checked={formData.Feuxclignotants === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Feuxclignotants"
                                            value="Non Conforme"
                                            checked={formData.Feuxclignotants === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Feux de stop, clignotants, garde boue</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/garde_bouet.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="Feuxstop" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Feuxstop"
                                            value="Conforme"
                                            checked={formData.Feuxstop === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Feuxstop"
                                            value="Non Conforme"
                                            checked={formData.Feuxstop === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Cataphote feux de gabarit</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/cataphote.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="Cataphote" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Cataphote"
                                            value="Conforme"
                                            checked={formData.Cataphote === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Cataphote"
                                            value="Non Conforme"
                                            checked={formData.Cataphote === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pression Pneu (Remorque)</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/pneu_remorque.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="PressionPneuRemorque" className="mb-3">
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche avant :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuGaucheavant_rem" value={formData.PneuGaucheavant_rem} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite avant :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuDroiteavant_rem" value={formData.PneuDroiteavant_rem} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche arrière (int) :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuGauchearrièreInt_rem" value={formData.PneuGauchearrièreInt_rem} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite arrière (int) :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuDroitearrièreInt_rem" value={formData.PneuDroitearrièreInt_rem} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche arrière (ext) :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuGauchearrièreExt_rem" value={formData.PneuGauchearrièreExt_rem} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite arrière (ext) :</span></div>
                                            <div className="col-lg-6"><input type="number" name="PneuDroitearrièreExt_rem" value={formData.PneuDroitearrièreExt_rem} onChange={handleChange} /></div>
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Loquet</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/loquet.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="Loquet" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="Loquet"
                                            value="Conforme"
                                            checked={formData.Loquet === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="Loquet"
                                            value="Non Conforme"
                                            checked={formData.Loquet === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Feux de stop + clignotants maraicher</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/feux_stop_maricher.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="feuxS_clign_maraicher" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="feuxS_clign_maraicher"
                                            value="Conforme"
                                            checked={formData.feuxS_clign_maraicher === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="feuxS_clign_maraicher"
                                            value="Non Conforme"
                                            checked={formData.feuxS_clign_maraicher === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Roue de secours et 2 cannes de sécurité</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/roue_de_secours.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Card.Title>Tracteur</Card.Title>
                                    <Form.Group controlId="secours_tracteur" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="secours_tracteur"
                                            value="Conforme"
                                            checked={formData.secours_tracteur === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="secours_tracteur"
                                            value="Non Conforme"
                                            checked={formData.secours_tracteur === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                    <Card.Title>Tractée</Card.Title>
                                    <Form.Group controlId="secours_tractee" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="secours_tractee"
                                            value="Conforme"
                                            checked={formData.secours_tractee === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="secours_tractee"
                                            value="Non Conforme"
                                            checked={formData.secours_tractee === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header>Pression Pneu (tracteur)</Card.Header>
                                <Card.Body>
                                    <Card.Img variant="top" src={'../asset/images/checklist/pneumatique_tracteur.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="PressionPneuTracteur" className="mb-3">
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche 1ère issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="g_av_tr_pression" value={formData.g_av_tr_pression} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite 1ère issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="d_av_tr_pression" value={formData.d_av_tr_pression} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche 2ème issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="g_ar_tr_int_pression" value={formData.g_ar_tr_int_pression} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite 2ème issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="d_ar_tr_int_pression" value={formData.d_ar_tr_int_pression} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Gauche 3ème issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="g_ar_tr_ext_pression" value={formData.g_ar_tr_ext_pression} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="col-lg-6"><span>Droite 3ème issue :</span></div>
                                            <div className="col-lg-6"><input type="number" name="d_ar_tr_ext_pression" value={formData.d_ar_tr_ext_pression} onChange={handleChange} /></div>
                                        </div>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
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
                        <Button variant="primary" onClick={handleNext}>
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
                            <Card className="mb-3">
                                <Card.Header>Propreté (tracteur + remorque)</Card.Header>
                                <Card.Body>
                                    <Card.Title>Intérieur</Card.Title>
                                    <Card.Img variant="top" src={'../asset/images/checklist/4434898_5 mercedes Axor.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="proprete_int" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="proprete_int"
                                            value="Conforme"
                                            checked={formData.proprete_int === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="proprete_int"
                                            value="Non Conforme"
                                            checked={formData.proprete_int === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                    <Card.Title>Extérieur</Card.Title>
                                    <Form.Group controlId="proprete_ext" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            name="proprete_ext"
                                            value="Conforme"
                                            checked={formData.proprete_ext === "Conforme"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            name="proprete_ext"
                                            value="Non Conforme"
                                            checked={formData.proprete_ext === "Non Conforme"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card className="mb-3">
                                <Card.Header>Maintenance</Card.Header>
                                <Card.Body>
                                    <Card.Title>Maintenance ?</Card.Title>
                                    <Card.Img variant="top" src={'../asset/images/checklist/4434898_5 mercedes Axor.jpg'} style={{ width: '50%', height: 'auto' }} />
                                    <Form.Group controlId="maintenance" className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Oui"
                                            name="maintenance"
                                            value="Oui"
                                            checked={formData.maintenance === "oui"} onChange={handleChange}
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non"
                                            name="maintenance"
                                            value="Non"
                                            checked={formData.maintenance === "Non"} onChange={handleChange}
                                            inline
                                            className="ml-4"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Form.Group controlId="commentaire" className="mt-3">
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="commentaire"
                            value={formData.commentaire || ''}
                            onChange={handleChange}
                            placeholder="Entrez vos commentaires ici..."
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="mr-2"
                            onClick={prevStep}
                        >
                            Précédent
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Enregistré
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
}
