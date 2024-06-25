import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";



import img1 from '../assets/images/small/img-1.jpg';


type ImageData = {
    title: string;
    image: string | null;
    status: string;
};

type StepData = {
    [key: string]: ImageData[];
};


const initialImageData: StepData = {
    step2: [
        { title: 'Marche pied', image: img1, status: '' },
        { title: 'Triangles/cales', image: img1, status: '' },
        { title: 'Batterie', image: img1, status: '' },
        { title: 'Extincteur date dexpiration ', image: img1, status: '' },
        { title: 'Pneu tracteur', image: img1, status: '' },
        { title: 'Pneu Remorque', image: img1, status: '' },
    ],
    step3: [
        { title: 'Crique', image: img1, status: '' },
        { title: 'Trousse outils', image: img1, status: '' },
        { title: 'Mannon de pression', image: img1, status: '' },
        { title: 'Réservoir(fissure, bouchon)', image: img1, status: '' },
        { title: 'Boite pharmacie', image: img1, status: '' },
        { title: 'Pipe dadmission', image: img1, status: '' },
    ],
    step4: [
        { title: 'Sangle (03), câble scellé', image: img1, status: '' },
        { title: 'étiquette géolocalisation', image: img1, status: '' },
        { title: 'Pied parc', image: img1, status: '' },
        { title: 'Butoir remorque', image: img1, status: '' },
        { title: 'Twis lock squelette', image: img1, status: '' },
        { title: 'Bâche remorque', image: img1, status: '' },
    ],
    step5: [
        { title: 'Lattes', image: img1, status: '' },
        { title: 'Moteur cellule frigo', image: img1, status: '' },
        { title: 'Rétroviseur vitres', image: img1, status: '' },
        { title: 'Pare-brise + essuie glasses', image: img1, status: '' },
        { title: 'Feux + clignotants', image: img1, status: '' },
        { title: 'Loquet', image: img1, status: '' },
    ],
    step6: [
        { title: 'Feux de stop, clignotants, garde boue', image: img1, status: '' },
        { title: 'Cataphote feux de gabarit', image: img1, status: '' },
        { title: 'Feux de stop + clignotants maraicher', image: img1, status: '' },
        { title: 'Roue de secours et 2 cannes de sécurité', image: img1, status: '' },
        { title: 'Pression Pneu (tracteur)', image: img1, status: '' },
        { title: 'Pression Pneu (Remorque)', image: img1, status: '' },
    ],
    step7: [
        { title: 'Propreté (tracteur + remorque)', image: img1, status: '' },
        { title: 'Maintenence ?', image: img1, status: '' },

    ],
};

type FormData = {
    checker: string;
    date: string;
    incomingDriver: string;
    matriculetrac: string;
    km: string;
    outgoingDriver: string;
    matriculerem: string;
    operating_hours: string;
    papierStatus: string; // Ajouté pour gérer l'état des papiers
};

// Définition des règles de validation par champ
const initialValidationState = {
    checker: false,
    date: false,
    incomingDriver: true, // Ce champ n'est pas obligatoire selon votre description
    matriculetrac: false,
    km: false,
    outgoingDriver: true, // Ce champ n'est pas obligatoire selon votre description
    matriculerem: false,
    operating_hours: false,
    papierStatus: false,
};

