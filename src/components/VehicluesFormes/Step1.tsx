import React from "react";
import { Form } from "react-bootstrap";

const Step1 = (props:any) => {
  if (props.currentStep !== 1) {
    return null;
  }

  return (
    <>
      <p>How can we reach you?</p>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          name="email"
          id="email"
          placeholder="Enter your Email"
          value={props.email} // Prop: The email input data
          onChange={props.handleChange} // Prop: Puts data into the state
        />
      </Form.Group>
    </>
  );
};

export default Step1;
