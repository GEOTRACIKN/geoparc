import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, Row, Col, FloatingLabel } from 'react-bootstrap';
import ActionButtons from './ActionButtons'; // Ajustez le chemin selon la structure de votre projet
import { StepsProps, VehicleFormState, VehicleValidateFormsStep5 } from '../../utilities/interfaces';

const Step5: React.FC<StepsProps> = (props) => {

  const [error, setError] = useState<string>("");
  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep5
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
      validations: {
        ...prevState.validations,
        [name]: value.trim() !== "",
      },
    }));
  };

  const validate = () => {
    setError("");
    props.nextStep();
    props.userCallback(formState.values);
  };

  return (
    <div>
      <span style={{ color: "red" }}>{error}</span>
      <h2>Contrôle technique</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group
            controlId="formBasicInput-EtabControle"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Etablissement de contrôle">
              <Form.Control
                placeholder=" "
                type="text"
                name="EtabControle"
                value={formState.values.EtabControle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.EtabControle ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicInput-CoutControle" className="mt-2 col-md-6 col-xl-3">
            <FloatingLabel
              controlId="floatingSelect"
              label="Coût contrôle"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="CoutControle"
                value={formState.values.CoutControle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.CoutControle ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        
          <Form.Group
            controlId="formBasicInput-ReferenceControle"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Référence">
              <Form.Control
                placeholder=" "
                type="text"
                name="ReferenceControle"
                value={formState.values.ReferenceControle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.ReferenceControle ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group
            controlId="formBasicInput-DateControle"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Date du contrôle">
              <Form.Control
                placeholder=" "
                type="date"
                name="DateControle"
                value={formState.values.DateControle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateControle ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            controlId="formBasicInput-DateFinControle"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Début Fin">
              <Form.Control
                placeholder=" "
                type="date"
                name="DateFinControle"
                value={formState.values.DateFinControle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateFinControle ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
      </Form>
      <br />
      <ActionButtons
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        previousStep={props.previousStep}
        nextStep={validate}
        lastStep={props.lastStep}
      />
    </div>
  );
};


export default Step5;
