import React, { useState } from 'react'
import { FloatingLabel, Form, Row } from 'react-bootstrap'
import { VehicleFormState, VehicleValidateFormsStep2 } from '../../utilities/interfaces';
import { DureeOption } from '../../utilities/selectOptions';


interface RentCarProps {
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
const RentCar = ({
  formState,
  handleChange
}: RentCarProps) => {
  return (
    <div>
        <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group controlId='formBasicInput-NumContratL' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Numéro du contrat de location'>
            <Form.Control
            placeholder='N° Contrat (location)'
            type="text"
            name='NumContratL'
            value={formState.values.NumContratL}
            onChange={handleChange}
            className={formState.validations.NumContratL ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-TotalLocation' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Total location'>
            <Form.Control
            placeholder=' '
            type="number"
            name='TotalLocation'
            value={formState.values.TotalLocation}
            onChange={handleChange}
            className={formState.validations.TotalLocation ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId='formBasicInput-FournisseurL' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Fournisseur location'>
            <Form.Control
            placeholder=' '
            type="text"
            name='FournisseurL'
            value={formState.values.FournisseurL}
            onChange={handleChange}
            className={formState.validations.FournisseurL ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
          <Form.Group controlId='formBasicInput-DernierVersement' className='mt-2 col-md-6'>
            <FloatingLabel controlId="floatingSelect" label='Dernier versement'>
            <Form.Control
            placeholder=' '
            type="date"
            name='DernierVersement'
            value={formState.values.DernierVersement}
            onChange={handleChange}
            className={formState.validations.DernierVersement ? 'is-valid' : ''}
            />
          </FloatingLabel>
          </Form.Group>
        </Row>       

        <Row className='w-full'>
          <Form.Group controlId='formBasicInput-CoutLocation' className='mt-2 col-md-6'>
              <FloatingLabel controlId="floatingSelect" label='Coût location'>
              <Form.Control
              placeholder='Coût location - mensuel'
              type="text"
              name='CoutLocation'
              value={formState.values.CoutLocation}
              onChange={handleChange}
              className={formState.validations.CoutLocation ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
          
          <Form.Group controlId='formBasicInput-DateDebutLocation' className='mt-2 col-md-6'>
              <FloatingLabel controlId="floatingSelect" label='Date début location'>
              <Form.Control
              placeholder=' '
              type="date"
              name='DateDebutLocation'
              value={formState.values.DateDebutLocation}
              onChange={handleChange}
              className={formState.validations.DateDebutLocation ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
          
        </Row>
        <Row className='w-full'>
          <Form.Group controlId='formBasicInput-NbreMoisLocation' className='mt-2 col-md-6'>
              <FloatingLabel controlId="floatingSelect" label='Nombre de mois'>
              <Form.Control
              placeholder=' '
              type="number"
              name='NbreMoisLocation'
              value={formState.values.NbreMoisLocation}
              onChange={handleChange}
              className={formState.validations.NbreMoisLocation ? 'is-valid' : ''}
              />
            </FloatingLabel>
            </Form.Group>
  
        </Row>


        </Form>
      
    </div>
  )
}

export default RentCar