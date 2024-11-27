import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

interface ModalDeletePharmacyProps {
    show: boolean;
    onHide: () => void;
    id_pharmacy: number | null;
    onSuccess?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

const ModalDeletePharmacy: React.FC<ModalDeletePharmacyProps> = ({
    show,
    onHide,
    id_pharmacy,
    onSuccess,
}) => {
    const handleDelete = async () => {
    
        try {
            // Updated URL to include both id_pharmacy and id_user
            const response = await fetch(
                `${backendUrl}/api/geop/deletepharmacy/${id_pharmacy}/${geopuserID}`,
                {
                    method: "DELETE",
                }
            );
    
            if (!response.ok) {
                throw new Error("Error deleting pharmacy.");
            }
    
            const result = await response.json();
            console.log(result);
    
            toast.success("Pharmacy deleted successfully!", {
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
            toast.error("Error deleting pharmacy. Please try again.", {
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
                <Modal.Title>Delete Pharmacy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this pharmacy?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeletePharmacy;
