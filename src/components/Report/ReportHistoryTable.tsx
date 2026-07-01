import React from "react";
import { Badge, Table } from "react-bootstrap";
import { FaDownload, FaEye, FaTrash } from "react-icons/fa";

export type ReportStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ReportHistoryRow = {
  id_report: number;
  report_key: string;
  report_name: string;
  category: string;
  parameters_json?: Record<string, any> | string | null;
  format?: string | null;
  status: ReportStatus | string;
  file_url?: string | null;
  error_message?: string | null;
  created_at: string;
  username?: string | null;
};

interface ReportHistoryTableProps {
  reports: ReportHistoryRow[];
  loading: boolean;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseParams(params: ReportHistoryRow["parameters_json"]) {
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

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="report-status-badge report-status-completed">✓ Terminé</Badge>;

    case "failed":
      return <Badge className="report-status-badge report-status-failed">× Erreur</Badge>;

    case "processing":
      return <Badge className="report-status-badge report-status-processing">En cours</Badge>;

    default:
      return <Badge className="report-status-badge report-status-pending">En attente</Badge>;
  }
}

const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({
  reports,
  loading,
  onView,
  onDelete,
}) => {
  return (
    <Table hover responsive className="text-center report-history-table">
      <thead>
        <tr>
          <th>Rapport ID</th>
          <th>Nom du rapport</th>
          <th>Catégorie</th>
          <th>Paramètres</th>
          <th>Utilisateur</th>
          <th>Date</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="text-muted py-4">
              Chargement...
            </td>
          </tr>
        ) : reports.length > 0 ? (
          reports.map((report) => {
            const params = parseParams(report.parameters_json);

            return (
              <tr key={report.id_report}>
                <td className="report-id">#{report.id_report}</td>

                <td className="text-start">
                  <strong>{report.report_name}</strong>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {report.category} • {report.format || "Excel"}
                  </div>
                </td>

                <td>
                  <Badge className="report-orange-badge">
                    {report.category}
                  </Badge>
                </td>

                <td className="text-start">
                  {Object.keys(params).length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(params).map(([key, value]) => (
                        <Badge key={key} className="report-orange-badge">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>

                <td>{report.username || "GEOT"}</td>

                <td>{formatDate(report.created_at)}</td>

                <td>{getStatusBadge(report.status)}</td>

                <td>
                  <div className="d-flex justify-content-center gap-3">
                    {report.file_url && (
                      <FaDownload
                        color="#16a34a"
                        className="report-action-icon"
                        title="Télécharger"
                        onClick={() => window.open(report.file_url || "", "_blank")}
                      />
                    )}

                    <FaEye
                      color="#f97316"
                      className="report-action-icon"
                      title="Voir"
                      onClick={() => onView(report.id_report)}
                    />

                    <FaTrash
                      color="#dc2626"
                      className="report-action-icon"
                      title="Supprimer"
                      onClick={() => onDelete(report.id_report)}
                    />
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8} className="text-muted py-4">
              Aucun rapport trouvé
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ReportHistoryTable;