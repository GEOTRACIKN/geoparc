import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

interface ActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  nextStep: () => void;
  lastStep: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = (props) => {
  const handleBack = () => {
    props.previousStep();
  };

  const handleNext = () => {
    props.nextStep();
  };

  const handleFinish = () => {
    props.lastStep();
  };

  return (
    <div>
      <Row>
        {props.currentStep > 1 && (
          <Col>
            <Button onClick={handleBack}>Preview</Button>
          </Col>
        )}
        <Col>
          {props.currentStep < props.totalSteps && (
            <Button onClick={handleNext}>Next</Button>
          )}
          {props.currentStep === props.totalSteps && (
            <Button onClick={handleFinish}>Complite</Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ActionButtons;
