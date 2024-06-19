import React from "react";
import { Form, Button } from "react-bootstrap";

const Step3 = (props:any) => {
  if (props.currentStep !== 3) {
    return null;
  }

  return (
    <>
      <p>We recommend creating a secure password for your account</p>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          value={props.password} // Prop: The password input data
          onChange={props.handleChange} // Prop: Puts data into the state
        />
      </Form.Group>
    </>
  );
};

export default Step3;
