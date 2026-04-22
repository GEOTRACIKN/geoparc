import React from "react";
import { Card, Form } from "react-bootstrap";

type Props = {
  translate: (key: string) => string;
  objectRequest: string;
  requesterPhone: string;
  onTextChange: (
    name: "object_request" | "requester_phone",
    value: string
  ) => void;
};

export default function TransportRequestDetailsCard({
  translate,
  objectRequest,
  requesterPhone,
  onTextChange,
}: Props) {
  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-clipboard"></i>
          </span>
          {translate("Details")}
        </div>

        <Form.Group className="form-group">
          <Form.Label>{translate("Object")} *</Form.Label>
          <Form.Control
            type="text"
            placeholder={translate("Enter request object")}
            value={objectRequest}
            onChange={(e) => onTextChange("object_request", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group mb-0">
          <Form.Label>{translate("Phone Number")} *</Form.Label>
          <Form.Control
            type="text"
            placeholder={translate("Enter phone number")}
            value={requesterPhone}
            onChange={(e) => onTextChange("requester_phone", e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}