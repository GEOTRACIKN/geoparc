import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import Select, { components } from "react-select";

interface SelectUserProps {
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
  id?: string; 
}

const SelectUser: React.FC<SelectUserProps> = ({
  controlId,
  icon,
  options,
  valueType,
  onChange,
  handleCategoryChange,
  placeholder, // Add placeholder to the destructuring
  noOptionsMessage,
  name,
  id
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
    <Form.Group controlId={controlId} as={Row} >
        <Select
          options={options}
          value={valueType}
          name={name} 
          onChange={onChange || handleCategoryChange}
          components={{ DropdownIndicator }}
          className="w-100"
          id={id} 
          placeholder={placeholder} 
          noOptionsMessage={renderNoOptionsMessage} 
        />
   
    </Form.Group>
  );
};

export default SelectUser;
