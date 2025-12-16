import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";

import AddDemandePiece from "../components/DemandePiece/AddDemandePiece";
import ModalEditDemandePiece from "../components/DemandePiece/EditDemandePiece";
import ModalShowDemandePiece from "../components/DemandePiece/ShowDemandePiece";
import ModalDeleteDemandePiece from "../components/DemandePiece/DeleteDemandePiece";

import { FaEye, FaEdit, FaTrash, FaFileExport, FaPrint, FaEyeSlash } from "react-icons/fa";
import {formatDateToTimestamp,generateExcelFile,DownloadModal,generateBonPDF,generatePDFFile} from "../functions";


const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

interface DemandePiece {
  id_demande_piece: number;
  type: string;
  categorie: string;
  statut: string;
  client?: string;
  num_bon?: string;
  quantite?: number;
  prix?: number;
  commentaire?: string;
  date_creation?: string | null;
}

const DemandePiecePage: React.FC = () => {
  const { translate } = useTranslate();

  const [demandes, setDemandes] = useState<DemandePiece[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [typeSearch, setTypeSearch] = useState<string>("ID");
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("id_demande_piece");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [pageCount, setPageCount] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const initialColumns = {
    id: true,
    type: true,
    categorie: true,
    date_creation: true,
    statut: true,
    client: true,
    num_bon: true,
  };

  const [selectedColumns, setSelectedColumns] = useState<{
    [k in keyof typeof initialColumns]: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem("selectedColumnsDemande");
      return saved ? JSON.parse(saved) : initialColumns;
    } catch {
      return initialColumns;
    }
  });

  const menuItems = [
    translate("ID"),
    translate("Type"),
    translate("Categorie"),
    translate("Date création"),
    translate("Statut"),
  ];

  const toggleColumn = (key: keyof typeof initialColumns) => {
    const updated = { ...selectedColumns, [key]: !selectedColumns[key] };
    setSelectedColumns(updated);
    localStorage.setItem("selectedColumnsDemande", JSON.stringify(updated));
  };

  const fetchDemandes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (search) params.append("search", search);
      params.append("sortColumn", sortColumn);
      params.append("sortOrder", sortOrder);

      const res = await fetch(
        `${backendUrl}/api/geop/listdemandepiece/${geopuserID}?${params.toString()}`
      );
      if (!res.ok) throw new Error("Erreur récupération demandes");
      const data = await res.json();
      setDemandes(data.demandes || []);
      setTotal(data.total ?? (data.demandes ? data.demandes.length : 0));
      setPageCount(Math.max(1, Math.ceil((data.total ?? (data.demandes ? data.demandes.length : 0)) / limit)));
    } catch (err) {
      console.error(err);
      toast.error(translate("Erreur lors de la récupération des demandes"), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortColumn, sortOrder, translate]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const handlePageClick = (data: any) => {
    setPage(data.selected + 1);
    window.scrollTo(0, 0);
  };

  const handleSelectChange = (e: any) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };
  const handleResetSearch = async () => {
    setSearch("");
    setTypeSearch("ID");
    setPage(1);
    await fetchDemandes();
  };
  const handleSortingColumn = (col: string) => {
    setSortColumn(col);
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };
  const refreshList = () => {
    setPage(1);
    fetchDemandes();
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Export handlers
  const handleExport = (format: string) => {
    const headers = ["ID", "Client", "Num Bon", "Categorie", "Type", "Statut", "Date création"];
    const data = demandes
      .filter((d) => selectedIds.includes(d.id_demande_piece))
      .map((d) => [
        d.id_demande_piece,
        d.client || "-",
        d.num_bon || "-",
        d.categorie || "-",
        d.type || "-",
        translate(d.statut),
        formatDateToTimestamp(d.date_creation || ""),
      ]);

    if (format === "excel") generateExcelFile("Demandes de pièces", headers, data);
    else if (format === "pdf") generatePDFFile("Demandes de pièces", headers, data);

    setShowDownloadModal(false);
  };

const handlePrintIndividual = (d: DemandePiece) => {
  generateBonPDF({
    client: d.client,
    num_bon: d.num_bon || String(d.id_demande_piece),
    date_creation: d.date_creation,
    categorie: d.categorie,
    type: d.type,
    quantite: d.quantite,
    prix: d.prix,
  });
};

  return (
    <div>
      {/* Header */}
      <div className="row mb-3">
        <div className="col-md-6 col-sm-12">
          <h4>{translate("Demande de pièces")} ({total})</h4>
        </div>

        {/* Boutons Bon de livraison + Export */}
        <div className="col-md-6 col-sm-12 text-end d-flex gap-2 justify-content-end">
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + {translate("Bon de livraison")}
          </Button>

          <Button
            variant="outline-warning"
            className="d-flex align-items-center gap-1"
            style={{
              background: "transparent",
              borderColor: "#e5a126",
              color: "#e5a126",
              fontWeight: 500,
            }}
            disabled={selectedIds.length === 0}
            onClick={() => setShowDownloadModal(true)}
          >
            <FaFileExport /> {translate("Exporter")}
          </Button>
        </div>
      </div>

      {/* Search & Select */}
      <div className="row mb-3">
        <div className="col-md-4" style={{ padding: 10 }}>
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link">
                <i className="fas fa-chevron-down" style={{ fontSize: 20 }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {menuItems.map((item, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() => setTypeSearch(item)}
                    active={typeSearch === item}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              className="form-control"
              placeholder={`${translate("Search by")} ${typeSearch}`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Button
              variant="secondary"
              className="btn-reset"
              onClick={handleResetSearch}
            >
              <i className="las la-times" style={{ color: "#fff" }} />
            </Button>
          </div>
        </div>

        {/* Dropdown colonnes + limite */}
        <div className="col-md-8 d-flex justify-content-end align-items-center gap-2">
          <div className="dataTables_length">
            <label style={{ marginBottom: 0 }}>
              {translate("Show")}
              <select
                className="custom-select custom-select-sm form-control form-control-sm ml-2"
                style={{ width: 66 }}
                onChange={handleSelectChange}
                value={limit}
              >
                {[10, 20, 50, 100, 200, 500].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Dropdown>
            <Dropdown.Toggle variant="link" title="Afficher Colonnes">
              <i className="las la-eye" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(initialColumns).map((col, idx) => (
                <Dropdown.Item
                  key={idx}
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns[col as keyof typeof initialColumns]}
                    onChange={() => toggleColumn(col as keyof typeof initialColumns)}
                  />
                  <span style={{ marginLeft: 10 }}>{translate(col)}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Table */}
      <div className="row m-1">
        <Table className="dataTable" responsive>
          <thead className="bg-white text-uppercase">
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === demandes.length && demandes.length > 0}
                  onChange={() => {
                    if (selectedIds.length === demandes.length) setSelectedIds([]);
                    else setSelectedIds(demandes.map((d) => d.id_demande_piece));
                  }}
                />
              </th>

              {selectedColumns.id && (
                <th className="sorting" onClick={() => handleSortingColumn("id_demande_piece")}>
                  {translate("ID")}
                </th>
              )}
              {selectedColumns.client && <th>{translate("Client")}</th>}
              {selectedColumns.num_bon && <th>{translate("Num Bon")}</th>}
              {selectedColumns.categorie && (
                <th className="sorting" onClick={() => handleSortingColumn("categorie")}>
                  {translate("Categorie")}
                </th>
              )}
              {selectedColumns.type && (
                <th className="sorting" onClick={() => handleSortingColumn("type")}>
                  {translate("Type")}
                </th>
              )}
              {selectedColumns.statut && (
                <th className="sorting" onClick={() => handleSortingColumn("statut")}>
                  {translate("Statut")}
                </th>
              )}
              {selectedColumns.date_creation && (
                <th className="sorting" onClick={() => handleSortingColumn("date_creation")}>
                  {translate("Date création")}
                </th>
              )}

              {/* ACTION header centré */}
              <th style={{ textAlign: "center", width: 160 }}>{translate("Action")}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center">{translate("Loading...")}</td>
              </tr>
            ) : demandes.length > 0 ? (
              demandes.map((d) => (
                <tr key={d.id_demande_piece}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.id_demande_piece)}
                      onChange={() => toggleSelect(d.id_demande_piece)}
                    />
                  </td>

                  {selectedColumns.id && <td>{d.id_demande_piece}</td>}
                  {selectedColumns.client && <td>{d.client}</td>}
                  {selectedColumns.num_bon && <td>{d.num_bon}</td>}
                  {selectedColumns.categorie && <td>{d.categorie}</td>}
                  {selectedColumns.type && <td>{d.type}</td>}
                  {selectedColumns.statut && <td>{translate(d.statut)}</td>}
                  {selectedColumns.date_creation && (
                    <td>{d.date_creation ? new Date(d.date_creation).toLocaleString("fr-FR") : "-"}</td>
                  )}

                  {/* Actions */}
                  <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <FaPrint size={18} color="#427949" style={{ cursor: "pointer" }} title="Imprimer" onClick={() => handlePrintIndividual(d)} />
                      <FaEye size={20} color="#3498db" style={{ cursor: "pointer" }} title="Voir" onClick={() => { setSelectedId(d.id_demande_piece); setShowView(true); }} />
                      <FaEdit size={20} color="#e5a126" style={{ cursor: "pointer" }} title="Modifier" onClick={() => { setSelectedId(d.id_demande_piece); setShowEdit(true); }} />
                      <FaTrash size={18} color="#e74c3c" style={{ cursor: "pointer" }} title="Supprimer" onClick={() => { setSelectedId(d.id_demande_piece); setShowDelete(true); }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-muted py-4">
                  {translate("Aucune demande trouvée")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Affichage")} {demandes.length ? (page - 1) * limit + 1 : 0} {translate("à")}{" "}
            {Math.min(page * limit, total)} {translate("sur")} {total}
          </span>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-end"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddDemandePiece show={showAdd} onHide={() => setShowAdd(false)} onSuccess={refreshList} />}
      {showEdit && <ModalEditDemandePiece show={showEdit} onHide={() => setShowEdit(false)} id_demande_piece={selectedId ?? 0} onSuccess={refreshList} />}
      {showView && <ModalShowDemandePiece show={showView} onHide={() => setShowView(false)} id_demande_piece={selectedId ?? 0} />}
      {showDelete && <ModalDeleteDemandePiece show={showDelete} onHide={() => setShowDelete(false)} id_demande_piece={selectedId ?? 0} onSuccess={refreshList} />}

      {/* Modal export */}
      <DownloadModal show={showDownloadModal} onHide={() => setShowDownloadModal(false)} onDownloadConfirm={handleExport} />
    </div>
  );
};

export default DemandePiecePage;
