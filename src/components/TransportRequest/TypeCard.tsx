import React from "react";
import { Card } from "react-bootstrap";
import { TransportTripType } from "../../types/transportRequest.types";

type Props = {
  translate: (key: string) => string;
  tripType: TransportTripType;
  requestType: "Normal" | "Urgent";
  onTripTypeChange: (value: TransportTripType) => void;
  onChange: (value: "Normal" | "Urgent") => void;
};

export default function TransportRequestTypeCard({
  translate,
  tripType,
  requestType,
  onTripTypeChange,
  onChange,
}: Props) {
  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-route"></i>
          </span>
          {translate("trip_type")}
        </div>

        <div
          className="request-type-box trip-type-box"
          role="group"
          aria-label={translate("trip_type")}
        >
          <button
            type="button"
            className={`request-type-btn ${
              tripType === "one_way" ? "active one-way" : ""
            }`}
            aria-pressed={tripType === "one_way"}
            onClick={() => onTripTypeChange("one_way")}
          >
            <i className="fas fa-arrow-right me-2" aria-hidden="true"></i>
            {translate("one_way")}
          </button>

          <button
            type="button"
            className={`request-type-btn ${
              tripType === "round_trip" ? "active round-trip" : ""
            }`}
            aria-pressed={tripType === "round_trip"}
            onClick={() => onTripTypeChange("round_trip")}
          >
            <i className="fas fa-exchange-alt me-2" aria-hidden="true"></i>
            {translate("round_trip")}
          </button>
        </div>

        <div className="request-type-separator" />

        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-bolt"></i>
          </span>
          {translate("request_type")}
        </div>

        <div
          className="request-type-box"
          role="group"
          aria-label={translate("request_type")}
        >
          <button
            type="button"
            className={`request-type-btn ${
              requestType === "Normal" ? "active normal" : ""
            }`}
            aria-pressed={requestType === "Normal"}
            onClick={() => onChange("Normal")}
          >
            {translate("Normal")}
          </button>

          <button
            type="button"
            className={`request-type-btn ${
              requestType === "Urgent" ? "active urgent" : ""
            }`}
            aria-pressed={requestType === "Urgent"}
            onClick={() => onChange("Urgent")}
          >
            {translate("Urgent")}
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}
