import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

interface ActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  nextStep: () => void;
  lastStep: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ currentStep, totalSteps, previousStep, nextStep, lastStep }) => {
  return (
    <Row className="w-100">
      <Col>
        {currentStep > 1 && <Button onClick={previousStep}>Précédent</Button>}
      </Col>
      <Col className="d-flex justify-content-center">
        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>Suivant</Button>
        ) : (
          <Button onClick={lastStep}>Compléter</Button>
        )}
      </Col>
    </Row>
  );
};

export default ActionButtons;
/* 
 <div className='w-100'>
      <Row>
        {props.currentStep > 1 && (
          <Col>
            <Button onClick={handleBack}>Preview</Button>
          </Col>
        )}
        <Col className="d-flex justify-content-center">
          {props.currentStep < props.totalSteps && (
            <Button onClick={handleNext}>Next</Button>
          )}
          {props.currentStep === props.totalSteps && (
            <Button onClick={handleFinish}>Complite</Button>
          )}
        </Col>
      </Row>
*/