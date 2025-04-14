import { FloatingLabel, Form, Row } from "react-bootstrap"
import { ContentTabProps } from "../../utilities/interfaces"

const Assurance = ({
  formState,
  handleChange
}:ContentTabProps) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group
            controlId="formBasicInput-AgenceAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Agence assurancen">
              <Form.Control
                placeholder=" "
                type="text"
                name="AgenceAssurance"
                value={formState.values.AgenceAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.AgenceAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicInput-CoutAss" className="mt-2 col-md-6 col-xl-3">
            <FloatingLabel
              controlId="floatingSelect"
              label="Coût assurance"
            >
              <Form.Control
                placeholder=" "
                type="text"
                name="CoutAss"
                value={formState.values.CoutAss}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.CoutAss ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
      
          <Form.Group
            controlId="formBasicInput-TypeAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Type assurance">
              <Form.Control
                placeholder=" "
                type="text"
                name="TypeAssurance"
                value={formState.values.TypeAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.TypeAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group
            controlId="formBasicInput-DelaiAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Délai (Mois)">
              <Form.Control
                placeholder=" "
                type="text"
                name="DelaiAssurance"
                value={formState.values.DelaiAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DelaiAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            controlId="formBasicInput-DateDebutAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Date début">
              <Form.Control
                placeholder=" "
                type="date"
                name="DateDebutAssurance"
                value={formState.values.DateDebutAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateDebutAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group
            controlId="formBasicInput-ReferenceAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Référence">
              <Form.Control
                placeholder=" "
                type="text"
                name="ReferenceAssurance"
                value={formState.values.ReferenceAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.ReferenceAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
       
          <Form.Group
            controlId="formBasicInput-DateExpAssurance"
            className="mt-2 col-md-6 col-xl-3"
          >
            <FloatingLabel controlId="floatingSelect" label="Date expiration">
              <Form.Control
                placeholder=" "
                type="date"
                name="DateExpAssurance"
                value={formState.values.DateExpAssurance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateExpAssurance ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
      </Form>
  )
}

export default Assurance