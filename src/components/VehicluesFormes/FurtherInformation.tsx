import { FloatingLabel, Form, Row } from 'react-bootstrap'
import { ContentTabProps} from '../../utilities/interfaces';


const FurtherInformation = ({
  formState,
  handleChange
}: ContentTabProps) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          {/* Psn */}
          <Form.Group
            controlId="formBasicInput-Psn"
            className="mt-2 col-md-6 col-xl-3 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Psn">
              <Form.Control
                placeholder=" "
                type="text"
                name="Psn"
                value={formState.values.Psn}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Psn ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Power */}
          <Form.Group
            controlId="formBasicInput-Power"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Puissance">
              <Form.Control
                placeholder=" "
                type="text"
                name="Power"
                value={formState.values.Power}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Power ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Year */}
          <Form.Group
            controlId="formBasicInput-Year"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Année">
              <Form.Control
                placeholder=" "
                type="text"
                name="Year"
                value={formState.values.Year}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Year ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/*//! maximum_allowed_total */}
          <Form.Group
            controlId="formBasicInput-maximum_allowed_total"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Poids total autorisé en charge"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="MaximumAllowedTotal"
                value={formState.values.MaximumAllowedTotal}
                onChange={(e: any) => handleChange(e)}
                className={
                  formState.validations.MaximumAllowedTotal ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row className="w-full">
          {/* CirculationDate */}
          <Form.Group
            controlId="formBasicInput-CirculationDate"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Date circulation">
              <Form.Control
                placeholder=" "
                type="date"
                name="CirculationDate"
                value={formState.values.CirculationDate}
                onChange={(e: any) => handleChange(e)}
                className={
                  formState.validations.CirculationDate ? "is-valid" : ""
                }
              />
            </FloatingLabel>
          </Form.Group>

          {/* longueur */}
          <Form.Group
            controlId="formBasicInput-longueur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Longueur en mètres"
            >
              <Form.Control
                placeholder="Longueur (m)"
                type="text"
                name="Longueur"
                value={formState.values.Longueur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Longueur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* NbrePorte */}
          <Form.Group
            controlId="formBasicInput-NbrePorte"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Nombre de Portes">
              <Form.Control
                placeholder=" "
                type="text"
                name="NbrePorte"
                value={formState.values.NbrePorte}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NbrePorte ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* largeur */}
          <Form.Group
            controlId="formBasicInput-largeur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Largeur en mètres">
              <Form.Control
                placeholder="Largeur (m)"
                type="text"
                name="Largeur"
                value={formState.values.Largeur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Largeur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>

        <Row className="w-full">
          {/* NumChassis */}
          <Form.Group
            controlId="formBasicInput-NumChassis"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="N° Chassis du véhicule"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="NumChassis"
                value={formState.values.NumChassis}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NumChassis ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Hauteur */}
          <Form.Group
            controlId="formBasicInput-Hauteur"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Hauteur en mètres">
              <Form.Control
                placeholder="Hauteur (m)"
                type="text"
                name="Hauteur"
                value={formState.values.Hauteur}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Hauteur ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* NbrePlace */}
          <Form.Group
            controlId="formBasicInput-NbrePlace"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Nombre de Places">
              <Form.Control
                placeholder=" "
                type="text"
                name="NbrePlace"
                value={formState.values.NbrePlace}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.NbrePlace ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>

          {/* Weight */}
          <Form.Group
            controlId="formBasicInput-Weight"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel
              controlId="floatingSelect"
              label="Poids du véhicule en kg"
            >
              <Form.Control
                placeholder="Poids (Kg)"
                type="text"
                name="Weight"
                value={formState.values.Weight}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.Weight ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row className="w-full">
          {/* co2 */}
          <Form.Group
            controlId="formBasicInput-co2"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Emission de Co2">
              <Form.Control
                placeholder=" "
                type="text"
                name="co2"
                value={formState.values.co2}
                onChange={(e: any) => handleChange(e)}
                className={formState.validations.co2 ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
      </Form>
  )
}

export default FurtherInformation