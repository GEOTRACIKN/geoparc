// driverWidget.tsx
import React from 'react';

interface DriverWidgetProps {
  imageSrc: string;
  matriculation: string;
}

const DriverWidget: React.FC<DriverWidgetProps> = ({ imageSrc, matriculation }) => {
  return (
    <div className="driver-widget">
      <div className="driver-info">
        <div className="matriculation">{matriculation}</div>
      </div>
      <div className="driver-image">
        <img src={imageSrc} alt="Driver" />
      </div>
    </div>
  );
};

export {};

// or you can also use:
// export default DriverWidget;
