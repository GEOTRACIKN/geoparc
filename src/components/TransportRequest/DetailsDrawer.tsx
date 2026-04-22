import React from "react";
import { Badge, Button, Offcanvas } from "react-bootstrap";
import { useTranslate } from "../../hooks/LanguageProvider";
import { TransportRequestListItem } from "../../types/transportRequestList.types";

interface DetailsDrawerProps {
  show: boolean;
  request: TransportRequestListItem | null;
  onClose: () => void;
  onApprove: (request: TransportRequestListItem) => void;
  onReject: (request: TransportRequestListItem) => void;
  onCancel: (request: TransportRequestListItem) => void;
  onCreateMission: (request: TransportRequestListItem) => void;
}

export default function DetailsDrawer({
  show,
  request,
  onClose,
  onApprove,
  onReject,
  onCancel,
  onCreateMission,
}: DetailsDrawerProps) {
  const { translate } = useTranslate();

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge bg="success">{translate("Approved")}</Badge>;
      case "rejected":
        return <Badge bg="danger">{translate("Rejected")}</Badge>;
      case "cancelled":
        return <Badge bg="secondary">{translate("Cancelled")}</Badge>;
      case "mission_created":
        return <Badge bg="primary">{translate("Mission Created")}</Badge>;
      case "pending_fleet_processing":
        return (
          <Badge
            bg=""
            style={{
              backgroundColor: "#fbbf24",
              color: "#fff",
              fontWeight: 600,
              fontSize: "11px",
              padding: "6px 10px",
              borderRadius: "4px",
            }}
          >
            {translate("Pending Fleet")}
          </Badge>
        );
      default:
        return <Badge bg="info">{translate("Pending")}</Badge>;
    }
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" backdrop scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{translate("Request Details")}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {!request ? (
          <div className="text-muted">{translate("No request selected")}</div>
        ) : (
          <>
            <div className="mb-4">
              <div className="mb-3">
                <div className="text-muted small">{translate("Status")}</div>
                <div>{renderStatusBadge(request.status_request)}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Request ID")}</div>
                <div className="fw-semibold">#{request.id_transport_request}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Type")}</div>
                <div>{request.request_type}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Object")}</div>
                <div>{request.object_request || "-"}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Phone")}</div>
                <div>{request.requester_phone || "-"}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Departure")}</div>
                <div>{request.departure_location || "-"}</div>
                <div className="small text-muted">
                  {request.departure_datetime || "-"}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Arrival")}</div>
                <div>{request.arrival_location || "-"}</div>
                <div className="small text-muted">
                  {request.arrival_datetime || "-"}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">{translate("Created At")}</div>
                <div>{request.created_at || "-"}</div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="outline-success"
                onClick={() => onApprove(request)}
                disabled={
                  request.status_request === "approved" ||
                  request.status_request === "cancelled" ||
                  request.status_request === "mission_created"
                }
              >
                {translate("Approve")}
              </Button>

              <Button
                variant="outline-danger"
                onClick={() => onReject(request)}
                disabled={
                  request.status_request === "rejected" ||
                  request.status_request === "cancelled" ||
                  request.status_request === "mission_created"
                }
              >
                {translate("Reject")}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => onCancel(request)}
                disabled={
                  request.status_request === "cancelled" ||
                  request.status_request === "mission_created"
                }
              >
                {translate("Cancel")}
              </Button>

              <Button
                variant="primary"
                onClick={() => onCreateMission(request)}
                disabled={request.status_request !== "approved"}
              >
                {translate("Create Mission")}
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}