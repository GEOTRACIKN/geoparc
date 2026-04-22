import React from "react";
import { Card } from "react-bootstrap";

type Props = {
  translate: (key: string) => string;
  requestType: "Normal" | "Urgent";
  onChange: (value: "Normal" | "Urgent") => void;
};

export default function TransportRequestTypeCard({
  translate,
  requestType,
  onChange,
}: Props) {
  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-bolt"></i>
          </span>
          {translate("request_type")}
        </div>

        <div className="request-type-box">
          <button
            type="button"
            className={`request-type-btn ${
              requestType === "Normal" ? "active normal" : ""
            }`}
            onClick={() => onChange("Normal")}
          >
            {translate("Normal")}
          </button>

          <button
            type="button"
            className={`request-type-btn ${
              requestType === "Urgent" ? "active urgent" : ""
            }`}
            onClick={() => onChange("Urgent")}
          >
            {translate("Urgent")}
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}