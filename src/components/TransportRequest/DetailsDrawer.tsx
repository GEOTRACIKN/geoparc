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
}

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
  subValue?: React.ReactNode;
}

function InfoItem({ label, value, subValue }: InfoItemProps) {
  return (
    <div className="drawer-info-card">
      <div className="drawer-info-label">{label}</div>
      <div className="drawer-info-value">{value || "-"}</div>
      {subValue ? <div className="drawer-info-subvalue">{subValue}</div> : null}
    </div>
  );
}

export default function DetailsDrawer({
  show,
  request,
  onClose,
  onApprove,
  onReject,
  onCancel,
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
            style={{
              backgroundColor: "#fbbf24",
              color: "#fff",
              fontWeight: 600,
              fontSize: "11px",
              padding: "6px 10px",
              borderRadius: "999px",
            }}
          >
            {translate("Pending Fleet")}
          </Badge>
        );

      default:
        return <Badge bg="info">{translate("Pending")}</Badge>;
    }
  };

  const isApproveDisabled =
    !request ||
    request.status_request === "approved" ||
    request.status_request === "cancelled" ||
    request.status_request === "mission_created";

  const isRejectDisabled =
    !request ||
    request.status_request === "rejected" ||
    request.status_request === "cancelled" ||
    request.status_request === "mission_created";

  const isCancelDisabled =
    !request ||
    request.status_request === "cancelled" ||
    request.status_request === "mission_created";

  return (
    <>
      <Offcanvas
        show={show}
        onHide={onClose}
        placement="end"
        backdrop
        scroll
        className="details-drawer"
      >
        <Offcanvas.Header closeButton className="drawer-header">
          <div className="w-100 pe-4">
            <Offcanvas.Title className="drawer-title">
              {translate("request_details")}
            </Offcanvas.Title>

            {request ? (
              <div className="drawer-subtitle">
                {translate("request")} ID #{request.id_transport_request}
              </div>
            ) : null}
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="drawer-body">
          {!request ? (
            <div className="text-muted">{translate("No request selected")}</div>
          ) : (
            <div className="d-flex flex-column h-100">
              <div className="flex-grow-1">
                <div className="drawer-section">
                  <div className="drawer-section-title">
                    {translate("General Information")}
                  </div>

                  <div className="drawer-info-grid">
                    <InfoItem
                      label={translate("Status")}
                      value={renderStatusBadge(request.status_request)}
                    />
                    <InfoItem
                      label={translate("Type")}
                      value={request.request_type || "-"}
                    />
                    <InfoItem
                      label={translate("Object")}
                      value={request.object_request || "-"}
                    />
                    <InfoItem
                      label={translate("Phone")}
                      value={request.requester_phone || "-"}
                    />
                    <InfoItem
                      label={translate("Departure")}
                      value={request.departure_location || "-"}
                      subValue={request.departure_datetime || "-"}
                    />
                    <InfoItem
                      label={translate("arrival")}
                      value={request.arrival_location || "-"}
                      subValue={request.arrival_datetime || "-"}
                    />
                    <InfoItem
                      label={translate("created_at")}
                      value={request.created_at || "-"}
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-footer-actions">
                <div className="drawer-footer-actions-inner">
                  <Button
                    variant="outline-secondary"
                    onClick={() => onCancel(request)}
                    disabled={isCancelDisabled}
                    className="drawer-footer-btn"
                  >
                    {translate("cancel")}
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => onReject(request)}
                    disabled={isRejectDisabled}
                    className="drawer-footer-btn"
                  >
                    {translate("reject")}
                  </Button>

                  <Button
                    variant="success"
                    onClick={() => onApprove(request)}
                    disabled={isApproveDisabled}
                    className="drawer-footer-btn"
                  >
                    {translate("approve")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <style>
        {`
          .details-drawer {
            width: 50% !important;
            max-width: 50% !important;
            min-width: 50% !important;
          }

          .drawer-header {
            border-bottom: 1px solid #e9ecef;
            padding: 18px 24px;
            background: #fff;
          }

          .drawer-title {
            font-size: 20px;
            font-weight: 700;
            color: #101828;
            margin: 0;
          }

          .drawer-subtitle {
            margin-top: 4px;
            font-size: 13px;
            color: #667085;
          }

          .drawer-body {
            padding: 24px;
            background: #fcfcfd;
          }

          .drawer-section {
            margin-bottom: 16px;
          }

          .drawer-section-title {
            font-size: 14px;
            font-weight: 700;
            color: #344054;
            margin-bottom: 14px;
          }

          .drawer-info-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .drawer-info-card {
            background: #ffffff;
            border: 1px solid #eaecf0;
            border-radius: 14px;
            padding: 14px 16px;
            min-height: 88px;
          }

          .drawer-info-label {
            font-size: 12px;
            font-weight: 600;
            color: #667085;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .drawer-info-value {
            font-size: 14px;
            font-weight: 500;
            color: #101828;
            line-height: 1.5;
            word-break: break-word;
          }

          .drawer-info-subvalue {
            font-size: 12px;
            color: #667085;
            margin-top: 5px;
            word-break: break-word;
          }

          .drawer-footer-actions {
            position: sticky;
            bottom: -24px;
            background: linear-gradient(to top, #fcfcfd 75%, rgba(252,252,253,0.92) 100%);
            padding-top: 18px;
            margin-top: 24px;
          }

          .drawer-footer-actions-inner {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            padding-top: 14px;
            border-top: 1px solid #e9ecef;
            background: transparent;
          }

          .drawer-footer-btn {
            min-width: 120px;
            height: 40px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: none !important;
          }

          @media (max-width: 992px) {
            .details-drawer {
              width: 100% !important;
              max-width: 100% !important;
              min-width: 100% !important;
            }

            .drawer-info-grid {
              grid-template-columns: 1fr;
            }

            .drawer-footer-actions-inner {
              flex-direction: column;
              align-items: stretch;
            }

            .drawer-footer-btn {
              width: 100%;
              min-width: unset;
            }
          }
        `}
      </style>
    </>
  );
}