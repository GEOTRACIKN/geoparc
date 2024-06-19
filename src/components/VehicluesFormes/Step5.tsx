import React from "react";
import { Form, Button } from "react-bootstrap";

const Step5 = (props:any) => {
  if (props.currentStep !== 5) {
    return null;
  }

  return (
    <>
      <p>Step5</p>
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

export default Step5;
