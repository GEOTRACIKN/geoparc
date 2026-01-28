import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  idRetour: number | null;
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

const ShowAvoir: React.FC<Props> = ({ show, onHide, idRetour }) => {
  const [data, setData] = useState<AvoirDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show || idRetour == null) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${backendUrl}/api/geop/avoir/show/${idRetour}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP" + r.status);
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setData(null);
        setError("Impossible de charger les détails.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [show, idRetour]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaFileAlt color="#f97316" />
          Détails de l&apos;avoir
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-muted">{error}</div>
        ) : !data ? (
          <div className="text-muted">Aucune donnée.</div>
        ) : (
          <>
            <div className="mb-3">
              <div>
                <b>Warehouse :</b> {data.nomWarehouse || "-"}
              </div>
              <div>
                <b>N° Bon :</b> {data.numBon}
              </div>
              <div>
                <b>Date avoir :</b> {data.dateRetour ? new Date(data.dateRetour).toLocaleDateString("fr-FR") : "-"}
              </div>
              <div>
                <b>Nb avoirs sur bon :</b> {data.nbr_avoirs ?? "-"}
              </div>
            </div>

            <Table bordered hover responsive className="text-center">
              <thead style={{ backgroundColor: "#f97316", color: "#fff" }}>
                <tr>
                  <th>Référence</th>
                  <th>Opération</th>
                  <th>Quantité MàJ</th>
                  <th>Coût MàJ</th>
                  <th>Montant Bon MAJ (trace)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.reference_article}</td>
                  <td>{data.operationMaj}</td>
                  <td>{Number(data.quantiteMaj || 0).toFixed(2)}</td>
                  <td>{Number(data.cout_article || 0).toFixed(2)}</td>
                  <td>{Number(data.montantBonMAJ || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>

            <div className="mt-3">
              <div>
                <b>Bon original (référence) :</b> {Number(data.montantBon || 0).toFixed(2)}
              </div>
              {data.fournisseur && (
                <div>
                  <b>Fournisseur :</b> {data.fournisseur}
                </div>
              )}
              {data.etabliePar && (
                <div>
                  <b>Établi par :</b> {data.etabliePar}
                </div>
              )}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ShowAvoir;
