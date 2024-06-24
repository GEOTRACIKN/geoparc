import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, Row, Col } from 'react-bootstrap';
import ActionButtons from './ActionButtons'; // Ajustez le chemin selon la structure de votre projet

interface Step2Props {
  nextStep: () => void;
  userCallback: (info: any) => void;
  user: any;
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  lastStep: () => void;
}

const Step5: React.FC<Step2Props> = (props) => {
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
    if (!info2.age) {
      setError("ยังไม่ได้ป้อนจำนวนแปลงที่ดิน");
    } else {
      setError("");
      props.userCallback(info2);
      props.nextStep();
    }
  };

  return (
    <div>
      <span style={{ color: "red" }}>{error}</span>
      <h1>
         Informations complémentaires
      </h1>
      <Form>
        <FormGroup>
          <FormLabel>
            ยินดีต้อนรับโครงการ <b>{props.user.name || ""}</b>
          </FormLabel>
        </FormGroup>
        <FormGroup>
          <FormLabel>แปลงที่ดิน: </FormLabel>
          <FormControl
            type="text"
            name="age"
            placeholder="จำนวนแปลงที่ดิน"
            onChange={onInputChanged}
            className="input input-bordered"
          />
        </FormGroup>
      </Form>
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

export default Step5;
