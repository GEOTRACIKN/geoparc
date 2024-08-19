
import React from 'react';

type AlertProps = {
    alerts: Alert[];
};


interface Alert {
    id: number;
    type:string;
    matriculation:string;
    message: string;
    timestamp: string; 
  }

const Alert: React.FC<AlertProps> = ({alerts}) => {
  // Exemple de données simulées pour les alertes

  return (
     <>
      {alerts.length > 0 ? (
       <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
                <td> {alert.type}</td> 
                <td> {alert.matriculation}</td> 
                <td> {alert.message}</td>
                <td> {alert.timestamp}</td>  
          </tr>  
          ))}
        </tbody> 
         
      ) : (
        <p>Aucune alerte en cours.</p>
      )}
   </>
  );
};

export default Alert;
