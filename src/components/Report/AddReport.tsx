import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Offcanvas,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import {
  FaCar,
  FaGasPump,
  FaShieldAlt,
  FaUserTie,
  FaWallet,
} from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface AddReportProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  useFakeMode?: boolean;
}

type ReportFieldKey =
  | "year"
  | "month"
  | "period"
  | "subPark"
  | "criteria"
  | "format";

type ReportItem = {
  report_key: string;
  report_name: string;
  category: string;
  description: string;
  fields: ReportFieldKey[];
  endpoint?: string;
};

type ReportCategory = {
  category: string;
  icon: React.ReactNode;
  reports: ReportItem[];
};

const FIELD_CONFIG: Record<
  ReportFieldKey,
  { label: string; options: string[]; helper?: string }
> = {
  year: {
    label: "Année",
    options: ["2026", "2025", "2024", "2023"],
    helper: "Année d’analyse du rapport.",
  },
  month: {
    label: "Mois",
    options: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
  },
  period: {
    label: "Période",
    options: ["Ce mois", "Mois dernier", "Cette année", "Personnalisée"],
  },
  subPark: {
    label: "Sous-parc",
    options: ["Tous", "Parc A", "Parc B", "Parc C"],
    helper: "Tous = ensemble de la flotte.",
  },
  criteria: {
    label: "Critère",
    options: ["Type de véhicule", "État", "Utilisation", "Énergie"],
  },
  format: {
    label: "Format",
    options: ["Excel", "PDF"],
  },
};

const fakeCatalog: ReportCategory[] = [
  {
    category: "Véhicules",
    icon: <FaCar />,
    reports: [
      {
        report_key: "vehicle_list",
        report_name: "Liste des véhicules",
        category: "Véhicules",
        description: "Liste détaillée des véhicules avec état et affectation.",
        endpoint: "/reports/vehicles/list",
        fields: ["subPark", "format"],
      },
      {
        report_key: "vehicle_monthly",
        report_name: "Rapport mensuel véhicule",
        category: "Véhicules",
        description: "Synthèse mensuelle : carburant, entretien, pneus, juridique.",
        endpoint: "/reports/vehicles/monthly",
        fields: ["year", "month", "subPark", "format"],
      },
    ],
  },
  {
    category: "Carburants",
    icon: <FaGasPump />,
    reports: [
      {
        report_key: "fuel_by_vehicle",
        report_name: "Consommation par véhicule",
        category: "Carburants",
        description: "Consommation et coût carburant par véhicule.",
        endpoint: "/reports/fuel/by-vehicle",
        fields: ["year", "subPark", "format"],
      },
      {
        report_key: "fuel_monthly",
        report_name: "Consommation mensuelle",
        category: "Carburants",
        description: "Consommation et coût carburant regroupés par mois.",
        endpoint: "/reports/fuel/monthly",
        fields: ["year", "subPark", "format"],
      },
    ],
  },
  {
    category: "Conducteurs",
    icon: <FaUserTie />,
    reports: [
      {
        report_key: "driver_hse",
        report_name: "Comportement conducteur HSE",
        category: "Conducteurs",
        description: "Score sécurité, accélération, freinage et vitesse.",
        endpoint: "/reports/drivers/hse",
        fields: ["period", "subPark", "format"],
      },
    ],
  },
  {
    category: "Missions",
    icon: <FaShieldAlt />,
    reports: [
      {
        report_key: "missions_report",
        report_name: "Rapport missions",
        category: "Missions",
        description: "Analyse des missions par période et sous-parc.",
        endpoint: "/reports/missions",
        fields: ["year", "period", "subPark", "format"],
      },
    ],
  },
  {
    category: "Budget",
    icon: <FaWallet />,
    reports: [
      {
        report_key: "budget_expenses",
        report_name: "Budget & Dépenses",
        category: "Budget",
        description: "Suivi du budget, dépenses réalisées et reste disponible.",
        endpoint: "/reports/budget/expenses",
        fields: ["year", "period", "subPark", "format"],
      },
    ],
  },
];

