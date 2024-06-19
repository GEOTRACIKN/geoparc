import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';

type ImageData = {
    title: string;
    image: string | null;
    status: string;
};

type StepData = {
    [key: string]: ImageData[];
};

export function Vehiclecheck() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        vehicle: '',
        driver: '',
        // Ajoutez d'autres champs nécessaires ici
    });

    const initialImageData: StepData = {
        step2: Array(5).fill({ title: '', image: null, status: '' }),
        step3: Array(5).fill({ title: '', image: null, status: '' }),
        step4: Array(5).fill({ title: '', image: null, status: '' }),
        step5: Array(5).fill({ title: '', image: null, status: '' }),
        step6: Array(5).fill({ title: '', image: null, status: '' }),
    };

    const [imageData, setImageData] = useState<StepData>(initialImageData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, stepNumber: number, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const newImageData = { ...imageData };
            newImageData[`step${stepNumber}`][index].image = URL.createObjectURL(file);
            setImageData(newImageData);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, stepNumber: number, index: number) => {
        const { value } = e.target;
        const newImageData = { ...imageData };
        newImageData[`step${stepNumber}`][index].title = value;
        setImageData(newImageData);
    };

    const handleStatusChange = (status: string, stepNumber: number, index: number) => {
        const newImageData = { ...imageData };
        newImageData[`step${stepNumber}`][index].status = status;
        setImageData(newImageData);
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <Container>
            <h4>vérification véhicule</h4>
            <ProgressBar now={(step / 6) * 100} label={`Étape ${step}`} className="mb-4" />
            {step === 1 && (
                <Form>
                    <Form.Group as={Row} controlId="formName">
                        <Form.Label column sm={2}>Nom</Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Entrez votre nom" 
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formDate">
                        <Form.Label column sm={2}>Date</Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                type="date" 
                                name="date" 
                                value={formData.date} 
                                onChange={handleChange} 
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formVehicle">
                        <Form.Label column sm={2}>Véhicule</Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                type="text" 
                                name="vehicle" 
                                value={formData.vehicle} 
                                onChange={handleChange} 
                                placeholder="Entrez le véhicule" 
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formDriver">
                        <Form.Label column sm={2}>Conducteur</Form.Label>
                        <Col sm={10}>
                            <Form.Control 
                                type="text" 
                                name="driver" 
                                value={formData.driver} 
                                onChange={handleChange} 
                                placeholder="Entrez le conducteur" 
                            />
                        </Col>
                    </Form.Group>

                    {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
                    <Button variant="primary" onClick={nextStep}>Suivant</Button>
                </Form>
            )}

            {step > 1 && step <= 6 && (
                <div>
                    <h5>Vérification du composant {step - 1}</h5>
                    {imageData[`step${step}`].map((data, index) => (
                        <Form key={index} className="mb-3">
                            <Form.Group as={Row} controlId={`formTitle${step}-${index}`}>
                                <Form.Label column sm={2}>Titre {index + 1}</Form.Label>
                                <Col sm={10}>
                                    <Form.Control 
                                        type="text" 
                                        value={data.title}
                                        //onChange={(e) => handleTitleChange(e, step, index)} 
                                        placeholder="Entrez le titre" 
                                    />
                                </Col>
                            </Form.Group>

                        

                            {data.image && (
                                <Row>
                                    <Col sm={{ span: 10, offset: 2 }}>
                                        {/* <img 
                                            src={data.image} 
                                            alt={`Uploaded ${index + 1}`} 
                                            style={{ width: '100%', maxHeight: '200px' }} 
                                        /> */}
                                    </Col>
                                </Row>
                            )}

                            <Row className="mt-2">
                                <Col sm={{ span: 10, offset: 2 }}>
                                    <Button 
                                        variant="success" 
                                        onClick={() => handleStatusChange('Conforme', step, index)}
                                        className="mr-2"
                                    >
                                        Conforme
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleStatusChange('Non Conforme', step, index)}
                                    >
                                        Non Conforme
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    ))}

                    <Button variant="secondary" onClick={prevStep} className="mr-2">Précédent</Button>
                    {step < 6 ? (
                        <Button variant="primary" onClick={nextStep}>Suivant</Button>
                    ) : (
                        <Button variant="primary" onClick={() => setStep(step + 1)}>Terminer</Button>
                    )}
                </div>
            )}

            {step > 6 && (
                <div>
                    <h5>Vérification terminée</h5>
                    <p>Merci d'avoir complété la vérification.</p>
                    <Button variant="primary" onClick={() => setStep(1)}>Recommencer</Button>
                </div>
            )}
        </Container>
    );
}
