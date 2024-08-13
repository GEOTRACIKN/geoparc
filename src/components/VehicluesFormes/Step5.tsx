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
      
      
      <section className="card-body py-3 py-md-5 py-xl-8">

        <ProfileVehicles formState={formState} />
              <ul>
                {Object.entries(formState?.values || {}).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {JSON.stringify(value)}
                  </li>
                ))}
              </ul>
     
      </section>

      <div className="p-4 card widget-card border-light shadow-sm">
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
    </div>
  );
};

export default Step5;
