import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, Row, Col } from 'react-bootstrap';
import ActionButtons from './ActionButtons'; 

import { 
  VehicleFormProps,
  VehicleSelectOption,
  StepsProps,
} from '../../utilities/interfaces';
import { Tab, TabContent, TabPanel, Tabs } from './Tabs';
import './Tabs.css'

import { VehicleFormState, VehicleValidateFormsStep3 } from '../../utilities/interfaces';
import RentCar from './RentCar';
import Leasing from './Leasing';
import Purchase from './Purchase';




const Step3: React.FC<StepsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<string>('Tab1');
  const [info2, setInfo2] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");

  const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInfo2((info2) => ({
      ...info2,
      [name]: value
    }));
  };

  const validate2 = () => {
  
      setError("");
      props.userCallback(formState.values);
      props.nextStep();
    
  };

  const [formState, setFormState] = useState<VehicleFormState>(VehicleValidateFormsStep3);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
      validations: {
        ...prevState.validations,
        [name]: value.trim() !== "",
      }
    }))
  }

  return (
    <div>
      <span style={{ color: "red" }}>{error}</span>
      <h2>
      Acquisition
      </h2>
     {/* 
     Leasing === Tab1,
     Location === Tab2,
     Achat === Tab3
     */}

      <Tabs>
        <Tab label="Leasing" isActive={activeTab === 'Tab1'} onClick={() => setActiveTab('Tab1')} />
        <Tab label="Location" isActive={activeTab === 'Tab2'} onClick={() => setActiveTab('Tab2')} />
        <Tab label="Achat" isActive={activeTab === 'Tab3'} onClick={() => setActiveTab('Tab3')} />
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
   
      <br />
      <ActionButtons
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        previousStep={props.previousStep}
        nextStep={validate2}
        lastStep={props.lastStep}
      />
    </div>
  );
};



export default Step3;
