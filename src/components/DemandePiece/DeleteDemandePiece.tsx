
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Props {
  show: boolean;
  onHide: () => void;
  num_bon: string | null;
  onSuccess?: () => void;
}

const ModalDeleteDemandePiece: React.FC<Props> = ({
  show,
  onHide,
  num_bon,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!num_bon) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/geop/demandepiece/delete/${num_bon}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      toast.success("Bon supprimé", { transition: Bounce });
      onSuccess?.();
      onHide();
    } catch {
      toast.error("Erreur suppression", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Supprimer le bon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Confirmer la suppression du bon <b>{num_bon}</b> et de toutes ses pièces ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteDemandePiece;
