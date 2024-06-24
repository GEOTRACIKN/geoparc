import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


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
        { title: 'Pneu avant gauche', image: img1, status: '' },
        { title: 'Pneu avant droit', image: img1, status: '' },
        { title: 'Pneu arrière gauche', image: img1, status: '' },
        { title: 'Pneu arrière droit', image: img1, status: '' },
        { title: 'Pare-brise', image: img1, status: '' },
        { title: 'Pare-brise', image: img1, status: '' },
    ],
    step3: [
        { title: 'Phare avant gauche', image: img1, status: '' },
        { title: 'Phare avant droit', image: img1, status: '' },
        { title: 'Phare arrière gauche', image: img1, status: '' },
        { title: 'Phare arrière droit', image: img1, status: '' },
        { title: 'Rétroviseur gauche', image: img1, status: '' },
        { title: 'Rétroviseur gauche', image: img1, status: '' },
    ],
    step4: [
        { title: 'Rétroviseur droit', image: img1, status: '' },
        { title: 'Vitres latérales', image: img1, status: '' },
        { title: 'Toit', image: img1, status: '' },
        { title: 'Capot', image: img1, status: '' },
        { title: 'Coffre', image: img1, status: '' },
        { title: 'Coffre', image: img1, status: '' },
    ],
    step5: [
        { title: 'Pare-chocs avant', image: img1, status: '' },
        { title: 'Pare-chocs arrière', image: img1, status: '' },
        { title: 'Portière avant gauche', image: img1, status: '' },
        { title: 'Portière avant droit', image: img1, status: '' },
        { title: 'Portière arrière gauche', image: img1, status: '' },
        { title: 'Portière arrière gauche', image: img1, status: '' },
    ],
    step6: [
        { title: 'Portière arrière droit', image: img1, status: '' },
        { title: 'Plaque d’immatriculation', image: img1, status: '' },
        { title: 'Échappement', image: img1, status: '' },
        { title: 'Châssis', image: img1, status: '' },
        { title: 'Essuie-glaces', image: img1, status: '' },
        { title: 'Essuie-glaces', image: img1, status: '' },
    ],
};

export function Vehiclecheck() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        incomingDriver: '',
        matriculetrac: '',
        km: '',
        outgoingDriver: '',
        matriculerem: '',
        Heures: '',
    });
    const navigate = useNavigate();



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
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const goToVehicleChecks = () => {
        navigate('/vehicles_checks'); // Naviguer vers la page Vehicle_checks
    };

    const handleSubmit = async () => {
        // Extraire les statuts de imageData avec leur titre correspondant
        const statuses: { title: string, status: string }[] = [];
        Object.keys(imageData).forEach(step => {
            imageData[step].forEach(item => {
                if (item.status) {
                    statuses.push({ title: item.title, status: item.status });
                }
            });
        });

        // Ajouter les statuts à formData
        const data = {
            ...formData,
            status: statuses
        };

        try {
            const response = await fetch(`${backendUrl}/api/geop/addvehiclecheck/${1}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Données envoyées avec succès!");
                setStep(1); // Réinitialiser le formulaire ou naviguer ailleurs
            } else {
                console.error("Erreur lors de l'envoi des données.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête:", error);
        }
    };



    return (
        <Container>
            <h3 className="text-center mb-4">Vérification véhicule</h3>
            <ProgressBar now={(step / 6) * 100} label={`Étape ${step}`} className="mb-4" />
            {step === 1 && (

                <Form>
                    <h4>Informations générales</h4>
                    <Row>
                        <Col sm={6}>
                            <Form.Group as={Row} controlId="formVerifier" className="mb-3">
                                <Form.Label column sm={10}>Vérifié par*</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
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
                                <Form.Label column sm={10}>KM</Form.Label>
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
                                <Form.Label column sm={10}>Heures de fonctionnement</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="time"
                                        name="Heures"
                                        value={formData.Heures}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" onClick={nextStep} >Suivant</Button>
                </Form>
            )}

            {step > 1 && step <= 6 && (
                <div>
                    <h5>Vérification du composant {step - 1}</h5>
                    <Row>
                        {imageData[`step${step}`].map((data, index) => (
                            <Col sm={4} key={index} className="mb-3">
                                <Form>
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

                    <Button variant="secondary" onClick={prevStep} className="mr-2">Précédent</Button>
                    {step < 6 ? (
                        <Button variant="primary" onClick={nextStep}>Suivant</Button>
                    ) : (
                        <Button variant="primary" onClick={handleSubmit}>Enregistrer</Button>
                    )}
                </div>
            )}
            {step > 6 && (
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
