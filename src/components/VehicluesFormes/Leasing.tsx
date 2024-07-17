import React, { useState } from 'react'
import { FloatingLabel, Form, Row } from 'react-bootstrap'
import { VehicleFormState, VehicleValidateFormsStep2 } from '../../utilities/interfaces';
import { DureeOption } from '../../utilities/selectOptions';


interface LeasingProps {
  formState: VehicleFormState
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Renders a form for entering vehicle details, including fields for PSN, power, year, maximum allowed total, circulation date, length, width, height, number of doors, chassis number, and number of seats.
 * 
 * @param params - An object containing the form state and a function to handle changes to the form.
 * @param formState - The current state of the vehicle form.
 * @param handleChange - A function to handle changes to the form.
 */
const Leasing = ({
  formState,
  handleChange
}: LeasingProps) => {
  return (
    <>
        <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group controlId='formBasicInput-Fournisseur' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Fournisseur'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Fournisseur'
            value={formState.values.Fournisseur}
            onChange={handleChange}
            className={formState.validations.Fournisseur ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-Echeance' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Echéance'>
            <Form.Control
            placeholder=' '
            type="number"
            name='Echeance'
            value={formState.values.Echeance}
            onChange={handleChange}
            className={formState.validations.Echeance ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
       
          <Form.Group controlId='formBasicInput-NumContrat' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Numéro du contrat'>
            <Form.Control
            placeholder='N° du contrat'
            type="text"
            name='NumContrat'
            value={formState.values.NumContrat}
            onChange={handleChange}
            className={formState.validations.NumContrat ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-EcheanceRestante' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Echéance restantes'>
            <Form.Control
            placeholder='Echéance restantes (Mois)'
            type="text"
            name='EcheanceRestante'
            value={formState.values.EcheanceRestante}
            onChange={handleChange}
            className={formState.validations.EcheanceRestante ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>       
        <Row>
          <Form.Group controlId='formBasicInput-Duree' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Durée'>
            <Form.Select
            as="select"
            name='Duree'
            value={formState.values.Duree}
            onChange={(e:any) => handleChange(e)}
            className={formState.validations.Duree ? 'is-valid' : ''}
            ><option value="">Sélectionnez une Durée</option>
            {DureeOption.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-PayeAcejour' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Payé à ce jour'>
            <Form.Control
            placeholder=' '
            type="text"
            name='PayeAcejour'
            value={formState.values.PayeAcejour}
            onChange={handleChange}
            className={formState.validations.PayeAcejour ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
      
          <Form.Group controlId='formBasicInput-Apport' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Apport'>
            <Form.Control
            placeholder=' '
            type="number"
            name='Apport'
            value={formState.values.Apport}
            onChange={handleChange}
            className={formState.validations.Apport ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-DernierPaiment' className='mt-2 col-md-6 col-xl-3'>
            <FloatingLabel controlId="floatingSelect" label='Dernier paiement'>
            <Form.Control
            placeholder=' '
            type="text"
            name='DernierPaiment'
            value={formState.values.DernierPaiment}
            onChange={handleChange}
            className={formState.validations.DernierPaiment ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row> 
        <Row className='w-full'>
          <Form.Group controlId='formBasicInput-DatePremiereEcheance' className='mt-2 col-md-6 col-xl-3'>
              <FloatingLabel controlId="floatingSelect" label='Date 1ere échéance'>
              <Form.Control
              placeholder=' '
              type="date"
              name='DatePremiereEcheance'
              value={formState.values.DatePremiereEcheance}
              onChange={handleChange}
              className={formState.validations.DatePremiereEcheance ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
          
          <Form.Group controlId='formBasicInput-ProchaineEcheance' className='mt-2 col-md-6 col-xl-3'>
              <FloatingLabel controlId="floatingSelect" label='Prochaine échéance'>
              <Form.Control
              placeholder=' '
              type="text"
              name='ProchaineEcheance'
              value={formState.values.ProchaineEcheance}
              onChange={handleChange}
              className={formState.validations.ProchaineEcheance ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
          
       
          <Form.Group controlId='formBasicInput-TotalLeasing' className='mt-2 col-md-6 col-xl-3'>
              <FloatingLabel controlId="floatingSelect" label='Total leasing H.T'>
              <Form.Control
              placeholder=' '
              type="number"
              name='TotalLeasing'
              value={formState.values.TotalLeasing}
              onChange={handleChange}
              className={formState.validations.TotalLeasing ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
  
        </Row>


        </Form>
      
    </>
  )
}

export default Leasing