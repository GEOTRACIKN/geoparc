import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { components } from "react-select";

interface SelectParkProps {
  controlId: string;
  label: string;
  icon: string;
  options: any[];
  valueType: { value: any; label: any };
  onChange?: (selectedOption: any) => void;
  handleCategoryChange?: (selectedOption: any) => void;
  placeholder?: string; // Add placeholder prop
  noOptionsMessage?: string;
  col?: string; 
  name?: string; 
}

const SelectPark: React.FC<SelectParkProps> = ({
  controlId,
  label,
  icon,
  options,
  valueType,
  onChange,
  handleCategoryChange,
  placeholder, // Add placeholder to the destructuring
  noOptionsMessage,
  name
}) => {
  const DropdownIndicator = (props: any) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <i className={`las la-${icon}`} style={{ marginRight: '8px' }}></i>
            {props.children}
          </div>
        </components.DropdownIndicator>
      )
    );
  };

  // Custom function to render no options message
  const renderNoOptionsMessage = ({ inputValue, ...props }: { inputValue: string }) => {
    return (
      <div {...props}>
        {noOptionsMessage ? noOptionsMessage.replace("{inputValue}", inputValue) : "Aucune option pour " + inputValue} 
      </div>
    );
  };

  return (
    <Form.Group controlId={controlId} as={Row} style={{marginTop:"15px"}}>
      <Form.Label column sm="1" md="1" lg="1" className="text-md-end text-left">
        {label}
      </Form.Label>
      <Col sm="11" md="11" lg="11"> 
        <Select
          options={options}
          value={valueType}
          name={name} //
          onChange={onChange || handleCategoryChange}
          components={{ DropdownIndicator }}
          className="w-100"
          id={name} // Set width to 100% 
          placeholder={placeholder} // Set placeholder
          noOptionsMessage={renderNoOptionsMessage} 
        />
      </Col>
    </Form.Group>
  );
};

export default SelectPark;
