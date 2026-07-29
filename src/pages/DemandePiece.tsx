import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";

import AddDemandePiece from "../components/DemandePiece/AddDemandePiece";
import ModalEditDemandePiece from "../components/DemandePiece/EditDemandePiece";
import ModalShowDemandePiece from "../components/DemandePiece/ShowDemandePiece";
import ModalDeleteDemandePiece from "../components/DemandePiece/DeleteDemandePiece";

import { FaEye, FaEdit, FaTrash, FaPrint, FaChevronDown } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useListPagePreferences } from "../hooks/useListPagePreferences";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type BonRow = {
  id_demande_piece: number;
  num_bon: string;
  client: string;
  commentaire?: string | null;
  statut: string;
  date_creation: string;
  id_user: number;
  totalCout?: number;
};

// ===== PDF =====
type BonPDFPiece = {
  categorie: string;
  type: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
};

type BonPDFData = {
  num_bon: string;
  client: string;
  date_creation: string;
  statut?: string;
  pieces: BonPDFPiece[];
};

function formatDateTime(v: string) {
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString("fr-FR");
  } catch {
    return v;
  }
}

function generateBonPDF(d: BonPDFData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("BON DE LIVRAISON", doc.internal.pageSize.getWidth() / 2, 50, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const leftX = 40;
  const rightX = 400;
  const startY = 90;
  const lineHeight = 20;

  // infos société
  doc.text("Société :", leftX, startY);
  doc.text("Adresse :", leftX, startY + lineHeight);
  doc.text("Téléphone :", leftX, startY + lineHeight * 2);

  // infos client
  doc.text(`Client : ${d.client || "-"}`, rightX, startY);
  doc.text(`N° Bon : ${d.num_bon || "-"}`, rightX, startY + lineHeight);
  doc.text(
    `Date : ${
      d.date_creation
        ? formatDateTime(d.date_creation)
        : formatDateTime(new Date().toISOString())
    }`,
    rightX,
    startY + lineHeight * 2
  );

  const totalBon = (d.pieces || []).reduce(
    (sum, p) => sum + Number(p.prix_total || 0),
    0
  );

  // tableau pièces
  autoTable(doc, {
    startY: startY + lineHeight * 4,
    head: [["Pièce", "Type", "Quantité", "Prix U", "Total"]],
    body: (d.pieces || []).map((p) => [
      p.categorie || "",
      p.type || "",
      p.quantite ?? "",
      Number(p.prix_unitaire ?? 0).toFixed(2),
      Number(p.prix_total ?? 0).toFixed(2),
    ]),
    styles: { fontSize: 10, valign: "middle" },
    headStyles: {
      fillColor: [249, 115, 22],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? startY + lineHeight * 6;

  // Total bon
  doc.setFont("helvetica", "bold");
  doc.text(`Total du bon : ${totalBon.toFixed(2)}`, rightX, finalY + 30);
  doc.setFont("helvetica", "normal");

  doc.text("Signature :", leftX, finalY + 80);
  doc.text("Cachet :", rightX, finalY + 80);

  doc.save(`Bon_${d.num_bon || "piece"}.pdf`);
}

const DemandePiecePage: React.FC = () => {
  const { translate } = useTranslate();

  const [bons, setBons] = useState<BonRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [search, setSearch] = useState("");
  const [typeSearch, setTypeSearch] =
    useState<"num_bon" | "client" | "statut">("num_bon"); // UI only (mais utilisé pour ESLint)
  const { ready: listPreferencesReady } = useListPagePreferences({
    pageKey: "parts-requests",
    pageSize: limit, setPageSize: setLimit,
    searchType: typeSearch, setSearchType: setTypeSearch,
    searchText: search, setSearchText: setSearch,
  });

  const [selectedNumBon, setSelectedNumBon] = useState<string | null>(null);
  const [selectedNumBons, setSelectedNumBons] = useState<string[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  // ================= FETCH =================
  const fetchBons = useCallback(async () => {
    try {
      setLoading(true);

      const username = (localStorage.getItem("Geopusername") || "").trim();
      if (!username) {
        toast.error("Utilisateur non détecté (username)", { transition: Bounce });
        setBons([]);
        setTotal(0);
        setPageCount(1);
        return;
      }

      const params = new URLSearchParams();
      params.append("username", username);
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("search", (search || "").trim());
      params.append("typeSearch", typeSearch);
      params.append("_rk", String(reloadKey));

      const res = await fetch(
        `${backendUrl}/api/geop/demandepiece/list?${params.toString()}`
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Erreur serveur");
      }

      const list: BonRow[] = Array.isArray(data?.list) ? data.list : [];
      const totalCount = Number(data?.total ?? list.length ?? 0);
      const totalPages = Number(
        data?.totalPages ?? Math.ceil(totalCount / limit) ?? 1
      );

      setBons(list);
      setTotal(totalCount);
      setPageCount(Math.max(1, totalPages));
      setSelectedNumBons([]);
    } catch (e: any) {
      const msg = String(e?.message || "");
      toast.error(
        `${translate("Erreur lors de la récupération")}${msg ? ` (${msg})` : ""}`,
        { transition: Bounce }
      );
      setBons([]);
      setTotal(0);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, typeSearch, translate, reloadKey]);

  useEffect(() => {
    if (!listPreferencesReady) return;
    fetchBons();
  }, [fetchBons, listPreferencesReady]);

  const refreshList = () => {
    setPage(1);
    setReloadKey((k) => k + 1);
  };

  const toggleSelectAll = () => {
    if (selectedNumBons.length === bons.length) {
      setSelectedNumBons([]);
    } else {
      setSelectedNumBons(bons.map((b) => b.num_bon));
    }
  };

  // ================= PRINT PDF =================
  const handlePrint = async (row: BonRow) => {
    try {
      const username = (localStorage.getItem("Geopusername") || "").trim();
      if (!username) {
        toast.error("Utilisateur non détecté (username)", { transition: Bounce });
        return;
      }
      const params = new URLSearchParams();
      params.append("username", username);

      const res = await fetch(
        `${backendUrl}/api/geop/demandepiece/show/${encodeURIComponent(
          row.num_bon
        )}?${params.toString()}`
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Erreur serveur");

      const bonData = data?.bon || {};
      const lignes = Array.isArray(data?.lignes) ? data.lignes : [];

      const pdfData: BonPDFData = {
        num_bon: bonData.num_bon || row.num_bon,
        client: bonData.client || row.client,
        date_creation: bonData.date_creation || row.date_creation,
        statut: bonData.statut || row.statut,
        pieces: lignes.map((l: any) => {
          const q = Number(l?.quantite ?? 0);
          const pu = Number(l?.prix_unitaire ?? 0);
          const pt = Number(l?.prix_total ?? q * pu);

          return {
            categorie: l?.categorie || "",
            type: l?.type_piece || "",
            quantite: q,
            prix_unitaire: pu,
            prix_total: pt,
          };
        }),
      };

      generateBonPDF(pdfData);
    } catch (e: any) {
      toast.error(
        `Erreur génération PDF${e?.message ? ` (${e.message})` : ""}`,
        { transition: Bounce }
      );
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>
          {translate("Bons de livraison")} ({total})
        </h4>

        <Button onClick={() => setShowAdd(true)}>
          + {translate("Nouveau bon")}
        </Button>
      </div>

      {/* ===== Recherche ===== */}
      <div className="row mb-3">
        <div className="col-md-6 d-flex gap-2 align-items-center">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              className="d-flex align-items-center"
            >
              <FaChevronDown />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTypeSearch("num_bon")}>
                {translate("Num Bon")}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setTypeSearch("client")}>
                {translate("Client")}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setTypeSearch("statut")}>
                {translate("Statut")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder={`${translate("Recherche")}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <select
            className="form-select w-auto"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Table hover responsive className="text-center table-clean">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={bons.length > 0 && selectedNumBons.length === bons.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th>{translate("Num Bon")}</th>
            <th>{translate("Client")}</th>
            <th>{translate("Statut")}</th>
            <th>{translate("Date création")}</th>
            <th>{translate("Action")}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : bons.length > 0 ? (
            bons.map((b) => (
              <tr key={b.id_demande_piece}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNumBons.includes(b.num_bon)}
                    onChange={() =>
                      setSelectedNumBons((prev) =>
                        prev.includes(b.num_bon)
                          ? prev.filter((n) => n !== b.num_bon)
                          : [...prev, b.num_bon]
                      )
                    }
                  />
                </td>

                <td>{b.num_bon}</td>
                <td>{b.client}</td>
                <td>{translate(b.statut)}</td>
                <td>
                  {b.date_creation
                    ? new Date(b.date_creation).toLocaleDateString("fr-FR")
                    : ""}
                </td>

                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <FaPrint
                      color="#16a34a"
                      onClick={() => handlePrint(b)}
                      style={{ cursor: "pointer" }}
                      title="Imprimer"
                    />
                    <FaEye
                      color="#2563eb"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowView(true);
                      }}
                      style={{ cursor: "pointer" }}
                      title="Voir"
                    />
                    <FaEdit
                      color="#f59e0b"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowEdit(true);
                      }}
                      style={{ cursor: "pointer" }}
                      title="Modifier"
                    />
                    <FaTrash
                      color="#dc2626"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowDelete(true);
                      }}
                      style={{ cursor: "pointer" }}
                      title="Supprimer"
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-muted">
                {translate("Aucune demande trouvée")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ReactPaginate
        pageCount={pageCount}
        forcePage={page - 1}
        onPageChange={(e) => setPage(e.selected + 1)}
        containerClassName="pagination justify-content-end"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
      />

      {/* ===== MODALS ===== */}
      <AddDemandePiece
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onSuccess={refreshList}
      />

      <ModalEditDemandePiece
        show={showEdit}
        num_bon={selectedNumBon}
        onHide={() => {
          setShowEdit(false);
          setSelectedNumBon(null);
        }}
        onSuccess={refreshList}
      />

      <ModalShowDemandePiece
        show={showView}
        num_bon={selectedNumBon}
        onHide={() => {
          setShowView(false);
          setSelectedNumBon(null);
        }}
      />

      <ModalDeleteDemandePiece
        show={showDelete}
        num_bon={selectedNumBon}
        onHide={() => {
          setShowDelete(false);
          setSelectedNumBon(null);
        }}
        onSuccess={refreshList}
      />
    </div>
  );
};

export default DemandePiecePage;
