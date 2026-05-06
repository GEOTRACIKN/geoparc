import React from "react";
import { Card, Form } from "react-bootstrap";

type Props = {
  translate: (key: string) => string;
  objectRequest: string;
  requesterPhone: string;
  requesterEmail: string;
  onTextChange: (
    name: "object_request" | "requester_phone" | "requester_email",
    value: string
  ) => void;
};

export default function TransportRequestDetailsCard({
  translate,
  objectRequest,
  requesterPhone,
  requesterEmail,
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

        <Form.Group className="form-group">
          <Form.Label>{translate("Phone Number")} *</Form.Label>
          <Form.Control
            type="text"
            placeholder={translate("Enter phone number")}
            value={requesterPhone}
            onChange={(e) => onTextChange("requester_phone", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group mb-0">
          <Form.Label>{translate("Requester Email")} *</Form.Label>
          <Form.Control
            type="email"
            placeholder="samia.sebaa@sorfert.com"
            value={requesterEmail}
            onChange={(e) => onTextChange("requester_email", e.target.value)}
          />
          <Form.Text className="text-muted">
            {translate("This email will be used to detect the responsible person")}
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}