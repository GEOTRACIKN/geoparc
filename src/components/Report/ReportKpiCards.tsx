import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaCar, FaGasPump, FaShieldAlt, FaWallet } from "react-icons/fa";

const kpis = [
  {
    label: "Rapports générés",
    value: "128",
    helper: "+14 ce mois",
    icon: <FaCar />,
    color: "#f97316",
  },
  {
    label: "Consommation carburant",
    value: "18 450 L",
    helper: "-6% vs mois précédent",
    icon: <FaGasPump />,
    color: "#2563eb",
  },
  {
    label: "Dépenses totales",
    value: "1 245 000 DZD",
    helper: "+12% vs mois précédent",
    icon: <FaWallet />,
    color: "#16a34a",
  },
  {
    label: "Score sécurité",
    value: "78 / 100",
    helper: "3 conducteurs à risque",
    icon: <FaShieldAlt />,
    color: "#dc2626",
  },
];

const ReportKpiCards: React.FC = () => {
  return (
    <Row className="mb-3">
      {kpis.map((kpi) => (
        <Col md={6} xl={3} className="mb-3" key={kpi.label}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: `${kpi.color}14`,
                  color: kpi.color,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                }}
              >
                {kpi.icon}
              </div>

              <div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {kpi.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>
                  {kpi.value}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {kpi.helper}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ReportKpiCards;