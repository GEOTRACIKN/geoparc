import React, { useState, useEffect } from 'react';

const NetworkStatusIcon = () => {
  const [status, setStatus] = useState('yellow');
  let interval: NodeJS.Timeout;

  const checkNetworkStatus = () => {
    const img = new Image();
    img.src = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'; // Utilisez une image de logo Google
    img.onload = () => setStatus('green');
    img.onerror = () => setStatus('red');
  };

  useEffect(() => {
    checkNetworkStatus(); // Check immediately on mount
    const     interval = setInterval(checkNetworkStatus, 2000); // Vérifiez toutes les 2 secondes


    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ color: status }}>
      {status === 'green' && <i className="fas fa-signal"><span style={{color:"#000"}}> Excellent  </span></i> }
      {status === 'red' && <i className="fas fa-signal"><span style={{color:"#000"}}> Poor </span> </i>}  
      {status === 'yellow' && <i className="fas fa-signal"><span style={{color:"#000"}}> Fair </span>  </i>}  
    </div>
  );

 
 
  
  


};

export default NetworkStatusIcon;
