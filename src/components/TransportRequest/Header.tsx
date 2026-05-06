import React from "react";

type Props = {
  translate: (key: string) => string;
};

export default function TransportRequestHeader({ translate }: Props) {
  return (
    <div className="transport-mobile-header">
      <h2 className="transport-mobile-title">
        {translate("transport_requests")}
      </h2>
      <p className="transport-mobile-subtitle">
        {translate("quick_request_form_for_employees")}
      </p>
    </div>
  );
}