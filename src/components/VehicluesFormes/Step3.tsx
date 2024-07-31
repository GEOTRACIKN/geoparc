import React, { useState, useEffect } from 'react';
import ActionButtons from './ActionButtons'; 

import { Tab, TabPanel, Tabs } from './Tabs';
import './Tabs.css'

import { StepsProps, VehicleFormState, VehicleValidateFormsStep3 } from '../../utilities/interfaces';
import RentCar from './RentCar';
import Leasing from './Leasing';
import Purchase from './Purchase';

const Step3: React.FC<StepsProps> = (props) => {
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

  const isTabDisabled = (tabName: string) => {
    return props.user.Step3 !== tabName;
  };

  return (
    <div>
      <span style={{ color: "red" }}>{error}</span>
      <h2>Acquisition</h2>
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

export default Step3;
