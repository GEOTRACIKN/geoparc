import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiUser, FiCheckCircle } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Piece {
  categorie: string;
  type: string;
  quantite: number;
  prix: number;
  commentaire?: string;
}

interface Bon {
  num_bon: string;
  client: string;
  statut: string;
  pieces: Piece[];
}

interface Props {
  show: boolean;
  onHide: () => void;
  num_bon: string | null;
  onSuccess?: () => void;
}

const ModalEditDemandePiece: React.FC<Props> = ({
  show,
  onHide,
  num_bon,
  onSuccess,
}) => {
  const [bon, setBon] = useState<Bon | null>(null);
  const [loading, setLoading] = useState(false);

  // ================= CHARGEMENT =================
  useEffect(() => {
    if (!show || !num_bon) return;

    fetch(`${backendUrl}/api/geop/demandepiece/show/${num_bon}`)
      .then((res) => res.json())
      .then(setBon)
      .catch(() =>
        toast.error("Erreur chargement", { transition: Bounce })
      );
  }, [show, num_bon]);

  // ================= PIÈCES =================
  const updatePiece = (index: number, field: string, value: any) => {
    if (!bon) return;
    const pieces = [...bon.pieces];
    pieces[index] = { ...pieces[index], [field]: value };
    setBon({ ...bon, pieces });
  };

  const addPiece = () => {
    if (!bon) return;
    setBon({
      ...bon,
      pieces: [
        ...bon.pieces,
        { categorie: "", type: "", quantite: 1, prix: 0 },
      ],
    });
  };

  const removePiece = (index: number) => {
    if (!bon) return;
    setBon({
      ...bon,
      pieces: bon.pieces.filter((_, i) => i !== index),
    });
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!bon) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/geop/demandepiece/update/${bon.num_bon}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bon),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Bon mis à jour", { transition: Bounce });
      onSuccess?.();
      onHide();
    } catch {
      toast.error("Erreur sauvegarde", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  if (!bon) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le bon {bon.num_bon}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ===== CLIENT + STATUT ===== */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label>Client</Form.Label>
            <InputGroup>
              <InputGroup.Text style={{ color: "#f97316" }}>
                <FiUser />
              </InputGroup.Text>
              <Form.Control
                value={bon.client}
                onChange={(e) =>
                  setBon({ ...bon, client: e.target.value })
                }
              />
            </InputGroup>
          </Col>

          <Col md={6}>
            <Form.Label>Statut</Form.Label>
            <InputGroup>
              <InputGroup.Text style={{ color: "#f97316" }}>
                <FiCheckCircle />
              </InputGroup.Text>
              <Form.Select
                value={bon.statut}
                onChange={(e) =>
                  setBon({ ...bon, statut: e.target.value })
                }
              >
                <option value="En attente">En attente</option>
                <option value="Validé">Validé</option>
                <option value="Refusé">Refusé</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        {/* ===== PIÈCES ===== */}
        <h5 className="mb-3">Pièces</h5>

        <Table bordered hover responsive>
          <thead style={{ background: "#f97316", color: "#fff" }}>
            <tr>
              <th>Catégorie</th>
              <th>Type</th>
              <th className="text-center">Quantité</th>
              <th className="text-center">Prix</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bon.pieces.map((p, i) => (
              <tr key={i}>
                <td>
                  <Form.Control
                    value={p.categorie}
                    onChange={(e) =>
                      updatePiece(i, "categorie", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    value={p.type}
                    onChange={(e) =>
                      updatePiece(i, "type", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={p.quantite}
                    onChange={(e) =>
                      updatePiece(i, "quantite", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={p.prix}
                    onChange={(e) =>
                      updatePiece(i, "prix", Number(e.target.value))
                    }
                  />
                </td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removePiece(i)}
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="outline-primary" onClick={addPiece}>
          + Ajouter une pièce
        </Button>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditDemandePiece;
