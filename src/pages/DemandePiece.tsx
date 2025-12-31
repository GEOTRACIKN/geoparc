import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";

import AddDemandePiece from "../components/DemandePiece/AddDemandePiece";
import ModalEditDemandePiece from "../components/DemandePiece/EditDemandePiece";
import ModalShowDemandePiece from "../components/DemandePiece/ShowDemandePiece";
import ModalDeleteDemandePiece from "../components/DemandePiece/DeleteDemandePiece";

import {FaEye,FaEdit,FaTrash,FaPrint,FaChevronDown} from "react-icons/fa";

import { generateBonPDF } from "../functions";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

interface Bon {
  num_bon: string;
  client: string;
  statut: string;
  date_creation: string;
  pieces: any[];
}

const DemandePiecePage: React.FC = () => {
  const { translate } = useTranslate();

  const [bons, setBons] = useState<Bon[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [search, setSearch] = useState("");
  const [typeSearch, setTypeSearch] =
    useState<"num_bon" | "client" | "statut">("num_bon");

  const [selectedNumBon, setSelectedNumBon] = useState<string | null>(null);
  const [selectedNumBons, setSelectedNumBons] = useState<string[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // ================= FETCH =================
  const fetchBons = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("search", search);
      params.append("filter", typeSearch);

      const res = await fetch(
        `${backendUrl}/api/geop/demandepiece/list/${geopuserID}?${params}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setBons(data.demandes || []);
      setTotal(data.total || 0);
      setPageCount(Math.max(1, Math.ceil((data.total || 0) / limit)));
    } catch {
      toast.error(translate("Erreur lors de la récupération"), {
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, typeSearch, translate]);

  useEffect(() => {
    fetchBons();
  }, [fetchBons]);

  const refreshList = () => {
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedNumBons.length === bons.length) {
      setSelectedNumBons([]);
    } else {
      setSelectedNumBons(bons.map(b => b.num_bon));
    }
  };

  // ================= RENDER =================
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

      {/* ===== Recherche filtrée ===== */}
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
            placeholder={`${translate("Recherche par")} : ${translate(
              typeSearch
            )}`}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <select
            className="form-select w-auto"
            value={limit}
            onChange={e => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map(n => (
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
                checked={
                  bons.length > 0 && selectedNumBons.length === bons.length
                }
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
            bons.map(b => (
              <tr key={b.num_bon}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNumBons.includes(b.num_bon)}
                    onChange={() =>
                      setSelectedNumBons(prev =>
                        prev.includes(b.num_bon)
                          ? prev.filter(n => n !== b.num_bon)
                          : [...prev, b.num_bon]
                      )
                    }
                  />
                </td>

                <td>{b.num_bon}</td>
                <td>{b.client}</td>
                <td>{translate(b.statut)}</td>
                <td>
                  {new Date(b.date_creation).toLocaleDateString("fr-FR")}
                </td>

                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <FaPrint
                      color="#16a34a"
                      onClick={() => generateBonPDF(b)}
                    />
                    <FaEye
                      color="#2563eb"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowView(true);
                      }}
                    />
                    <FaEdit
                      color="#f59e0b"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowEdit(true);
                      }}
                    />
                    <FaTrash
                      color="#dc2626"
                      onClick={() => {
                        setSelectedNumBon(b.num_bon);
                        setShowDelete(true);
                      }}
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
        onPageChange={e => setPage(e.selected + 1)}
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
