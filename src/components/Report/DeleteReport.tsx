import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DeleteReportProps {
  show: boolean;
  onHide: () => void;
  reportId: number | null;
  onSuccess: () => void;
  useFakeMode?: boolean;
}

const DeleteReport: React.FC<DeleteReportProps> = ({
  show,
  onHide,
  reportId,
  onSuccess,
  useFakeMode = true,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!reportId) return;

    try {
      setLoading(true);

      if (useFakeMode) {
        toast.success("Suppression visuelle effectuée", {
          transition: Bounce,
        });
        onSuccess();
        onHide();
        return;
      }

      const username = localStorage.getItem("Geopusername");

      if (!username) {
        toast.error("Utilisateur non détecté", { transition: Bounce });
        return;
      }

      const params = new URLSearchParams();
      params.append("username", username);

      const res = await fetch(
        `${backendUrl}/api/geop/reports/delete/${reportId}?${params.toString()}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || "Erreur lors de la suppression", {
          transition: Bounce,
        });
        return;
      }

      toast.success("Rapport supprimé avec succès", { transition: Bounce });

      onSuccess();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Supprimer le rapport</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Voulez-vous vraiment supprimer ce rapport de l’historique ?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>

        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Suppression..." : "Supprimer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteReport;