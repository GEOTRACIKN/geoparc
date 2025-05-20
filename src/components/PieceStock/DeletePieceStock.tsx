import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";

interface ModalDeletePieceStockProps {
    show: boolean;
    onHide: () => void;
    id_piece_stock: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalDeletePieceStock: React.FC<ModalDeletePieceStockProps> = ({
    show,
    onHide,
    id_piece_stock,
    onSuccess,
}) => {
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/piece_stock/${id_piece_stock}/${geopuserID}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(translate("Error deleting stock entry"));
            }

            toast.success(translate("Stock entry deleted successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            if (onSuccess) onSuccess();
            onHide();

        } catch (error) {
            console.error("Delete error:", error);
            toast.error(translate("Deletion failed. Please try again."), {
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
                <Modal.Title>{translate("Delete Stock Entry")}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {translate("Are you sure you want to delete this stock entry?")}
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {translate("Cancel")}
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    {translate("Confirm Delete")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeletePieceStock;