import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import ActionButtons from "./ActionButtons"; // Ajustez le chemin selon la structure de votre projet

import {
  StepsProps,
  VehicleFormProps,
  VehicleFormState,
  VehicleSelectOption,
  VehicleValidateFormsStep2,
} from "../../utilities/interfaces";

import { useTranslate } from "../LanguageProvider";
import { CategorieOption } from "../../utilities/selectOptions";
import FurtherInformation from "./FurtherInformation";

const backendUrl = "http://localhost:5000/api/geop";

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
    <>
      <div className="w-100 h-100 card widget-card border-light shadow-sm">
        <div className="p-4">
          <h2>Informations Complémentaires</h2>
          <hr className="w-50 mx-auto border-dark-subtle" />
          <span className="" style={{ color: "red" }}>{error}</span>
        </div>
      
            <div className="card-body p-2">
              <FurtherInformation formState={formState} handleChange={handleChange} />
            </div>
      
      </div>
      
        <div className="p-4 card widget-card border-light shadow-sm">
          <br />
          <ActionButtons
            currentStep={props.currentStep}
            totalSteps={props.totalSteps}
            previousStep={props.previousStep}
            nextStep={validate}
            lastStep={props.lastStep}
          />
        </div>
    </>
  );
};

export default Step2;
