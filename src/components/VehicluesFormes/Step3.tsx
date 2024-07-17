import React, { useState } from 'react';
import ActionButtons from './ActionButtons'; 

import { Tab, TabPanel, Tabs } from './Tabs';
import './Tabs.css'

import {  StepsProps,VehicleFormState, VehicleValidateFormsStep3 } from '../../utilities/interfaces';
import RentCar from './RentCar';
import Leasing from './Leasing';
import Purchase from './Purchase';


/**
 * Renders the Step3 component of the vehicle forms.
 * This component handles the acquisition process, including leasing, location, and purchase options.
 * It manages the state of the form and provides validation functionality.
 *
 * @param props - The props passed to the Step3 component.
 * @param props.userCallback - A callback function to be called when the form is validated.
 * @param props.nextStep - A function to move to the next step in the form.
 * @param props.currentStep - The current step in the form.
 * @param props.totalSteps - The total number of steps in the form.
 * @param props.previousStep - A function to move to the previous step in the form.
 * @param props.lastStep - A function to indicate that the form is on the last step.
 */
const Step3: React.FC<StepsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>("Tab1");
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
    <div>
      <span style={{ color: "red" }}>{error}</span>
      <h2>Acquisition</h2>
      {/* 
     Leasing === Tab1,
     Location === Tab2,
     Achat === Tab3
     */}
      <Tabs>
        <Tab
          label="Leasing"
          isActive={activeTab === "Tab1"}
          onClick={() => setActiveTab("Tab1")}
        />
        <Tab
          label="Location"
          isActive={activeTab === "Tab2"}
          onClick={() => setActiveTab("Tab2")}
        />
        <Tab
          label="Achat"
          isActive={activeTab === "Tab3"}
          onClick={() => setActiveTab("Tab3")}
        />
      </Tabs>
      {/* <TabContent activeTab={activeTab} /> */}
      <TabPanel activeTab={activeTab} id="Tab1">
        <Leasing formState={formState} handleChange={handleChange} />
      </TabPanel>

      <TabPanel activeTab={activeTab} id="Tab2">
        <RentCar formState={formState} handleChange={handleChange} />
      </TabPanel>
      <TabPanel activeTab={activeTab} id="Tab3">
        <Purchase formState={formState} handleChange={handleChange} />
      </TabPanel>
      
        {/*  */}
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
