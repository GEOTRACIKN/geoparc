import React, { useEffect, useMemo, useState } from "react";
import { Modal, Table, Row, Col, Form, InputGroup, Badge } from "react-bootstrap";
import { FiClipboard, FiUser, FiHash, FiCalendar, FiCheckCircle, FiDollarSign } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type Bon = {
  client: string;
  num_bon: string;
  statut: string;
  date_creation: string;
  commentaire?: string | null;
};

type Ligne = {
  categorie: string | null;
  type_piece: string | null;
  reference: string;
  serie: string | null;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
};

interface Props {
  show: boolean;
  onHide: () => void;
  num_bon: string | null;
}

const toNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (v: any) => toNumber(v).toFixed(2);

const formatDate = (v: any) => {
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v || "");
    return d.toLocaleDateString("fr-FR");
  } catch {
    return String(v || "");
  }
};

const statusBadge = (statut: string) => {
  const s = String(statut || "").toLowerCase();
  if (s.includes("valid")) return <Badge bg="success">Validé</Badge>;
  if (s.includes("refus")) return <Badge bg="danger">Refusé</Badge>;
  return <Badge bg="warning" text="dark">En attente</Badge>;
};

const ModalShowDemandePiece: React.FC<Props> = ({ show, onHide, num_bon }) => {
  const [bon, setBon] = useState<Bon | null>(null);
  const [lignes, setLignes] = useState<Ligne[]>([]);

  useEffect(() => {
    if (!show || !num_bon) return;

    const username = (localStorage.getItem("Geopusername") || "").trim();

    fetch(
      `${backendUrl}/api/geop/demandepiece/show/${encodeURIComponent(
        num_bon
      )}?username=${encodeURIComponent(username)}`
    )
      .then((r) => r.json())
      .then((d) => {
        const b = d?.bon || null;

        const safeLignes: Ligne[] = Array.isArray(d?.lignes)
          ? d.lignes.map((l: any) => {
              const q = toNumber(l?.quantite);
              const pu = toNumber(l?.prix_unitaire);
              const pt =
                l?.prix_total != null ? toNumber(l.prix_total) : q * pu;

              return {
                categorie: l?.categorie ?? null,
                type_piece: l?.type_piece ?? null,
                reference: String(l?.reference || ""),
                serie: l?.serie ?? null,
                quantite: q,
                prix_unitaire: pu,
                prix_total: pt,
              };
            })
          : [];

        setBon(b);
        setLignes(safeLignes);
      })
      .catch(() => {
        setBon(null);
        setLignes([]);
      });
  }, [show, num_bon]);

  const totalBon = useMemo(
    () => lignes.reduce((s, l) => s + toNumber(l.prix_total), 0),
    [lignes]
  );

  const nbArticles = useMemo(
    () => lignes.reduce((s, l) => s + toNumber(l.quantite), 0),
    [lignes]
  );

  if (!bon) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton style={{ borderBottom: "1px solid #f1f5f9" }}>
        <Modal.Title className="d-flex align-items-center gap-2">
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "#fff7ed",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f97316",
              border: "1px solid #fed7aa",
            }}
          >
            <FiClipboard />
          </span>
          <span> Détails du bon {bon.num_bon}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3 mb-3">
          <Col md={4}>
            <Form.Label className="fw-semibold">
              <span style={{ color: "#f97316" }} className="me-2">
                <FiUser />
              </span>
              Client
            </Form.Label>
            <InputGroup>
              <Form.Control value={bon.client || ""} readOnly />
            </InputGroup>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">
              <span style={{ color: "#f97316" }} className="me-2">
                <FiHash />
              </span>
              Numéro bon
            </Form.Label>
            <InputGroup>
              <Form.Control value={bon.num_bon || ""} readOnly />
            </InputGroup>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">
              <span style={{ color: "#f97316" }} className="me-2">
                <FiCalendar />
              </span>
              Date création
            </Form.Label>
            <InputGroup>
              <Form.Control value={formatDate(bon.date_creation)} readOnly />
            </InputGroup>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">
              <span style={{ color: "#f97316" }} className="me-2">
                <FiCheckCircle />
              </span>
              Statut
            </Form.Label>
            <div style={{ height: 38 }} className="d-flex align-items-center">
              {statusBadge(bon.statut)}
            </div>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">
              <span style={{ color: "#f97316" }} className="me-2">
                <FiDollarSign />
              </span>
              Total bon
            </Form.Label>
            <InputGroup>
              <Form.Control value={money(totalBon)} readOnly />
            </InputGroup>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">Nb articles (somme Qté)</Form.Label>
            <InputGroup>
              <Form.Control value={money(nbArticles)} readOnly />
            </InputGroup>
          </Col>

          {bon.commentaire ? (
            <Col md={12}>
              <Form.Label className="fw-semibold">Commentaire</Form.Label>
              <Form.Control as="textarea" rows={2} value={bon.commentaire || ""} readOnly />
            </Col>
          ) : null}
        </Row>

        {/* Table */}
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Table bordered responsive className="mb-0" style={{ borderColor: "#e2e8f0" }}>
            <thead style={{ background: "#fff7ed" }}>
              <tr style={{ color: "#111827" }}>
                <th className="text-center" style={{ width: 140 }}>Catégorie</th>
                <th className="text-center" style={{ width: 160 }}>Type</th>
                <th className="text-center" style={{ width: 120 }}>Référence</th>
                <th className="text-center" style={{ width: 120 }}>Série</th>
                <th className="text-center" style={{ width: 90 }}>Qté</th>
                <th className="text-center" style={{ width: 100 }}>Prix U</th>
                <th className="text-center" style={{ width: 110 }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {lignes.map((l, i) => (
                <tr key={i}>
                  <td className="text-center fw-semibold" style={{ color: "#0f172a" }}>
                    {l.categorie || "-"}
                  </td>
                  <td className="text-center" style={{ color: "#0f172a" }}>
                    {l.type_piece || "-"}
                  </td>
                  <td className="text-center">{l.reference || "-"}</td>
                  <td className="text-center">{l.serie || "-"}</td>
                  <td className="text-center">{money(l.quantite)}</td>
                  <td className="text-center">{money(l.prix_unitaire)}</td>
                  <td className="text-center fw-bold" style={{ color: "#0f172a" }}>
                    {money(l.prix_total)}
                  </td>
                </tr>
              ))}

              {lignes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    Aucune ligne
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <div
            style={{
              background: "#f97316",
              color: "white",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 700,
              minWidth: 220,
              textAlign: "center",
            }}
          >
            Total du bon : {money(totalBon)}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalShowDemandePiece;
