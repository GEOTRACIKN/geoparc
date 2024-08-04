import { FloatingLabel, Form, Row } from "react-bootstrap"
import { ContentTabProps } from "../../utilities/interfaces"


const Vignette = ({
  formState,
  handleChange
}:ContentTabProps) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Form.Group
            controlId="formBasicInput-NumVignette"
            className="mt-2 col-md-6"
          >
            <FloatingLabel controlId="floatingSelect" label="N° Vignette">
              <Form.Control
                placeholder=" "
                type="text"
                name="NumVignette"
                value={formState.values.NumVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.NumVignette ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group controlId="formBasicInput-DateVignette" className="mt-2 col-md-6">
            <FloatingLabel
              controlId="floatingSelect"
              label="Date vignette"
            >
              <Form.Control
                placeholder=" "
                type="date"
                name="DateVignette"
                value={formState.values.DateVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.DateVignette ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            controlId="formBasicInput-CoutVignette"
            className="mt-2 col-md-6"
          >
            <FloatingLabel controlId="floatingSelect" label="Coût Vignette">
              <Form.Control
                placeholder=" "
                type="text"
                name="CoutVignette"
                value={formState.values.CoutVignette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                className={formState.validations.CoutVignette ? "is-valid" : ""}
              />
            </FloatingLabel>
          </Form.Group>
        </Row>
      </Form>
  )
}

export default Vignette