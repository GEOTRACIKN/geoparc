import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { components } from "react-select";

interface SelectGroupProps {
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

const SelectGroup: React.FC<SelectGroupProps> = ({
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
    <Form.Group className="form-group" controlId={name}>
      <Row>
      <Col column sm="4" md="4" lg="4">
      <Form.Label>
        <i className={icon}></i> {label}
      </Form.Label>
      </Col>
      <Col sm="8" md="8" lg="8">
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
      </Row>
    </Form.Group>
  );
};

export default SelectGroup;
