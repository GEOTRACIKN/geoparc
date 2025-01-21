
import {Form } from "react-bootstrap";

// Définition des types pour chaque champ
interface Field {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'tel' | 'email'| 'file';
    placeholder?: string;
    options?: string[];
    icon: string;
    required?: boolean;
  }
  

const  FieldInput: React.FC<{
    field: Field;
    value: any;
    onChange: (id: string, value: any) => void;
  }> = ({ field, value, onChange }) => {
    if (field.type === 'select' && field.options) {
      return (
        <Form.Group className="form-group" controlId={field.id}>
          <Form.Label>
            <i className={field.icon}></i> {field.label}
          </Form.Label>
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
        </Form.Group>
      );
    }
    return (
      <Form.Group className="form-group" controlId={field.id}>
        <Form.Label>
          <i className={field.icon}></i> {field.label}
        </Form.Label>
        <Form.Control
          type={field.type}
          name={field.id}
          value={value || ""}
          placeholder={field.placeholder || ""}
          required={field.required}
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      </Form.Group>
    );
  };
  export default FieldInput