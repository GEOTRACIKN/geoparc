import React from "react";
import { Col, Row } from "react-bootstrap";
import { Car, Fuel, ShieldCheck, WalletCards } from "lucide-react";

const kpis = [
  {
    label: "Rapports générés",
    value: "128",
    helper: "+14 ce mois",
    icon: <Car size={24} />,
    tone: "amber",
  },
  {
    label: "Consommation carburant",
    value: "18 450 L",
    helper: "-6% vs mois précédent",
    icon: <Fuel size={24} />,
    tone: "blue",
  },
  {
    label: "Dépenses totales",
    value: "1 245 000 DZD",
    helper: "+12% vs mois précédent",
    icon: <WalletCards size={24} />,
    tone: "green",
  },
  {
    label: "Score sécurité",
    value: "78 / 100",
    helper: "3 conducteurs à risque",
    icon: <ShieldCheck size={24} />,
    tone: "red",
  },
];

const ReportKpiCards: React.FC = () => {
  return (
    <Row className="report-kpi-row">
      {kpis.map((kpi) => (
        <Col md={6} xl={3} className="mb-3" key={kpi.label}>
          <div className={`report-kpi-card report-kpi-${kpi.tone}`}>
            <div className="report-kpi-icon">{kpi.icon}</div>

            <div className="report-kpi-content">
              <div className="report-kpi-label">{kpi.label}</div>
              <div className="report-kpi-value">{kpi.value}</div>
              <div className="report-kpi-helper">{kpi.helper}</div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default ReportKpiCards;
