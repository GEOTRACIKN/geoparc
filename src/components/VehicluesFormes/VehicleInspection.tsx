import { FloatingLabel, Form, Row } from "react-bootstrap"
import { ContentTabProps } from "../../utilities/interfaces"

const VehicleInspection = ({
  formState,
  handleChange
}:ContentTabProps) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
    <Row>
      <Form.Group
        controlId="formBasicInput-EtabControle"
        className="mt-2 col-md-6 col-xl-3"
      >
        <FloatingLabel controlId="floatingSelect" label="Etablissement de contrôle">
          <Form.Control
            placeholder=" "
            type="text"
            name="EtabControle"
            value={formState.values.EtabControle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            className={formState.validations.EtabControle ? "is-valid" : ""}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group controlId="formBasicInput-CoutControle" className="mt-2 col-md-6 col-xl-3">
        <FloatingLabel
          controlId="floatingSelect"
          label="Coût contrôle"
        >
          <Form.Control
            placeholder=" "
            type="text"
            name="CoutControle"
            value={formState.values.CoutControle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            className={formState.validations.CoutControle ? "is-valid" : ""}
          />
        </FloatingLabel>
      </Form.Group>
    
      <Form.Group
        controlId="formBasicInput-ReferenceControle"
        className="mt-2 col-md-6 col-xl-3"
      >
        <FloatingLabel controlId="floatingSelect" label="Référence">
          <Form.Control
            placeholder=" "
            type="text"
            name="ReferenceControle"
            value={formState.values.ReferenceControle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            className={formState.validations.ReferenceControle ? "is-valid" : ""}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group
        controlId="formBasicInput-DateControle"
        className="mt-2 col-md-6 col-xl-3"
      >
        <FloatingLabel controlId="floatingSelect" label="Date du contrôle">
          <Form.Control
            placeholder=" "
            type="date"
            name="DateControle"
            value={formState.values.DateControle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            className={formState.validations.DateControle ? "is-valid" : ""}
          />
        </FloatingLabel>
      </Form.Group>
    </Row>
    <Row>
      <Form.Group
        controlId="formBasicInput-DateFinControle"
        className="mt-2 col-md-6 col-xl-3"
      >
        <FloatingLabel controlId="floatingSelect" label="Début Fin">
          <Form.Control
            placeholder=" "
            type="date"
            name="DateFinControle"
            value={formState.values.DateFinControle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            className={formState.validations.DateFinControle ? "is-valid" : ""}
          />
        </FloatingLabel>
      </Form.Group>
    </Row>
  </Form>
  )
}

export default VehicleInspection