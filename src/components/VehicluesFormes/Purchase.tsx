import React, { useState } from 'react'
import { FloatingLabel, Form, Row } from 'react-bootstrap'
import { VehicleFormState, VehicleValidateFormsStep2 } from '../../utilities/interfaces';
import { DureeOption } from '../../utilities/selectOptions';


interface PurchaseProps {
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
const Purchase = ({
  formState,
  handleChange
}: PurchaseProps) => {
  return (
    <div>
        <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group controlId='formBasicInput-DateAcquis' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Date acquisition'>
            <Form.Control
            placeholder=' '
            type="date"
            name='DateAcquis'
            value={formState.values.DateAcquis}
            onChange={handleChange}
            className={formState.validations.DateAcquis ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-Taxe' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Taxe véhicule neuf'>
            <Form.Control
            placeholder=' '
            type="text"
            name='Taxe'
            value={formState.values.Taxe}
            onChange={handleChange}
            className={formState.validations.Taxe ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId='formBasicInput-TotalAchat' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Total achat'>
            <Form.Control
            placeholder=' '
            type="text"
            name='TotalAchat'
            value={formState.values.TotalAchat}
            onChange={handleChange}
            className={formState.validations.TotalAchat ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        
        </Row>       


        </Form>
      
    </div>
  )
}

export default Purchase