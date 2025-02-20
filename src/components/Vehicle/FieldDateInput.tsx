import { Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const FieldDateInput: React.FC<{
  field: Field;
  value: any;
  onChange: (id: string, value: any) => void;
}> = ({ field, value, onChange }) => {
  if (field.type === 'select' && field.options) {
    return (
      <Form.Group className="form-group" controlId={field.id}>
        <Row>
          <Col sm="4">
            <Form.Label>
              <i className={field.icon}></i> {field.label}
            </Form.Label>
          </Col>
          <Col sm="8">
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

  if (field.type === "date") {
    return (
      <Form.Group className="form-group" controlId={field.id}>
        <Row>
          <Col sm="4">
            <Form.Label>
              <i className={field.icon}></i> {field.label}
            </Form.Label>
          </Col>
          <Col sm="8">
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(date) => onChange(field.id, date)}
              dateFormat="dd/MM/yyyy"
              className="form-control w-100"
              isClearable
              placeholderText={field.placeholder || "Sélectionnez une date"}
            />
          </Col>
        </Row>
      </Form.Group>
    );
  }

  return (
    <Form.Group className="form-group" controlId={field.id}>
      <Row>
        <Col sm="4">
          <Form.Label>
            <i className={field.icon}></i> {field.label}
          </Form.Label>
        </Col>
        <Col sm="8">
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

export default FieldDateInput;
