import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, Row, Col, FloatingLabel } from 'react-bootstrap';

import ActionButtons from './ActionButtons'; // Ajustez le chemin selon la structure de votre projet

import { 
  StepsProps,
  VehicleFormProps, 
  VehicleFormState, 
  VehicleSelectOption, 
  VehicleValidateFormsStep2,
} from '../../utilities/interfaces';


import { useTranslate } from '../LanguageProvider';
import { CategorieOption } from '../../utilities/selectOptions';

const backendUrl = 'http://localhost:5000/api/geop';



/**
 * Renders the Step2 component of the vehicle form.
 * This component handles the display and validation of additional vehicle information, such as PSN, power, year, maximum allowed total, circulation date, dimensions, and other details.
 * The component uses the `VehicleFormState` state to manage the form data and validations, and provides a `validate` function to be called when the user is ready to proceed to the next step.
 *
 * @param props - An object containing the following properties:
 *   - `translate`: A function to translate strings
 *   - `userCallback`: A function to be called with the form values when the user is ready to proceed
 *   - `nextStep`: A function to be called to move to the next step of the form
 *   - `currentStep`: The current step of the form
 *   - `totalSteps`: The total number of steps in the form
 *   - `previousStep`: A function to be called to move to the previous step of the form
 *   - `lastStep`: A function to be called to move to the last step of the form
 * @returns The rendered Step2 component
 */
const Step2: React.FC<StepsProps> = (props) => {
  const [error, setError] = useState<string>("");
  // const id_user = localStorage.getItem("GeopUserID");
  const id_user = 8;
  const { translate } = useTranslate();
  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep2
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
    props.userCallback(formState.values);
    props.nextStep();
  };

  return (
    <div className="w-100">
      <span style={{ color: "red" }}>{error}</span>
      <h2>Informations complémentaires</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          {/* Psn */}
          <Form.Group
            controlId="formBasicInput-Psn"
            className="mt-2 col-md-6 col-xl-3 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Psn">
              <Form.Control
                placeholder=" "
                type="text"
                name="Psn"
                value={formState.values.Psn}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Psn ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Power */}
          <Form.Group
            controlId="formBasicInput-Power"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Puissance">
              <Form.Control
                placeholder=" "
                type="text"
                name="Power"
                value={formState.values.Power}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Power ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Year */}
          <Form.Group
            controlId="formBasicInput-Year"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Année">
              <Form.Control
                placeholder=" "
                type="text"
                name="Year"
                value={formState.values.Year}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Year ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/*//! maximum_allowed_total */}
          <Form.Group
            controlId="formBasicInput-maximum_allowed_total"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Poids total autorisé en charge"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="MaximumAllowedTotal"
                value={formState.values.MaximumAllowedTotal}
                onChange={(e: any) => handleChange(e)}
                className={
                  formState.validations.MaximumAllowedTotal ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row className="w-full">
          {/* CirculationDate */}
          <Form.Group
            controlId="formBasicInput-CirculationDate"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Date circulation">
              <Form.Control
                placeholder=" "
                type="date"
                name="CirculationDate"
                value={formState.values.CirculationDate}
                onChange={(e: any) => handleChange(e)}
                className={
                  formState.validations.CirculationDate ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>

          {/* longueur */}
          <Form.Group
            controlId="formBasicInput-longueur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Longueur en mètres"
            >
              <Form.Control
                placeholder="Longueur (m)"
                type="text"
                name="Longueur"
                value={formState.values.Longueur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Longueur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* NbrePorte */}
          <Form.Group
            controlId="formBasicInput-NbrePorte"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Nombre de Portes">
              <Form.Control
                placeholder=" "
                type="text"
                name="NbrePorte"
                value={formState.values.NbrePorte}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NbrePorte ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* largeur */}
          <Form.Group
            controlId="formBasicInput-largeur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Largeur en mètres">
              <Form.Control
                placeholder="Largeur (m)"
                type="text"
                name="Largeur"
                value={formState.values.Largeur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Largeur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row className="w-full">
          {/* NumChassis */}
          <Form.Group
            controlId="formBasicInput-NumChassis"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="N° Chassis du véhicule"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="NumChassis"
                value={formState.values.NumChassis}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NumChassis ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Hauteur */}
          <Form.Group
            controlId="formBasicInput-Hauteur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Hauteur en mètres">
              <Form.Control
                placeholder="Hauteur (m)"
                type="text"
                name="Hauteur"
                value={formState.values.Hauteur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Hauteur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* NbrePlace */}
          <Form.Group
            controlId="formBasicInput-NbrePlace"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Nombre de Places">
              <Form.Control
                placeholder=" "
                type="text"
                name="NbrePlace"
                value={formState.values.NbrePlace}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NbrePlace ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Weight */}
          <Form.Group
            controlId="formBasicInput-Weight"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Poids du véhicule en kg"
            >
              <Form.Control
                placeholder="Poids (Kg)"
                type="text"
                name="Weight"
                value={formState.values.Weight}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Weight ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row className="w-full">
          {/* co2 */}
          <Form.Group
            controlId="formBasicInput-co2"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Emission de Co2">
              <Form.Control
                placeholder=" "
                type="text"
                name="co2"
                value={formState.values.co2}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.co2 ? "is-valid" : ""}
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

export default Step2;
