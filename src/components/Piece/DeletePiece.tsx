import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";

interface ModalDeletePieceProps {
    show: boolean;
    onHide: () => void;
    id_piece: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalDeletePiece: React.FC<ModalDeletePieceProps> = ({
    show,
    onHide,
    id_piece,
    onSuccess,
}) => {
    // Utilisation du hook useTranslate à l'intérieur du composant
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/deletepiece/${id_piece}/${geopuserID}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(translate("Erreur lors de la suppression du piece."));
            }

            const result = await response.json();
            console.log(result);

            toast.success(translate("Piece supprimé avec succès !"), {
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
                <Modal.Title>{translate("Delete")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{translate("Are you sure you want to delete?")}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {translate("Close")}
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    {translate("Delete")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeletePiece;
