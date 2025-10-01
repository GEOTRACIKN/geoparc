import React from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";

interface ModalDeleteDeadlineProps {
    show: boolean;
    onHide: () => void;
    id_deadline: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalDeleteDeadline: React.FC<ModalDeleteDeadlineProps> = ({
    show,
    onHide,
    id_deadline,
    onSuccess,
}) => {
    // Move the useTranslate hook inside the component
    const { translate } = useTranslate();

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/deadline/delete/${id_deadline}/${geopuserID}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(translate("Error deleting Deadline."));
            }

            const result = await response.json();
            console.log(result);

            toast.success(translate("Deadline deleted successfully!"), {
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
            toast.error(translate("Error deleting Deadline. Please try again."), {
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
        <Modal show={show} onHide={onHide}>
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

export default ModalDeleteDeadline;
