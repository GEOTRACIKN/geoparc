import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

// Définir une interface pour les props du composant
interface InvalidInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
  errorMessage?: string;
  className?: string;
  placeholder?: string;
  showValid?: boolean;
}

interface SelectorProps {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isValid: boolean;
  errorMessage?: string;
  className?: string;
  showValid?: boolean;
}

// Composant fonctionnel qui affiche un input avec la classe 'is-invalid' si nécessaire
export const InvalidInput: React.FC<InvalidInputProps> = ({ label, name, value, onChange, isValid, errorMessage,className,placeholder,showValid }) => {
  return (
    <Form.Group controlId={`formBasicInput-${name}`} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
      placeholder={placeholder}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!isValid}
        className={ showValid ?`is-valid` : ''}
        
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
export const InvalidInputFloating: React.FC<InvalidInputProps> = ({ label, name, value, onChange, isValid, errorMessage,className,placeholder,showValid }) => {
  return (
    
    <Form.Group controlId={`formBasicInput-${name}`} className={`mt-2 ${className}`}>
      <FloatingLabel controlId="floatingSelect" label={label}>
      <Form.Control
      placeholder={placeholder}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={!isValid}
      className={ showValid ?`is-valid` : ''}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </FloatingLabel>
    </Form.Group>
  );
};

export const Selector: React.FC<SelectorProps> = ({ label, name, value, options, onChange, isValid, errorMessage,className,showValid }) => {
  return (
    <Form.Group controlId={`formBasicSelect-${name}`} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        as="select"
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!isValid}
        className={ showValid ?`is-valid` : ''}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
export const SelectorFloating: React.FC<SelectorProps> = ({ label, name, value, options, onChange, isValid, errorMessage,className,showValid }) => {
  return (
    <Form.Group controlId={`formBasicSelect-${name}`} className={`mt-2 ${className}`}>
      <FloatingLabel controlId="floatingSelect" label={label}>
      <Form.Select
        as="select"
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!isValid}
        className={ showValid ?`is-valid` : ''}
        >
        <option value="">Sélectionnez une option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      </FloatingLabel>
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
