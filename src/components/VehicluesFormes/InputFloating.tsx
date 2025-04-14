import { FloatingLabel, Form } from "react-bootstrap";

const InputFloating = ({
  label,
  name,
  value,
  type = 'text',
  placeholder = ' ',
  xl = true,
  onChangeFunction,
}: {
  type?: 'text' | 'date';
  placeholder?: string;
  xl?: boolean;
  label: string;
  name: string;
  value: string;
  onChangeFunction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Form.Group
      controlId={`formBasicInput-${name}`}
      className={`mt-2 col-md-6 ${xl ? 'col-xl-3' : '' } `}
    >
      <FloatingLabel  
          className="text-truncate"
          style={{ maxWidth: '100%' }} 
          controlId="floatingSelect" 
          label={label}
          >
        <Form.Control
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          onChange={onChangeFunction}
        />
      </FloatingLabel>
    </Form.Group>
  );
};

export default InputFloating;