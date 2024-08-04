import { FloatingLabel, Form, Row } from 'react-bootstrap'
import { ContentTabProps} from '../../utilities/interfaces';
import { InvalidNumberInput } from './InvalidInput';
import InputFloating from './InputFloating';


const RentCar = ({
  formState,
  handleChange
}: ContentTabProps) => {
  return (
    <>
        <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <InputFloating
            label='Numéro du contrat de location'
            placeholder="N° Contrat (location)"
            name='NumContratL'
            value={formState.values.NumContratL}
            onChangeFunction={handleChange}
          />
          <Form.Group controlId='formBasicInput-NumContratL' className='mt-2 col-md-6 col-xl-3'>
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
          
          <InvalidNumberInput
            className="col-md-6 col-xl-3"
            label="Total location :"
            name="TotalLocation"
            onChange={handleChange}
            value={formState.values.TotalLocation}
          />
          <Form.Group controlId='formBasicInput-FournisseurL' className='mt-2 col-md-6 col-xl-3'>
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
          <Form.Group controlId='formBasicInput-DernierVersement' className='mt-2 col-md-6 col-xl-3'>
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
          <Form.Group controlId='formBasicInput-CoutLocation' className='mt-2 col-md-6 col-xl-3'>
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
          <Form.Group controlId='formBasicInput-DateDebutLocation' className='mt-2 col-md-6 col-xl-3'>
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
            <InvalidNumberInput
            className="col-md-6 col-xl-3"
            label="Nombre de mois :"
            name="NbreMoisLocation"
            onChange={handleChange}
            value={formState.values.NbreMoisLocation}
          />
        </Row>
        </Form>
    </>
  )
}

export default RentCar