export function Vehiclecheck() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        checker: '',
        date: '',
        incomingDriver: '',
        matriculetrac: '',
        km: '',
        outgoingDriver: '',
        matriculerem: '',
        operating_hours: '',
        papierStatus: '', // Ajouté pour gérer l'état des papiers
    });
    const [formValidation, setFormValidation] = useState(initialValidationState); // État de validation du formulaire
    const navigate = useNavigate();

    const validateForm = () => {
        const { checker, date, matriculetrac, km, matriculerem, operating_hours, papierStatus } = formData;
        const isValid = checker !== '' && date !== '' && matriculetrac !== '' && km !== '' && matriculerem !== '' && operating_hours !== '' && papierStatus !== '';
        setFormValidation({
            ...formValidation,
            checker: checker !== '',
            date: date !== '',
            matriculetrac: matriculetrac !== '',
            km: km !== '',
            matriculerem: matriculerem !== '',
            operating_hours: operating_hours !== '',
            papierStatus: papierStatus !== '',
        });
        return isValid;
    };


    const [imageData, setImageData] = useState<StepData>(initialImageData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleStatusChange = (status: string, stepNumber: number, index: number) => {
        const newImageData = { ...imageData };
        if (newImageData[`step${stepNumber}`][index].status === status) {
            newImageData[`step${stepNumber}`][index].status = '';
        } else {
            newImageData[`step${stepNumber}`][index].status = status;
        }
        setImageData(newImageData);
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

    const prevStep = () => {
        setStep(step - 1);
    };

    const goToVehicleChecks = () => {
        navigate('/vehicles_checks'); // Naviguer vers la page Vehicle_checks
    };

    const handleSubmit = async () => {
        // // Extraire les statuts de imageData avec leur titre correspondant
        // const statuses: { title: string, status: string }[] = [];
        // Object.keys(imageData).forEach(step => {
        //     imageData[step].forEach(item => {
        //         if (item.status) {
        //             statuses.push({ title: item.title, status: item.status });
        //         }
        //     });
        // });


        // Convertir le papierStatus en entier
        let paperStatusInt;
        if (formData.papierStatus === 'Conforme') {
            paperStatusInt = 1;
        } else if (formData.papierStatus === 'Non Conforme') {
            paperStatusInt = 2;
        }

        // Créer un nouvel objet data sans le champ papierStatus
        const {
            checker,
            date,
            incomingDriver,
            matriculetrac,
            km,
            outgoingDriver,
            matriculerem,
            operating_hours
        } = formData;

        const data = {
            checker: checker,
            date,
            incomingDriver,
            matriculetrac,
            km,
            outgoingDriver,
            matriculerem,
            operating_hours: operating_hours,
            papers: paperStatusInt,
            //status: statuses
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/addvehiclecheck`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Données envoyées avec succès!", {
                    position: "bottom-right",
                    autoClose: 2400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setStep(1); // Réinitialiser le formulaire ou naviguer ailleurs
            } else {
                const errorData = await response.json();

                console.error("Erreur lors de l'envoi des données.", errorData);
                toast.error("Erreur lors de l'envoi des données.", {
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
        } catch (err) {
            console.error("Erreur lors de la requête:", err);
            toast.error("Erreur lors de la requête:", {
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



    return (
        <Container>
            <h3 className="text-center mb-4">Vérification véhicule</h3>
            <ProgressBar now={(step / 7) * 100} label={`Étape ${step}`} className="mb-4" />
            {step === 1 && (

                <Form className="p-3 shadow-sm">
                    <h4>Informations générales</h4>
                    <Row>
                        <Col sm={6}>
                            <Form.Group as={Row} controlId="formVerifier" className="mb-3">
                                <Form.Label column sm={10}>Vérifié par*</Form.Label>
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

                            <Form.Group as={Row} controlId="formIncomingDriver" className="mb-3">
                                <Form.Label column sm={10}>Chauffeur entrant</Form.Label>
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

                            <Form.Group as={Row} controlId="formmatriculetrac" className="mb-3">
                                <Form.Label column sm={10}>Immatriculation tracteur</Form.Label>
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
                                <Form.Label column sm={10}>Km</Form.Label>
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
                                <Form.Label column sm={10}>Papiers *</Form.Label>
                                <Col sm={10}>
                                    <div>
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            checked={formData.papierStatus === 'Conforme'}
                                            onChange={handleChange}
                                            name="papierStatus"
                                            value="Conforme"
                                            inline
                                            className="mr-4"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            checked={formData.papierStatus === 'Non Conforme'}
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
                                <Form.Label column sm={10}>Date*</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formOutgoingDriver" className="mb-3">
                                <Form.Label column sm={10}>Chauffeur sortant</Form.Label>
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

                            <Form.Group as={Row} controlId="formmatriculerem" className="mb-3">
                                <Form.Label column sm={10}>Immatriculation remorque</Form.Label>
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
                                <Form.Label column sm={10}>Heure de fonctionnement</Form.Label>
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
                        <Button variant="danger" className="mr-2" onClick={goToVehicleChecks}>Quitter</Button>
                        <Button variant="primary" onClick={nextStep}>Suivant</Button>
                    </div>
                </Form>
            )}

            {step > 1 && step <= 7 && (
                <div>
                    <h5>Vérification du composant {step - 1}</h5>
                    <Row>
                        {imageData[`step${step}`].map((data, index) => (
                            <Col sm={4} key={index} className="mb-3">
                                <Form className="p-3 shadow-sm">
                                    <Form.Group controlId={`formTitle${step}-${index}`} className="mb-2">
                                        <Form.Label>{data.title}</Form.Label>
                                    </Form.Group>

                                    {data.image && (
                                        <div className="mb-2">
                                            <img
                                                src={data.image}
                                                alt={`Image ${index + 1}`}
                                                style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between">
                                        <Form.Check
                                            type="checkbox"
                                            label="Conforme"
                                            checked={data.status === 'Conforme'}
                                            onChange={() => handleStatusChange('Conforme', step, index)}
                                            inline
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            label="Non Conforme"
                                            checked={data.status === 'Non Conforme'}
                                            onChange={() => handleStatusChange('Non Conforme', step, index)}
                                            inline
                                        />
                                    </div>
                                </Form>
                            </Col>
                        ))}
                    </Row>
                    <div className="d-flex justify-content-center">
                        <Button variant="secondary" onClick={prevStep} className="mr-2">Précédent</Button>
                        {step < 7 ? (
                            <Button variant="primary" onClick={nextStep}>Suivant</Button>
                        ) : (
                            <Button variant="primary" onClick={handleSubmit}>Enregistrer</Button>
                        )}
                    </div>

                </div>
            )}
            {step > 7 && (
                <div>
                    <h5>Vérification terminée</h5>
                    <p>Merci d'avoir complété la vérification.</p>
                    <Button variant="primary" className="mr-2" onClick={() => setStep(1)}>Recommencer</Button>
                    <Button variant="danger" onClick={goToVehicleChecks}>Quitter</Button>
                </div>
            )}
        </Container>
    );
}
