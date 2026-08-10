import React from "react";
import { Badge, Table } from "react-bootstrap";
import { Download, Eye, FileText, Trash2 } from "lucide-react";

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
      return (
        <Badge className="report-status-badge report-status-completed">
          Terminé
        </Badge>
      );

    case "failed":
      return (
        <Badge className="report-status-badge report-status-failed">
          Erreur
        </Badge>
      );

    case "processing":
      return (
        <Badge className="report-status-badge report-status-processing">
          En cours
        </Badge>
      );

    default:
      return (
        <Badge className="report-status-badge report-status-pending">
          En attente
        </Badge>
      );
  }
}

const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({
  reports,
  loading,
  onView,
  onDelete,
}) => {
  return (
    <div className="report-table-shell">
      <Table responsive className="report-history-table">
        <thead>
          <tr>
            <th>Rapport ID</th>
            <th>Nom du rapport</th>
            <th>Catégorie</th>
            <th>Paramètres</th>
            <th>Utilisateur</th>
            <th>Date</th>
            <th>Statut</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8}>
                <div className="report-table-state">
                  <span className="report-loading-dot" />
                  Chargement des rapports...
                </div>
              </td>
            </tr>
          ) : reports.length > 0 ? (
            reports.map((report) => {
              const params = parseParams(report.parameters_json);

              return (
                <tr key={report.id_report}>
                  <td>
                    <span className="report-id">#{report.id_report}</span>
                  </td>

                  <td>
                    <div className="report-name-cell">
                      <div className="report-file-icon">
                        <FileText size={18} />
                      </div>
                      <div>
                        <strong>{report.report_name}</strong>
                        <div className="report-row-meta">
                          {report.category} · {report.format || "Excel"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <Badge className="report-category-badge">
                      {report.category}
                    </Badge>
                  </td>

                  <td>
                    {Object.keys(params).length > 0 ? (
                      <div className="report-param-list">
                        {Object.entries(params).map(([key, value]) => (
                          <Badge key={key} className="report-param-badge">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="report-muted-text">-</span>
                    )}
                  </td>

                  <td>{report.username || "GEOT"}</td>

                  <td className="report-date-cell">
                    {formatDate(report.created_at)}
                  </td>

                  <td>{getStatusBadge(report.status)}</td>

                  <td>
                    <div className="report-action-group">
                      {report.file_url && (
                        <button
                          type="button"
                          className="report-action-btn report-action-download"
                          title="Télécharger"
                          aria-label="Télécharger"
                          onClick={() =>
                            window.open(report.file_url || "", "_blank")
                          }
                        >
                          <Download size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="report-action-btn report-action-view"
                        title="Voir"
                        aria-label="Voir"
                        onClick={() => onView(report.id_report)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        className="report-action-btn report-action-delete"
                        title="Supprimer"
                        aria-label="Supprimer"
                        onClick={() => onDelete(report.id_report)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8}>
                <div className="report-table-state">
                  Aucun rapport trouvé
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportHistoryTable;
