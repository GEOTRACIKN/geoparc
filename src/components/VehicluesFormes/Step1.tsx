import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, Badge } from 'react-bootstrap';
interface FormProps {
  nextStep: () => void;
  userCallback: (info: any) => void;
  actionButtons: React.ReactNode;
}

const Step1: React.FC<FormProps> = ({ nextStep, userCallback, actionButtons }) => {
  const [info1, setInfo1] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");

  const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInfo1((info1) => ({
      ...info1,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!info1.name) {
      setError("Erreur");
    } else {
      setError("");
      nextStep();
      userCallback(info1);
    }
  };

  const validInput = (e:any) => {
    console.log(e);
    
  }

  return (
    <div>
  
      <span style={{ color: "red" }}>{error}</span>
      <h1 className="text-3xl font-bold underline">
    Informations Générales
    </h1>
      <Form>
        <FormGroup aria-required='true'>
          <FormLabel aria-required='true' >Immatriculation : </FormLabel>
          <FormControl
            type="text"
            name="name"
            placeholder="Immatriculation"
            onChange={onInputChanged}
            className="input input-bordered is-invalid"
            onChangeCapture={validInput}
          />
        </FormGroup>
        <br />
        <FormGroup>
          <FormLabel>Nom d'utilisateur : </FormLabel>
          <FormControl
            type="text"
            name="staff"
            placeholder="Nom d'utilisateur"
            onChange={onInputChanged}
            className="input input-bordered"
          />
        </FormGroup>
        <br />
        <FormGroup>
          <FormLabel>Email : </FormLabel>
          <FormControl
            type="text"
            name="address"
            placeholder="Email"
            onChange={onInputChanged}
            className="input input-bordered"
          />
        </FormGroup>
        <br />
        <Button variant="primary" onClick={validate}>
          Soumettre
        </Button>
      </Form>
      
    </div>
  );
};

export default Step1;
