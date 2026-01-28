import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Dropdown, Badge } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast, Bounce } from "react-toastify";
import { FaEye, FaChevronDown, FaPrint } from "react-icons/fa";

import AddBonReception from "../components/BonReception/AddBonReception";
import ModalShowBonReception from "../components/BonReception/ShowBonReception";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export interface BonReception {
  idBonReception: number;
  nomWarehouse: string;
  numBon: string;
  dateReception: string;
  montantBon: number;
  nbr_avoirs?: number;
}

type BonReceptionLine = {
  emplacement_article: string;
  categorie_article: string;
  type_article: string;
  reference_article: string;
  designation_article: string;
  quantite_article: number;
  prix_unit: number;
  prix_total: number;
};

type BonReceptionShowData = {
  idBonReception: number;
  id_warehouse: number;
  nomWarehouse: string;
  numBon: string;
  dateReception: string;
  fournisseur?: string;
  etabliePar?: string;
  montantBon: number;
  nbreArticle?: number;
  dateCreatBon?: string;
  lines: BonReceptionLine[];
};

const BonReceptionPage: React.FC = () => {
  const [bons, setBons] = useState<BonReception[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");

  const [typeSearch, setTypeSearch] = useState<"numBon" | "warehouse" | "dateReception">("numBon");

  const [selected, setSelected] = useState<BonReception | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);

  const fetchBons = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("search", search);
      params.append("filter", typeSearch);

      const res = await fetch(`${backendUrl}/api/geop/bonreception/list?${params.toString()}`);
      if (!res.ok) throw new Error();

      const data = await res.json();

      setBons(data.bons || []);
      setTotal(data.total || 0);
      setPageCount(Math.max(1, Math.ceil((data.total || 0) / limit)));
    } catch {
      toast.error("Erreur lors de la récupération", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, typeSearch, reloadKey]);

  useEffect(() => {
    fetchBons();
  }, [fetchBons]);

  const refreshList = () => {
    setPage(1);
    setReloadKey((k) => k + 1);
  };

  const toFR = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
      return dateStr;
    }
  };

  const printBonPDF = async (numBon: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/geop/bonreception/show/${encodeURIComponent(numBon)}`);
      if (!res.ok) throw new Error();

      const d: BonReceptionShowData = await res.json();

      const doc = new jsPDF({ unit: "pt", format: "a4" });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BON DE RÉCEPTION", doc.internal.pageSize.getWidth() / 2, 50, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const leftX = 40;
      const rightX = 350;
      const startY = 90;
      const lh = 18;

      doc.text(`Warehouse : ${d.nomWarehouse || "-"}`, leftX, startY);
      doc.text(`N° Bon : ${d.numBon || "-"}`, leftX, startY + lh);
      doc.text(`Date réception : ${toFR(d.dateReception)}`, leftX, startY + lh * 2);

      doc.text(`Fournisseur : ${d.fournisseur || "-"}`, rightX, startY);
      doc.text(`Établi par : ${d.etabliePar || "-"}`, rightX, startY + lh);
      doc.text(`Montant : ${Number(d.montantBon || 0).toFixed(2)}`, rightX, startY + lh * 2);

      autoTable(doc, {
        startY: startY + lh * 4,
        head: [["Emplacement", "Catégorie", "Type", "Référence", "Qté", "Prix U", "Total"]],
        body: (d.lines || []).map((l) => [
          l.emplacement_article || "",
          l.categorie_article || "",
          l.type_article || "",
          l.reference_article || "",
          String(l.quantite_article ?? ""),
          Number(l.prix_unit ?? 0).toFixed(2),
          Number(l.prix_total ?? 0).toFixed(2),
        ]),
        styles: {
          fontSize: 9,
          valign: "middle",
          halign: "center",
        },
        headStyles: {
          fillColor: [249, 115, 22],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? startY + lh * 6;
      doc.text("Signature :", leftX, finalY + 50);
      doc.text("Cachet :", rightX, finalY + 50);

      doc.save(`BonReception_${d.numBon}.pdf`);
    } catch {
      toast.error("Erreur génération PDF", { transition: Bounce });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Bons de réception ({total})</h4>

        <div className="d-flex gap-2">
          <Button onClick={() => setShowAdd(true)}>+ Nouveau bon</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/Avoir")}>
            Liste avoirs
          </Button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6 d-flex gap-2 align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" className="d-flex align-items-center">
              <FaChevronDown />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTypeSearch("numBon")}>Num Bon</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypeSearch("warehouse")}>Warehouse</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypeSearch("dateReception")}>Date réception</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder={`Recherche par : ${typeSearch}`}
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

      <Table hover responsive className="text-center table-clean">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>N° Bon</th>
            <th>Date de réception</th>
            <th>Montant bon</th>
            <th>Nbr Avoirs</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : bons.length > 0 ? (
            bons.map((b) => (
              <tr key={b.idBonReception}>
                <td>{b.nomWarehouse}</td>
                <td>{b.numBon}</td>
                <td>{b.dateReception ? new Date(b.dateReception).toLocaleDateString("fr-FR") : "-"}</td>
                <td>{Number(b.montantBon || 0).toFixed(2)}</td>
                <td>
                  <Badge bg={(b.nbr_avoirs || 0) > 0 ? "warning" : "secondary"}>{b.nbr_avoirs || 0}</Badge>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <FaPrint color="#16a34a" style={{ cursor: "pointer" }} title="Imprimer" onClick={() => printBonPDF(b.numBon)} />
                    <FaEye
                      color="#2563eb"
                      style={{ cursor: "pointer" }}
                      title="Afficher"
                      onClick={() => {
                        setSelected(b);
                        setShowView(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-muted">
                Aucun bon trouvé
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ReactPaginate
        pageCount={pageCount}
        onPageChange={(e) => setPage(e.selected + 1)}
        containerClassName="pagination justify-content-end"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
      />

      <AddBonReception show={showAdd} onHide={() => setShowAdd(false)} onSuccess={refreshList} />

      <ModalShowBonReception
        show={showView}
        bon={selected}
        onHide={() => {
          setShowView(false);
          setSelected(null);
        }}
      />
    </div>
  );
};

export default BonReceptionPage;
