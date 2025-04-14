import React, { useState } from 'react';

interface TooltipTextProps {
  fullText: string;
}

const TooltipText: React.FC<TooltipTextProps> = ({ fullText }) => {
  const [isHovered, setIsHovered] = useState(false);
  const truncatedText = fullText.length > 30 ? fullText.substring(0, 30) + "..." : fullText;

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{truncatedText}</span>
      {isHovered && (
        <div style={{
          position: 'absolute',
          backgroundColor: '#000',
          color: '#fff',
          padding: '5px',
          borderRadius: '3px',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          zIndex: 1,
        }}>
          {fullText}
        </div>
      )}
    </div>
  );
};

export default TooltipText;
export {}; // Ajoutez cette ligne