import React from "react";
import { ProgressBar } from "react-bootstrap";

const MultiStepProgressBar = (props:any) => {
  let stepPercentage = 0;

  switch (props.currentStep) {
    case 1:
      stepPercentage = 0;
      break;
    case 2:
      stepPercentage = 20;
      break;
    case 3:
      stepPercentage = 40;
      break;
    case 4:
      stepPercentage = 60;
      break;
    case 5:
      stepPercentage = 80;
      break;
    case 6:
      stepPercentage = 100;
      break;
    default:
      stepPercentage = 0;
  }

  return (
    <ProgressBar now={stepPercentage} label={`${stepPercentage}%`} />
  );
};

export default MultiStepProgressBar;
