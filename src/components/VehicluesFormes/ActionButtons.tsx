import React from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';

interface ActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  previousStep: () => void;
  nextStep: () => void;
  lastStep: () => void;
  retrieveData?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ currentStep, totalSteps, previousStep, nextStep, lastStep,  retrieveData }) => {

  const handleSendData = () => {
    // Vérifier si senData est une fonction
    if (typeof retrieveData === 'function') {

      
      // Appeler senData et récupérer les données
      const data = retrieveData();
      console.log('Données récupérées:', data);
      
      // Vous pouvez maintenant utiliser ces données comme vous le souhaitez
      // Par exemple, les envoyer à une API ou les traiter localement
      alert('La data a bien etais sovgarder')
    } else {
      console.error('senData n\'est pas une fonction');
    }
  };

  return (
    <Row className="w-auto">
      <Col>
        {currentStep > 1 && <Button onClick={previousStep}>Précédent</Button>}
      </Col>
      <Col className="d-flex justify-content-end">
        {(currentStep === 1 || currentStep < totalSteps ) ? (
          <Button variant="primary" onClick={nextStep}>Suivant</Button>
        ) : (
          <Button variant="primary" onClick={() => { lastStep(); handleSendData(); }}>Compléter</Button>
        )}
      </Col>
    </Row>
  );
};

/**
 * Documentation :
 * 
 * Pour récupérer les données depuis senData :
 * 
 * 1. Nous avons créé une nouvelle fonction `handleSendData`.
 * 
 * 2. Cette fonction vérifie d'abord si `senData` est une fonction en utilisant 
 *    `typeof senData === 'function'`.
 * 
 * 3. Si c'est une fonction, nous l'appelons avec `senData()` et stockons le résultat 
 *    dans la variable `data`.
 * 
 * 4. Nous affichons ensuite les données récupérées dans la console avec 
 *    `console.log('Données récupérées:', data)`.
 * 
 * 5. Vous pouvez maintenant utiliser ces données comme vous le souhaitez, par exemple 
 *    les envoyer à une API ou les traiter localement.
 * 
 * 6. Si `senData` n'est pas une fonction, nous affichons une erreur dans la console.
 * 
 * 7. Nous avons modifié le bouton "Compléter" pour qu'il appelle `handleSendData` 
 *    en plus de `lastStep` lorsqu'il est cliqué.
 * 
 * Note : Assurez-vous que la prop `senData` passée à ce composant est bien une fonction 
 * qui retourne les données que vous souhaitez récupérer.
 */
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