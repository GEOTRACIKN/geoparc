import React from "react";
import { Card, Form } from "react-bootstrap";
import AddressAutocompleteInput from "./AddressAutocompleteInput";

type Props = {
  translate: (key: string) => string;
  arrivalDatetime: string | null;
  arrivalLocation: string;
  dateError: string | null;
  formatToDatetimeLocal: (value: string | null | undefined) => string;
  onDateChange: (name: string, value: string) => void;
  onTextChange: (name: "arrival_location", value: string) => void;
};

export default function TransportRequestArrivalCard({
  translate,
  arrivalDatetime,
  arrivalLocation,
  dateError,
  formatToDatetimeLocal,
  onDateChange,
  onTextChange,
}: Props) {
  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-flag-checkered"></i>
          </span>
          {translate("arrival")}
        </div>

        <Form.Group className="form-group">
          <Form.Label>{translate("arrival_time")} *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formatToDatetimeLocal(arrivalDatetime)}
            onChange={(e) => onDateChange("arrival_datetime", e.target.value)}
            isInvalid={!!dateError}
          />
          {dateError && <div className="invalid-mobile">{dateError}</div>}
        </Form.Group>

        <AddressAutocompleteInput
          translate={translate}
          controlId="arrival-location"
          label={translate("Arrival Point")}
          placeholder={translate("Enter arrival point")}
          required
          value={arrivalLocation}
          onChange={(value) => onTextChange("arrival_location", value)}
        />
      </Card.Body>
    </Card>
  );
}
