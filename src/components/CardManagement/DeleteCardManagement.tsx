import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";

interface DeleteCardManagementProps {
    show: boolean;
    onHide: () => void;
    recordId?: number;
    onSuccess: () => void;
    vehicleInfo?: string; // Optionnel: info supplémentaire pour la confirmation
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DeleteCardManagement: React.FC<DeleteCardManagementProps> = ({
    show,
    onHide,
    recordId,
    onSuccess,
    vehicleInfo
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
        const response = await fetch(`${backendUrl}/api/geop/deletefuelcard/${recordId}/${geopuserID}`, {                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to delete record");

            toast.success(translate("Record deleted successfully"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            onSuccess();
            onHide();
        } catch (error) {
            console.error("Error deleting record:", error);
            toast.error(translate("Error deleting record"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{translate("Confirm Deletion")}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <p>
                    {translate("Are you sure you want to delete this fuel card record?")}
                </p>
                {vehicleInfo && (
                    <p className="fw-bold">
                        {translate("Vehicle")}: {vehicleInfo}
                    </p>
                )}
                <p className="text-danger">
                    {translate("This action cannot be undone.")}
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="secondary" 
                    onClick={onHide}
                    disabled={isDeleting}
                >
                    {translate("Cancel")}
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {translate("Deleting...")}
                        </>
                    ) : (
                        translate("Delete")
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteCardManagement;