import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  num_bon: string | null;
}

interface Piece {
  categorie: string;
  type: string;
  quantite: number;
  prix: number;
}

interface BonData {
  client: string;
  num_bon: string;
  statut: string;
  date_creation: string;
  pieces: Piece[];
}

const ModalShowDemandePiece: React.FC<Props> = ({ show, onHide, num_bon }) => {
  const [data, setData] = useState<BonData | null>(null);

  useEffect(() => {
    if (!show || !num_bon) return;

    fetch(`${backendUrl}/api/geop/demandepiece/show/${num_bon}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [show, num_bon]);

  if (!data) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails du bon {data.num_bon}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><b>Client :</b> {data.client}</p>
        <p><b>Statut :</b> {data.statut}</p>
        <p>
          <b>Date création :</b>{" "}
          {new Date(data.date_creation).toLocaleString("fr-FR")}
        </p>

        <Table bordered hover responsive>
          <thead style={{ backgroundColor: "#f97316", color: "#fff" }}>
            <tr>
              <th className="text-center">Catégorie</th>
              <th className="text-center">Type</th>
              <th className="text-center">Quantité</th>
              <th className="text-center">Prix</th>
            </tr>
          </thead>
          <tbody>
            {data.pieces.map((p, i) => (
              <tr key={i}>
                <td className="text-center">{p.categorie}</td>
                <td className="text-center">{p.type}</td>
                <td className="text-center">{p.quantite}</td>
                <td className="text-center">{p.prix}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default ModalShowDemandePiece;
