import React, { useState,useEffect } from 'react';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import MultiStepProgressBar, { Step } from '../components/VehicluesFormes/MultiStepProgressBar';
import Step1 from '../components/VehicluesFormes/Step1';
import Step2 from '../components/VehicluesFormes/Step2';
import Step3 from '../components/VehicluesFormes/Step3';
import Step4 from '../components/VehicluesFormes/Step4';
import Step5 from '../components/VehicluesFormes/Step5';
import Step6 from '../components/VehicluesFormes/Step6';
import { WizardForm } from '../components/VehicluesFormes/wizardForm';
import StepWizard from "react-step-wizard";
import ActionButtons from '../components/VehicluesFormes/ActionButtons';

// https://codesandbox.io/p/sandbox/react-v5stq?file=%2Fsrc%2Fsample.js%3A1%2C1-220%2C1
// https://codesandbox.io/p/sandbox/bold-chihiro-98q4df?file=%2Fsrc%2Fsample.js%3A171%2C1

export const VehiclesForms = () => {
  const [stepWizard, setStepWizard] = useState<any>(null);
  const [user, setUser] = useState<any>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [steps, setSteps] = useState<Step[]>([
    { index: 1, statusClass: 'step-active', stepTitle: '' },
    { index: 2, statusClass: '', stepTitle: '' },
    { index: 3, statusClass: '', stepTitle: '' },
    { index: 4, statusClass: '', stepTitle: '' },
    { index: 5, statusClass: '', stepTitle: '' },
    { index: 6, statusClass: '', stepTitle: '' },
  ]);

  const assignStepWizard = (instance: any) => {
    setStepWizard(instance);
  };

  const assignUser = (val: any) => {
    console.log("parent receive user callback");
    console.log(val);
    setUser((prevuser:any) => ({
      ...prevuser,
      ...val
    }));
  };

  const handleStepChange = (e: any) => {
    console.log("step change");
    console.log(e);
    setActiveStep(e.activeStep - 1);
    updateStepStatus(e.activeStep - 1);
  };

  const handleComplete = () => {
    alert("Form Complete");
  };

  const nextStep = () => {
    if (stepWizard) {
      updateStepStatus(activeStep + 1, 'step-success');
      updateStepStatus(activeStep + 1, 'step-active');
      stepWizard.nextStep();
    }
  };

  const previousStep = () => {
    if (stepWizard) {
      updateStepStatus(activeStep, '');
      updateStepStatus(activeStep - 1, 'step-active');
      stepWizard.previousStep();
    }
  };

  const lastStep = () => {
    if (stepWizard) {
      updateStepStatus(activeStep, 'step-success');
      stepWizard.goToStep(stepWizard.totalSteps);
    }
    handleComplete();
  };

  const updateStepStatus = (stepIndex: number, status: string = 'step-active') => {
    setSteps(prevSteps => prevSteps.map((step, index) => ({
      ...step,
      statusClass: index === stepIndex ? status : step.statusClass
    })));
  };

  useEffect(() => {
    const newSteps = steps.map((step, index) => {
      if (index === activeStep) {
        return { ...step, statusClass: 'step-active' };
      } else if (index < activeStep) {
        return { ...step, statusClass: 'step-success' };
      } else {
        return { ...step, statusClass: '' };
      }
    });
    console.log('useEffect-newSteps',newSteps);
    
    setSteps(newSteps);
  }, [activeStep]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // handle form submission
  };


  return (
    <div className="w-100">
      <h1>My Multi-Step Progress Bar</h1>
        <div className='mainWizard'>
  
        <MultiStepProgressBar params={steps} />
        <StepWizard instance={assignStepWizard} onStepChange={handleStepChange}  className='w-100'>
          <Step1
            userCallback={assignUser}
            nextStep={nextStep}
            actionButtons={
              <ActionButtons
                currentStep={activeStep + 1}
                totalSteps={steps.length}
                previousStep={previousStep}
                nextStep={nextStep}
                lastStep={lastStep}
              />
            }
          />
          <Step2
            user={user}
            userCallback={assignUser}
            currentStep={activeStep + 1}
            totalSteps={steps.length}
            previousStep={previousStep}
            nextStep={nextStep}
            lastStep={lastStep}
          />
          <Step3
            user={user}
            userCallback={assignUser}
            currentStep={activeStep + 1}
            totalSteps={steps.length}
            previousStep={previousStep}
            nextStep={nextStep}
            lastStep={lastStep}
          />
          <Step4
            user={user}
            userCallback={assignUser}
            currentStep={activeStep + 1}
            totalSteps={steps.length}
            previousStep={previousStep}
            nextStep={nextStep}
            lastStep={lastStep}
          />
          <Step5
            user={user}
            userCallback={assignUser}
            currentStep={activeStep + 1}
            totalSteps={steps.length}
            previousStep={previousStep}
            nextStep={nextStep}
            lastStep={lastStep}
          />
          <Step6
            user={user}
            completeCallback={handleComplete}
            currentStep={activeStep + 1}
            totalSteps={steps.length}
            previousStep={previousStep}
            nextStep={nextStep}
            lastStep={lastStep}
  
          />
        </StepWizard>
  
      </div>
    </div>
  );
};
