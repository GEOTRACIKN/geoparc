import React from 'react';
import './MultiStepProgressBar.css'

export interface Step {
  index: number;
  statusClass: string;
  stepTitle: string;
}

interface PropsStep {
  params: Step[];
}

const MultiStepProgressBar: React.FC<PropsStep> = ({ params }) => {
  console.log('MultiStepProgressBar', params);
  
  return (
    <ul className="steps">
      {params.map((item) => (
        <li key={item.index} className={`step ${item.statusClass}`}>
          <div className="step-content">
            <span className="step-circle">{item.index}</span>
            <span className="step-text">{item.stepTitle}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MultiStepProgressBar;
