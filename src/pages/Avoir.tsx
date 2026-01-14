import React, { useState, useEffect, useCallback } from "react";
import { Table, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import AddAvoir from "../components/Avoir/AddAvoir";
import ShowAvoir from "../components/Avoir/ShowAvoir";
import { FaEye, FaPrint } from "react-icons/fa";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface AvoirRow {
  idRetour: number;
  nomWarehouse: string;
  numBon: string;
  dateRetour: string;
  cout_article: number;
  operationMaj: "Addition" | "Soustraction";
}

type AvoirDetail = {
  idRetour: number;
  numBon: string;
  dateRetour: string;
  montantBonMAJ: number;
  reference_article: string;
  quantiteMaj: number;
  operationMaj: "Addition" | "Soustraction";
  cout_article: number;

  nomWarehouse?: string;
  dateReception?: string;
  fournisseur?: string;
  etabliePar?: string;
  montantBon?: number;
  nbr_avoirs?: number;
};

const AvoirPage: React.FC = () => {
  const { translate } = useTranslate();

  const [rows, setRows] = useState<AvoirRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [reloadKey, setReloadKey] = useState(0);

  const [showAdd, setShowAdd] = useState(false);

  const [showView, setShowView] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchAvoirs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await fetch(`${backendUrl}/api/geop/avoir/list?${params.toString()}`);
      if (!res.ok) throw new Error();

      const data = await res.json();

      setRows(data.avoirs || []);
      setTotal(data.total || 0);
      setPageCount(Math.max(1, Math.ceil((data.total || 0) / limit)));
    } catch {
      toast.error(translate("Erreur lors de la récupération"), { transition: Bounce });
    } finally {
      setLoading(false);
    }
  }, [page, limit, translate, reloadKey]);

  useEffect(() => {
    fetchAvoirs();
  }, [fetchAvoirs]);

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

  const printAvoirPDF = async (idRetour: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/geop/avoir/show/${idRetour}`);
      if (!res.ok) throw new Error();

      const d: AvoirDetail = await res.json();

      const doc = new jsPDF({ unit: "pt", format: "a4" });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BON D’AVOIR / COMPLÉMENTAIRE", doc.internal.pageSize.getWidth() / 2, 50, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const leftX = 40;
      const rightX = 350;
      const startY = 90;
      const lh = 18;

      doc.text(`Warehouse : ${d.nomWarehouse || "-"}`, leftX, startY);
      doc.text(`N° Bon (réf) : ${d.numBon || "-"}`, leftX, startY + lh);
      doc.text(`Date avoir : ${toFR(d.dateRetour)}`, leftX, startY + lh * 2);

      doc.text(`Fournisseur : ${d.fournisseur || "-"}`, rightX, startY);
      doc.text(`Établi par : ${d.etabliePar || "-"}`, rightX, startY + lh);
      doc.text(`Date réception : ${toFR(d.dateReception)}`, rightX, startY + lh * 2);

      const montantOriginal = Number(d.montantBon || 0);
      const montantMajTrace = Number(d.montantBonMAJ || 0);

      doc.setFont("helvetica", "bold");
      doc.text(`Montant bon original : ${montantOriginal.toFixed(2)}`, leftX, startY + lh * 4);
      doc.text(`Montant après MàJ (trace) : ${montantMajTrace.toFixed(2)}`, rightX, startY + lh * 4);

      doc.setFont("helvetica", "normal");

      autoTable(doc, {
        startY: startY + lh * 6,
        head: [["Référence", "Opération", "Quantité", "Coût MàJ"]],
        body: [[
          d.reference_article || "",
          d.operationMaj || "",
          String(d.quantiteMaj ?? ""),
          Number(d.cout_article ?? 0).toFixed(2),
        ]],
        styles: { fontSize: 10, valign: "middle", halign: "center" },
        headStyles: {
          fillColor: [249, 115, 22],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? startY + lh * 8;

      doc.text("Signature :", leftX, finalY + 50);
      doc.text("Cachet :", rightX, finalY + 50);

      doc.save(`Avoir_${d.numBon}_ID${d.idRetour}.pdf`);
    } catch {
      toast.error("Erreur génération PDF", { transition: Bounce });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>
          {translate("Avoirs")} ({total})
        </h4>

        <Button onClick={() => setShowAdd(true)}>+ {translate("Nouvel avoir")}</Button>
      </div>

      <Table hover responsive className="text-center table-clean">
        <thead>
          <tr>
            <th>{translate("Warehouse")}</th>
            <th>{translate("N° Bon")}</th>
            <th>{translate("Date MàJ")}</th>
            <th>{translate("Coût MàJ")}</th>
            <th>{translate("Opération")}</th>
            <th>{translate("Action")}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((r) => (
              <tr key={r.idRetour}>
                <td>{r.nomWarehouse}</td>
                <td>{r.numBon}</td>
                <td>{r.dateRetour ? new Date(r.dateRetour).toLocaleDateString("fr-FR") : "-"}</td>
                <td>{Number(r.cout_article || 0).toFixed(2)}</td>
                <td>{translate(r.operationMaj)}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <FaPrint
                      color="#16a34a"
                      style={{ cursor: "pointer" }}
                      title="Imprimer"
                      onClick={() => printAvoirPDF(r.idRetour)}
                    />
                    <FaEye
                      color="#2563eb"
                      style={{ cursor: "pointer" }}
                      title="Afficher"
                      onClick={() => {
                        setSelectedId(r.idRetour);
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
                {translate("Aucun avoir trouvé")}
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

      <AddAvoir show={showAdd} onHide={() => setShowAdd(false)} onSuccess={refreshList} />

      <ShowAvoir
        show={showView}
        idRetour={selectedId}
        onHide={() => {
          setShowView(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default AvoirPage;
