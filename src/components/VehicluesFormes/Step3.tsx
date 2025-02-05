import React, { useState, useEffect } from "react";
import ActionButtons from "./ActionButtons";

import { Tab, TabPanel, Tabs } from "./Tabs";

import {
  StepsProps,
  VehicleFormState,
  VehicleValidateFormsStep3,
} from "../../utilities/interfaces";

import Assurance from "./Assurance";
import Vignette from "./Vignette";
import VehicleInspection from "./VehicleInspection";

const Step3: React.FC<StepsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>("Assurance");
  const [error, setError] = useState<string>("");

  const validate = () => {
    setError("");
    props.userCallback(formState.values);
    props.nextStep();
  };

  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep3
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

  return (
    <>
      <div className="w-100 h-100 card widget-card border-light shadow-sm">
        <div className="p-4">
          <h2>
            Assurer la Conformité - Assurance, Vignette et Contrôle Technique
          </h2>
          <hr className="w-50 mx-auto border-dark-subtle" />
          <span className="" style={{ color: "red" }}>
            {error}
          </span>
        </div>
        <br />
        <Tabs>
          <Tab
            label="Assurance"
            isActive={activeTab === "Assurance"}
            onClick={() => setActiveTab("Assurance")}
          />
          <Tab
            label="Vignette"
            isActive={activeTab === "Vignette"}
            onClick={() => setActiveTab("Vignette")}
          />
          <Tab
            label="Contrôle Technique"
            isActive={activeTab === "VehicleInspection"}
            onClick={() => setActiveTab("VehicleInspection")}
          />
        </Tabs>
        <TabPanel activeTab={activeTab} id="Assurance">
          <Assurance formState={formState} handleChange={handleChange} />
        </TabPanel>
        <TabPanel activeTab={activeTab} id="Vignette">
          <Vignette formState={formState} handleChange={handleChange} />
        </TabPanel>
        <TabPanel activeTab={activeTab} id="VehicleInspection">
          <VehicleInspection formState={formState} handleChange={handleChange} />
        </TabPanel>
        <br />

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

export default Step3;
