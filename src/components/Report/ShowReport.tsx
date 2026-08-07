import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { ReportHistoryRow } from "./ReportHistoryTable";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface ShowReportProps {
  show: boolean;
  onHide: () => void;
  reportId: number | null;
  fakeReports?: ReportHistoryRow[];
  useFakeMode?: boolean;
}

function formatDate(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("fr-FR");
}

function parseParams(params: any) {
  if (!params) return {};
  if (typeof params === "string") {
    try {
      return JSON.parse(params);
    } catch {
      return {};
    }
  }
  return params;
}

const ShowReport: React.FC<ShowReportProps> = ({
  show,
  onHide,
  reportId,
  fakeReports = [],
  useFakeMode = true,
}) => {
  const [report, setReport] = useState<ReportHistoryRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !reportId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);

        if (useFakeMode) {
          const found = fakeReports.find((r) => r.id_report === reportId) || null;
          setReport(found);
          return;
        }

        const username = localStorage.getItem("Geopusername");
        if (!username) {
          toast.error("Utilisateur non détecté", { transition: Bounce });
          return;
        }

        const params = new URLSearchParams();
        params.append("username", username);

        const res = await fetch(
          `${backendUrl}/api/geop/reports/show/${reportId}?${params.toString()}`
        );

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Erreur serveur");

        setReport(data);
      } catch (e: any) {
        toast.error(
          `Erreur chargement rapport${e?.message ? ` (${e.message})` : ""}`,
          { transition: Bounce }
        );
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [show, reportId, fakeReports, useFakeMode]);

  const params = parseParams(report?.parameters_json);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détail du rapport</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        ) : !report ? (
          <div className="text-muted">Rapport introuvable.</div>
        ) : (
          <>
            <div className="mb-3">
              <h5 className="mb-1">{report.report_name}</h5>
              <div className="text-muted">{report.report_key}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Catégorie :</strong> {report.category}
              </div>
              <div className="col-md-6">
                <strong>Format :</strong> {report.format || "Excel"}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <strong>Date :</strong> {formatDate(report.created_at)}
              </div>
              <div className="col-md-6">
                <strong>Statut :</strong>{" "}
                <Badge
                  bg={
                    report.status === "completed"
                      ? "success"
                      : report.status === "failed"
                      ? "danger"
                      : report.status === "processing"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {report.status}
                </Badge>
              </div>
            </div>

            <hr />

            <strong>Paramètres utilisés</strong>

            <div className="mt-2 d-flex flex-wrap gap-2">
              {Object.keys(params).length > 0 ? (
                Object.entries(params).map(([key, value]) => (
                  <Badge bg="light" text="dark" key={key}>
                    {key}: {String(value)}
                  </Badge>
                ))
              ) : (
                <span className="text-muted">Aucun paramètre.</span>
              )}
            </div>

            {report.error_message && (
              <div className="alert alert-danger mt-3">
                {report.error_message}
              </div>
            )}

            {report.file_url && (
              <div className="mt-3">
                <Button
                  onClick={() => window.open(report.file_url || "", "_blank")}
                >
                  Télécharger le fichier
                </Button>
              </div>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowReport;