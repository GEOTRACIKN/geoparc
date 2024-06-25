import React from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import ActionButtons from './ActionButtons'; // Ajustez le chemin selon la structure de votre projet

interface Step3Props {
  user: any;
  completeCallback: () => void;
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  nextStep: () => void;
  lastStep: () => void;
}

const Step6: React.FC<Step3Props> = (props) => {
  const handleSubmit = () => {
    // Logique de soumission finale ou validation finale
    props.completeCallback();
  };

  return (
    <div>
      <h1>Final Step: Review and Complete</h1>
      <Form>
        <FormGroup>
          <FormLabel>Name:</FormLabel>
          <FormControl
            type="text"
            readOnly
            defaultValue={props.user.name}
            className="input input-bordered"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Username:</FormLabel>
          <FormControl
            type="text"
            readOnly
            defaultValue={props.user.staff}
            className="input input-bordered"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email:</FormLabel>
          <FormControl
            type="text"
            readOnly
            defaultValue={props.user.address}
            className="input input-bordered"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Land Plots:</FormLabel>
          <FormControl
            type="text"
            readOnly
            defaultValue={props.user.age}
            className="input input-bordered"
          />
        </FormGroup>
        <Button variant="primary" onClick={handleSubmit}>
          Complete
        </Button>
      </Form>
      <br />
      <ActionButtons
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        previousStep={props.previousStep}
        nextStep={props.nextStep}
        lastStep={props.completeCallback}
      />
    </div>
  );
};

export default Step6;