const AddReport: React.FC<AddReportProps> = ({
  show,
  onHide,
  onSuccess,
  useFakeMode = true,
}) => {
  const [catalog, setCatalog] = useState<ReportCategory[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    setSelectedReport(null);
    setFormValues({});

    const fetchCatalog = async () => {
      try {
        setCatalogLoading(true);

        if (useFakeMode) {
          setCatalog(fakeCatalog);
          return;
        }

        const res = await fetch(`${backendUrl}/api/geop/reports/catalog`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) throw new Error(data?.message || "Erreur serveur");

        setCatalog(Array.isArray(data?.list) ? data.list : []);
      } catch (e: any) {
        toast.error(
          `Erreur chargement catalogue${e?.message ? ` (${e.message})` : ""}`,
          { transition: Bounce }
        );
        setCatalog([]);
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchCatalog();
  }, [show, useFakeMode]);

  const selectedFields = useMemo(() => {
    if (!selectedReport) return [];
    return selectedReport.fields || [];
  }, [selectedReport]);

  const handleSelectReport = (report: ReportItem) => {
    setSelectedReport(report);

    const defaults: Record<string, string> = {};
    report.fields.forEach((fieldKey) => {
      defaults[fieldKey] = FIELD_CONFIG[fieldKey]?.options?.[0] || "";
    });

    setFormValues(defaults);
  };

  const handleSave = async () => {
    if (!selectedReport) {
      toast.error("Veuillez sélectionner un rapport", { transition: Bounce });
      return;
    }

    const username = localStorage.getItem("Geopusername");

    if (!username && !useFakeMode) {
      toast.error("Utilisateur non détecté", { transition: Bounce });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username,
        report_key: selectedReport.report_key,
        report_name: selectedReport.report_name,
        category: selectedReport.category,
        parameters: formValues,
        format: formValues.format || "Excel",
      };

      if (useFakeMode) {
        console.log("Fake generate report payload:", payload);
        toast.success("Demande de rapport créée visuellement", {
          transition: Bounce,
        });
        onSuccess();
        onHide();
        return;
      }

      const res = await fetch(`${backendUrl}/api/geop/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || "Erreur lors de la création du rapport", {
          transition: Bounce,
        });
        return;
      }

      toast.success("Demande de rapport créée avec succès", {
        transition: Bounce,
      });

      onSuccess();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du rapport", {
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: 980 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Créer un rapport</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {catalogLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" />
            <div className="mt-2 text-muted">Chargement des rapports...</div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <div className="fw-bold">Rapports disponibles</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                Sélectionnez une catégorie puis choisissez le rapport à générer.
              </div>
            </div>

            <Row>
              {catalog.map((cat) => (
                <Col md={6} xl={4} className="mb-3" key={cat.category}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Header className="bg-light d-flex align-items-center gap-2">
                      <span style={{ color: "#f97316" }}>{cat.icon}</span>
                      <strong>{cat.category}</strong>
                      <Badge bg="secondary" className="ms-auto">
                        {cat.reports.length}
                      </Badge>
                    </Card.Header>

                    <Card.Body className="p-0">
                      {cat.reports.map((report) => {
                        const active =
                          selectedReport?.report_key === report.report_key;

                        return (
                          <button
                            key={report.report_key}
                            type="button"
                            className="w-100 text-start border-0 p-3"
                            style={{
                              background: active ? "#fff7ed" : "#fff",
                              borderLeft: active
                                ? "4px solid #f97316"
                                : "4px solid transparent",
                            }}
                            onClick={() => handleSelectReport(report)}
                          >
                            <div className="fw-bold">{report.report_name}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>
                              {report.description}
                            </div>
                          </button>
                        );
                      })}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <hr />

            <div className="mb-3">
              <div className="fw-bold">Paramètres</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {selectedReport
                  ? `${selectedReport.category} • ${selectedReport.report_name}`
                  : "Sélectionnez un rapport pour afficher les paramètres."}
              </div>
            </div>

            {!selectedReport ? (
              <div className="alert alert-light border">
                Aucun rapport sélectionné.
              </div>
            ) : (
              <Form>
                <Row>
                  {selectedFields.map((fieldKey) => {
                    const config = FIELD_CONFIG[fieldKey];

                    return (
                      <Col md={6} xl={3} className="mb-3" key={fieldKey}>
                        <Form.Label>{config.label}</Form.Label>
                        <Form.Select
                          value={formValues[fieldKey] || ""}
                          onChange={(e) =>
                            setFormValues((prev) => ({
                              ...prev,
                              [fieldKey]: e.target.value,
                            }))
                          }
                        >
                          {config.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>

                        {config.helper && (
                          <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                            {config.helper}
                          </div>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              </Form>
            )}
          </>
        )}
      </Offcanvas.Body>

      <div className="border-top p-3 d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>

        <Button onClick={handleSave} disabled={loading || !selectedReport}>
          {loading ? "Création..." : "Générer le rapport"}
        </Button>
      </div>
    </Offcanvas>
  );
};

export default AddReport;