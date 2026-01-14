import React, { useEffect, useState } from "react";
import { Modal, Table, Row, Col } from "react-bootstrap";
import { FiUser, FiCalendar, FiTruck, FiHash, FiDollarSign, FiBox } from "react-icons/fi";
import type { BonReception } from "../../pages/BonReception";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  bon: BonReception | null;
}

type Line = {
  emplacement_article: string;
  categorie_article: string;
  type_article: string;
  reference_article: string;
  designation_article: string;
  quantite_article: number;
  prix_unit: number;
  prix_total: number;
};

type BonDetail = {
  idBonReception: number;
  id_warehouse: number;
  nomWarehouse: string;
  numBon: string;
  dateReception: string;
  montantBon: number;
  fournisseur?: string;
  etabliePar?: string;
  nbreArticle?: number;
  dateCreatBon?: string;
  lines: Line[];
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
};

const valueStyle: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
};

const ModalShowBonReception: React.FC<Props> = ({ show, onHide, bon }) => {
  const [data, setData] = useState<BonDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !bon) return;

    setLoading(true);
    fetch(`${backendUrl}/api/geop/bonreception/show/${encodeURIComponent(bon.numBon)}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [show, bon]);

  if (!bon) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FiBox color="#f97316" />
          Détails du bon {bon.numBon}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div>Loading...</div>
        ) : !data ? (
          <div className="text-muted">Impossible de charger les détails.</div>
        ) : (
          <>
            <Row className="g-3 mb-3">
              <Col md={4}>
                <div style={labelStyle}>
                  <FiUser color="#f97316" /> Warehouse
                </div>
                <div style={valueStyle}>{data.nomWarehouse || "-"}</div>
              </Col>

              <Col md={4}>
                <div style={labelStyle}>
                  <FiCalendar color="#f97316" /> Date de réception
                </div>
                <div style={valueStyle}>
                  {data.dateReception ? new Date(data.dateReception).toLocaleDateString("fr-FR") : "-"}
                </div>
              </Col>

              <Col md={4}>
                <div style={labelStyle}>
                  <FiDollarSign color="#f97316" /> Montant bon
                </div>
                <div style={valueStyle}>{Number(data.montantBon || 0).toFixed(2)}</div>
              </Col>

              <Col md={4}>
                <div style={labelStyle}>
                  <FiTruck color="#f97316" /> Fournisseur
                </div>
                <div style={valueStyle}>{data.fournisseur || "-"}</div>
              </Col>

              <Col md={4}>
                <div style={labelStyle}>
                  <FiUser color="#f97316" /> Établi par
                </div>
                <div style={valueStyle}>{data.etabliePar || "-"}</div>
              </Col>

              <Col md={4}>
                <div style={labelStyle}>
                  <FiHash color="#f97316" /> Nb articles
                </div>
                <div style={valueStyle}>{data.lines?.length ?? 0}</div>
              </Col>
            </Row>

            <Table bordered hover responsive className="text-center">
              <thead style={{ backgroundColor: "#f97316", color: "#fff" }}>
                <tr>
                  <th>Emplacement</th>
                  <th>Catégorie</th>
                  <th>Type</th>
                  <th>Référence</th>
                  <th>Désignation</th>
                  <th>Qté</th>
                  <th>Prix U</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {(data.lines || []).length > 0 ? (
                  data.lines.map((a, i) => (
                    <tr key={i}>
                      <td>{a.emplacement_article || "-"}</td>
                      <td>{a.categorie_article || "-"}</td>
                      <td>{a.type_article || "-"}</td>
                      <td>{a.reference_article || "-"}</td>
                      <td>{a.designation_article || "-"}</td>
                      <td>{a.quantite_article ?? 0}</td>
                      <td>{Number(a.prix_unit ?? 0).toFixed(2)}</td>
                      <td style={{ fontWeight: 600 }}>{Number(a.prix_total ?? 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-muted">
                      Aucune ligne trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalShowBonReception;
