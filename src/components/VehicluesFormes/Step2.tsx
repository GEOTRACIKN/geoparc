import React from "react";
import { Form } from "react-bootstrap";

const Step2 = (props:any) => {
  if (props.currentStep !== 2) {
    return null;
  }

  return (
    <>
      <p>What should we call you?</p>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          id="username"
          placeholder="Enter your Username"
          value={props.username} // Prop: The username input data
          onChange={props.handleChange} // Prop: Puts data into the state
        />
      </Form.Group>
    </>
  );
};

export default Step2;
