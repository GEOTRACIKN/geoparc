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
    { index: 1, statusClass: 'step-active', stepTitle: 'Step 1' },
    { index: 2, statusClass: '', stepTitle: 'Step 2' },
    { index: 3, statusClass: '', stepTitle: 'Step 3' },
    { index: 4, statusClass: '', stepTitle: 'Step 4' },
    { index: 5, statusClass: '', stepTitle: 'Step 5' },
    { index: 6, statusClass: '', stepTitle: 'Step 6' },
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
    <div className="container">
      <h1>My Multi-Step Progress Bar</h1>
      {/* <button
        onClick={() => {
          setDataSteps((prevState) => {
            const newState = [...prevState];
            if (newState[1].statusClass !== 'step-success') {
              newState[1].statusClass = 'step-success';
            } else {
              newState[1].statusClass = 'step-active';
            }
            return newState;
          });
        }}
        >
        Click
      </button> */}

      {/* <WizardForm /> */}

      <MultiStepProgressBar params={steps} />
      <StepWizard instance={assignStepWizard} onStepChange={handleStepChange}>
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
      {/* <div className="row">
        <Form
          onSubmit={handleSubmit}
          className="overflow-auto"
          style={{ maxHeight: "300px" }}
        >
          <div className="row">
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">
                  Informations Générales
                </div>
                <ProgressBar
                  now={step >= 1 ? 100 : 0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>

            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">
                  Informations complémentaires
                </div>
                <ProgressBar
                  now={step >= 2 ? 100 : 0}
                  className=" px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>

            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Acquisition</div>
                <ProgressBar
                  now={step >= 3 ? 100 : 0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>

            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Assurance</div>
                <ProgressBar
                  now={step >= 4 ? 100 : 0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>

            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">
                  Contrôle technique
                </div>
                <ProgressBar
                  now={step >= 5 ? 100 : 0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
          </div> */}
          {/* {step === 0 && <Step1 currentStep={1} />} */}
          {/* {step === 1 && <Step2 currentStep={2} />}

          {step === 2 && <Step3 currentStep={3} />}
          {step === 3 && <Step4 currentStep={4} />}
          {step === 4 && <Step5 currentStep={5} />}
          {step === 5 && <Step6 currentStep={6} />}
          <div className="d-flex justify-content-between">
            {step > 0 && (
              <Button variant="secondary" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < 5 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                Submit
              </Button>
            )}
          </div>
        </Form>
      </div> */}
    </div>
  );
};
