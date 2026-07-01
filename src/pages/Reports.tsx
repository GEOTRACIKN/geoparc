import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast, Bounce } from "react-toastify";

import AddReport from "../components/Report/AddReport";
import ShowReport from "../components/Report/ShowReport";
import DeleteReport from "../components/Report/DeleteReport";
import ReportKpiCards from "../components/Report/ReportKpiCards";
import ReportHistoryTable, {
  ReportHistoryRow,
} from "../components/Report/ReportHistoryTable";

import "../components/Report/report.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const USE_FAKE_DATA = true;

const fakeReports: ReportHistoryRow[] = [
  {
    id_report: 1023,
    report_key: "fuel_monthly",
    report_name: "Consommation mensuelle carburant",
    category: "Carburants",
    parameters_json: {
      année: "2026",
      "sous-parc": "Tous",
      format: "Excel",
    },
    format: "Excel",
    status: "completed",
    file_url: null,
    error_message: null,
    created_at: "2026-02-12 10:07:00",
    username: "GEOT",
  },
  {
    id_report: 1011,
    report_key: "driver_hse",
    report_name: "Comportement conducteur HSE",
    category: "Conducteurs",
    parameters_json: {
      véhicule: "102",
      période: "Mois dernier",
      format: "PDF",
    },
    format: "PDF",
    status: "completed",
    file_url: null,
    error_message: null,
    created_at: "2026-02-03 15:45:00",
    username: "GEOT",
  },
  {
    id_report: 1007,
    report_key: "vehicle_monthly",
    report_name: "Rapport mensuel véhicule",
    category: "Véhicules",
    parameters_json: {
      année: "2025",
      mois: "Décembre",
      format: "Excel",
    },
    format: "Excel",
    status: "failed",
    file_url: null,
    error_message: "Erreur de génération du fichier",
    created_at: "2026-01-05 11:22:00",
    username: "GEOT",
  },
  {
    id_report: 999,
    report_key: "budget_expenses",
    report_name: "Budget & Dépenses",
    category: "Budget",
    parameters_json: {
      année: "2026",
      période: "Mensuel",
      format: "PDF",
    },
    format: "PDF",
    status: "completed",
    file_url: null,
    error_message: null,
    created_at: "2026-01-28 09:10:00",
    username: "GEOT",
  },
];

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      if (USE_FAKE_DATA) {
        let list = [...fakeReports];

        if (filterId.trim()) {
          const cleanId = filterId.trim().replace("#", "");
          list = list.filter((report) =>
            String(report.id_report).includes(cleanId)
          );
        }

        if (filterName.trim()) {
          const cleanName = filterName.trim().toLowerCase();
          list = list.filter((report) =>
            report.report_name.toLowerCase().includes(cleanName)
          );
        }

        if (filterDate) {
          list = list.filter((report) => {
            const reportDate = String(report.created_at).slice(0, 10);
            return reportDate === filterDate;
          });
        }

        if (category) {
          list = list.filter((report) => report.category === category);
        }

        if (status) {
          list = list.filter((report) => report.status === status);
        }

        setReports(list);
        setTotal(list.length);
        setPageCount(1);
        return;
      }

      const username = (localStorage.getItem("Geopusername") || "").trim();

      if (!username) {
        toast.error("Utilisateur non détecté", { transition: Bounce });
        setReports([]);
        setTotal(0);
        setPageCount(1);
        return;
      }

      const params = new URLSearchParams();
      params.append("username", username);
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("id_report", filterId.trim());
      params.append("report_name", filterName.trim());
      params.append("date", filterDate);
      params.append("category", category);
      params.append("status", status);
      params.append("_rk", String(reloadKey));

      const res = await fetch(
        `${backendUrl}/api/geop/reports/list?${params.toString()}`
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Erreur serveur");
      }

      const list: ReportHistoryRow[] = Array.isArray(data?.list)
        ? data.list
        : [];

      const totalCount = Number(data?.total ?? list.length ?? 0);
      const totalPages = Number(
        data?.totalPages ?? Math.ceil(totalCount / limit) ?? 1
      );

      setReports(list);
      setTotal(totalCount);
      setPageCount(Math.max(1, totalPages));
    } catch (e: any) {
      toast.error(
        `Erreur lors de la récupération des rapports${
          e?.message ? ` (${e.message})` : ""
        }`,
        { transition: Bounce }
      );

      setReports([]);
      setTotal(0);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    filterId,
    filterName,
    filterDate,
    category,
    status,
    reloadKey,
  ]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const refreshList = () => {
    setPage(1);
    setReloadKey((previous) => previous + 1);
  };

  const resetFilters = () => {
    setFilterId("");
    setFilterName("");
    setFilterDate("");
    setCategory("");
    setStatus("");
    setPage(1);
  };

  return (
    <div className="reports-page">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="mb-1 report-title">Rapports & Statistiques</h4>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Centre de génération et suivi des rapports GeoParc.
          </div>
        </div>

        <Button className="report-main-btn" onClick={() => setShowAdd(true)}>
          + Créer un rapport
        </Button>
      </div>

      <ReportKpiCards />

      <div className="report-table-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-0">Historique des rapports générés</h5>
            <div className="text-muted" style={{ fontSize: 13 }}>
              Affichage {reports.length} sur {total}
            </div>
          </div>

          <select
            className="form-select report-filter-input"
            style={{ width: 110 }}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="report-filter-card mb-3">
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="report-filter-label">ID rapport</label>
              <input
                className="form-control report-filter-input"
                placeholder="#1023"
                value={filterId}
                onChange={(e) => {
                  setFilterId(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-3">
              <label className="report-filter-label">Nom du rapport</label>
              <input
                className="form-control report-filter-input"
                placeholder="Ex: carburant, budget, HSE..."
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-2">
              <label className="report-filter-label">Date</label>
              <input
                type="date"
                className="form-control report-filter-input"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-2">
              <label className="report-filter-label">Catégorie</label>
              <select
                className="form-select report-filter-input"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Toutes</option>
                <option value="Véhicules">Véhicules</option>
                <option value="Carburants">Carburants</option>
                <option value="Conducteurs">Conducteurs</option>
                <option value="Missions">Missions</option>
                <option value="Budget">Budget</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="report-filter-label">Statut</label>
              <select
                className="form-select report-filter-input"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="failed">Erreur</option>
              </select>
            </div>

            <div className="col-md-1">
              <Button
                variant="light"
                className="w-100 report-reset-btn"
                onClick={resetFilters}
                title="Réinitialiser les filtres"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        <ReportHistoryTable
          reports={reports}
          loading={loading}
          onView={(id) => {
            setSelectedReportId(id);
            setShowView(true);
          }}
          onDelete={(id) => {
            setSelectedReportId(id);
            setShowDelete(true);
          }}
        />

        <ReactPaginate
          pageCount={pageCount}
          forcePage={page - 1}
          onPageChange={(event) => setPage(event.selected + 1)}
          containerClassName="pagination justify-content-end report-pagination mt-3"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          previousLabel="préc."
          nextLabel="suiv."
        />
      </div>

      <AddReport
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onSuccess={refreshList}
        useFakeMode={USE_FAKE_DATA}
      />

      <ShowReport
        show={showView}
        reportId={selectedReportId}
        onHide={() => {
          setShowView(false);
          setSelectedReportId(null);
        }}
        fakeReports={fakeReports}
        useFakeMode={USE_FAKE_DATA}
      />

      <DeleteReport
        show={showDelete}
        reportId={selectedReportId}
        onHide={() => {
          setShowDelete(false);
          setSelectedReportId(null);
        }}
        onSuccess={refreshList}
        useFakeMode={USE_FAKE_DATA}
      />
    </div>
  );
};

export default ReportsPage;