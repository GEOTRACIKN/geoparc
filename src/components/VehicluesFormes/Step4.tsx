import React, { useState, useEffect } from "react";
import ActionButtons from "./ActionButtons";

import { Tab, TabPanel, Tabs } from "./Tabs";

import {
  StepsProps,
  VehicleFormState,
  VehicleValidateFormsStep4,
} from "../../utilities/interfaces";
import RentCar from "./RentCar";
import Leasing from "./Leasing";
import Purchase from "./Purchase";

const Step4: React.FC<StepsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>("Leasing");
  const [error, setError] = useState<string>("");

  // Utilisez useEffect pour mettre à jour l'onglet actif lorsque props.user.Step3 change
  useEffect(() => {
    setActiveTab(props.user.Step3);
  }, [props.user.Step3]);

  const validate = () => {
    setError("");
    props.userCallback(formState.values);
    props.nextStep();
  };

  const [formState, setFormState] = useState<VehicleFormState>(
    VehicleValidateFormsStep4
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

  const isTabDisabled = (tabName: string) => {
    return props.user.Step3 !== tabName;
  };

  return (
    <>
      <div  className="w-100 h-100 card widget-card border-light shadow-sm">
        <div  className="p-4">
          <h2>Acquisition</h2>
          <hr className="w-50 mx-auto border-dark-subtle" />
          <span className="" style={{ color: "red" }}>{error}</span>
        </div>
        <div className="card-body p-2">
          <Tabs>
            <Tab
              label="Leasing"
              isActive={activeTab === "Leasing"}
              onClick={() => setActiveTab("Leasing")}
              disabled={isTabDisabled("Leasing")}
            />
            <Tab
              label="Location"
              isActive={activeTab === "Location"}
              onClick={() => setActiveTab("Location")}
              disabled={isTabDisabled("Location")}
            />
            <Tab
              label="Achat"
              isActive={activeTab === "Achat"}
              onClick={() => setActiveTab("Achat")}
              disabled={isTabDisabled("Achat")}
            />
          </Tabs>
          <TabPanel activeTab={activeTab} id="Leasing">
            <Leasing formState={formState} handleChange={handleChange} />
          </TabPanel>
          <TabPanel activeTab={activeTab} id="Location">
            <RentCar formState={formState} handleChange={handleChange} />
          </TabPanel>
          <TabPanel activeTab={activeTab} id="Achat">
            <Purchase formState={formState} handleChange={handleChange} />
          </TabPanel>
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

export default Step4;
