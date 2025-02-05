
import { Col, Form, Row } from "react-bootstrap";

// Définition des types pour chaque champ
interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'tel' | 'email' | 'file' | 'SelectGroup';
  placeholder?: string;
  options?: string[];
  icon: string;
  required?: boolean;
}


const FieldInput: React.FC<{
  field: Field;
  value: any;
  onChange: (id: string, value: any) => void;
}> = ({ field, value, onChange }) => {
  if (field.type === 'select' && field.options) {
    return (
      <Form.Group className="form-group" controlId={field.id}>
        <Row>
          <Col column sm="4" md="4" lg="4">
            <Form.Label>
              <i className={field.icon}></i> {field.label}
            </Form.Label>
          </Col>
          <Col sm="8" md="8" lg="8">
            <Form.Control
              as="select"
              name={field.id}
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
            >
              <option value="">Sélectionnez une option</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Row>
      </Form.Group>
    );
  }
  return (
    <Form.Group className="form-group" controlId={field.id}>
      <Row>
        <Col column sm="4" md="4" lg="4">
          <Form.Label>
            <i className={field.icon}></i> {field.label}
          </Form.Label>
        </Col>
        <Col sm="8" md="8" lg="8">
          <Form.Control
            type={field.type}
            name={field.id}
            value={value || ""}
            placeholder={field.placeholder || ""}
            required={field.required}
            onChange={(e) => onChange(field.id, e.target.value)}
          />
        </Col>
      </Row>
    </Form.Group>
  );
};
export default FieldInput