import React, { useEffect, useLayoutEffect, useState } from 'react';
import ActionButtons from './ActionButtons';
import { StepsProps, VehicleFormState, VehicleValidateFormsStep5 } from '../../utilities/interfaces';
import ProfileVehicles from './ProfileVehicles';
import FurtherInformation from './FurtherInformation';


const Step5: React.FC<StepsProps> = (props) => {
  const [error, setError] = useState<string>("");
  const [formState, setFormState] = useState<VehicleFormState | undefined>(undefined); 
  useLayoutEffect(() => {    
    Object.entries(props.user).forEach(([nom, valeur]) => {
      setFormState(() => {
        return {
          values: props.user,
          validations:  {}
        }
      })
    })
  }, [props.user])

  return (
    <div>
       <span style={{ color: "red" }}>{error}</span>
      
      {/* Boucle sur un objet */}
      {/* {Object.entries(props.user).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {String(value)}
        </div>
      ))} */}

      <section className=" py-3 py-md-5 py-xl-8">
        {/* <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
              <h2 className="mb-4 display-5 text-center">Profile</h2>
              <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
            </div>
          </div>
        </div> */}

        <ProfileVehicles formState={formState} />

     
      </section>

      <br />
      <ActionButtons
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        previousStep={props.previousStep}
        nextStep={props.nextStep}
        lastStep={props.lastStep}
        retrieveData={() => props.user}
        />
    </div>
  );
};

export default Step5;
