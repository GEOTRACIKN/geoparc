import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, FloatingLabel, Row } from 'react-bootstrap';
import ActionButtons from './ActionButtons'; // Ajustez le chemin selon la structure de votre projet
import { StepsProps, VehicleFormState, VehicleValidateFormsStep6 } from '../../utilities/interfaces';


const Step6: React.FC<StepsProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep6
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
       <h2>Vignette</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group
            controlId="formBasicInput-NumVignette"
            className="mt-2 col-md-6"
          >
            <FloatingLabel controlId="floatingSelect" label="N° Vignette">
              <Form.Control
                placeholder=" "
                type="text"
                name="NumVignette"
                value={formState.values.NumVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.NumVignette ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicInput-DateVignette" className="mt-2 col-md-6">
            <FloatingLabel
              controlId="floatingSelect"
              label="Date vignette"
            >
              <Form.Control
                placeholder=" "
                type="date"
                name="DateVignette"
                value={formState.values.DateVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateVignette ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            controlId="formBasicInput-CoutVignette"
            className="mt-2 col-md-6"
          >
            <FloatingLabel controlId="floatingSelect" label="Coût Vignette">
              <Form.Control
                placeholder=" "
                type="text"
                name="CoutVignette"
                value={formState.values.CoutVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.CoutVignette ? "is-valid" : ""}
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
        nextStep={props.nextStep}
        lastStep={props.lastStep}
      />
    </div>
  );
};

export default Step6;
