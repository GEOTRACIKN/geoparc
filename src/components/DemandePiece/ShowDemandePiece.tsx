import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FiUser, FiHash, FiLayers, FiPackage, FiDollarSign, FiMessageCircle, FiCheckCircle } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  id_demande_piece: number | null;
}

const ShowDemandePiece: React.FC<Props> = ({ show, onHide, id_demande_piece }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOne = async () => {
      if (!show || !id_demande_piece) return;
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/geop/showdemandepiece/${id_demande_piece}`);
        if (!res.ok) throw new Error("Erreur récupération");
        const d = await res.json();
        setData(d);
      } catch (err) {
        console.error("Erreur fetch demande:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [show, id_demande_piece]);

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Détails de la demande</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>N° de bon</Form.Label>
              <InputGroup>
                <Form.Control value={data.num_bon ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiHash /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Client</Form.Label>
              <InputGroup>
                <Form.Control value={data.client ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiUser /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Catégorie</Form.Label>
              <InputGroup>
                <Form.Control value={data.categorie ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><i className="bi bi-diagram-3"></i></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <Form.Control value={data.type ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiLayers /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <Form.Control value={data.quantite ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiPackage /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Prix</Form.Label>
              <InputGroup>
                <Form.Control value={data.prix ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiDollarSign /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Commentaire</Form.Label>
              <InputGroup>
                <Form.Control as="textarea" value={data.commentaire ?? ""} readOnly rows={3} />
                <InputGroup.Text style={{ color: "#f97316" }}><FiMessageCircle /></InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Statut</Form.Label>
              <InputGroup>
                <Form.Control value={data.statut ?? ""} readOnly />
                <InputGroup.Text style={{ color: "#f97316" }}><FiCheckCircle /></InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Form>
        ) : (
          <p>Aucune donnée</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowDemandePiece;
