import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import AddressAutocompleteInput from "./AddressAutocompleteInput";

type Props = {
  translate: (key: string) => string;
  departureDatetime: string | null;
  departureLocation: string;
  dateError: string | null;
  formatToDatetimeLocal: (value: string | null | undefined) => string;
  onDateChange: (name: string, value: string) => void;
  onTextChange: (name: "departure_location", value: string) => void;
  onOpenMap: () => void;
};

export default function TransportRequestDepartureCard({
  translate,
  departureDatetime,
  departureLocation,
  dateError,
  formatToDatetimeLocal,
  onDateChange,
  onTextChange,
  onOpenMap,
}: Props) {
  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-location-dot"></i>
          </span>
          {translate("Departure")}
        </div>

        <Form.Group className="form-group">
          <Form.Label>{translate("Departure Time")} *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formatToDatetimeLocal(departureDatetime)}
            onChange={(e) =>
              onDateChange("departure_datetime", e.target.value)
            }
            isInvalid={!!dateError}
          />
        </Form.Group>

        <div className="location-field-with-map">
          <AddressAutocompleteInput
            translate={translate}
            controlId="departure-location"
            label={translate("Departure Point")}
            placeholder={translate("Enter departure point")}
            required
            value={departureLocation}
            onChange={(value) => onTextChange("departure_location", value)}
          />
          <Button
            type="button"
            variant="outline-primary"
            className="location-map-button"
            onClick={onOpenMap}
          >
            <i className="fas fa-map-marker-alt"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
