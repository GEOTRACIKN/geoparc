import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";

interface ModalDeletePneuProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalDeletePneu: React.FC<ModalDeletePneuProps> = ({
    show,
    onHide,
    id_pneu,
    onSuccess,
}) => {
    // Utilisation du hook useTranslate à l'intérieur du composant
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/deletepneu/${id_pneu}/${geopuserID}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(translate("Erreur lors de la suppression du pneu."));
            }

            const result = await response.json();
            console.log(result);

            toast.success(translate("Pneu supprimé avec succès !"), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error(error);
            toast.error(translate("Erreur lors de la suppression. Veuillez réessayer."), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Supprimer")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{translate("Êtes-vous sûr de vouloir supprimer ce pneu ?")}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {translate("Fermer")}
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    {translate("Supprimer")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeletePneu;
