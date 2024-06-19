import React, { useState } from 'react';
import { Form, Button, ProgressBar } from 'react-bootstrap';
import Step1 from '../components/VehicluesFormes/Step1';
import Step2 from '../components/VehicluesFormes/Step2';
import Step3 from '../components/VehicluesFormes/Step3';
import Step4 from '../components/VehicluesFormes/Step4';
import Step5 from '../components/VehicluesFormes/Step5';
import Step6 from '../components/VehicluesFormes/Step6';


export const VehiclesForms = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

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
    <div className='container'>
      <div className='row'>
        <Form onSubmit={handleSubmit} className="overflow-auto" style={{ maxHeight: '300px' }}>
          <div className="row">
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Informations Générales</div>
                <ProgressBar
        
                  now={step >=1?100:0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
        
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Informations complémentaires</div>
                <ProgressBar
        
                  now={step >=2?100:0}
                  className=" px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
        
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Acquisition</div>
                <ProgressBar
        
                  now={step >=3?100:0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
        
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Assurance</div>
                <ProgressBar
        
                  now={step >=4?100:0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
        
        
            <div className="col">
              <div className="row mr-2">
                <div className="text-center text-nowrap">Contrôle technique</div>
                <ProgressBar
        
                  now={step >=5?100:0}
                  className="px-0 mt-6"
                  style={{ marginTop: "6px" }}
                />
              </div>
            </div>
        
          </div>
          {step === 0 && (
            <Step1 currentStep={1}/>
          )}
          {step === 1 && (
            <Step2 currentStep={2}/>
          )}

          {step === 2 && (
            <Step3 currentStep={3}/>)}
          {step === 3 && (
          <Step4 currentStep={4}/>)}
          {step === 4 && (
          <Step5 currentStep={5}/> )}
          {step === 5 && (
          <Step6 currentStep={6}/>)}
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
      </div>
    </div>
  );
};
