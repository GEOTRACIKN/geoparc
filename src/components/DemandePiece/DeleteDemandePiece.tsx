import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  id_demande_piece: number | null;
  onSuccess?: () => void;
}

const ModalDeleteDemandePiece: React.FC<Props> = ({ show, onHide, id_demande_piece, onSuccess }) => {

  const handleDelete = async () => {
    if (!id_demande_piece) return;
    try {
      const res = await fetch(`${backendUrl}/api/geop/deletedemandepiece/${id_demande_piece}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur suppression" }));
        throw new Error(err.error || "Erreur suppression");
      }
      toast.success("Demande supprimée", { position: "bottom-right", transition: Bounce });
      onSuccess?.();
      onHide();
    } catch (err) {
      console.error("Erreur suppression demande:", err);
      toast.error("Erreur lors de la suppression", { position: "bottom-right", transition: Bounce });
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Supprimer la demande</Modal.Title>
      </Modal.Header>
      <Modal.Body>Êtes-vous sûr de vouloir supprimer cette demande ?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteDemandePiece;
