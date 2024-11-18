import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { jsPDF } from "jspdf";
import { Bounce, toast } from "react-toastify";

interface MissionOrderModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null;
  title?: string | null;
  IdUser: number;
  IdMissionOrder: number;
  selectedMissionOrder: any; // L'objet mission sélectionné
  updateMissionOrderList: () => void | Promise<void>;
}

const MissionOrderModal: React.FC<MissionOrderModalProps> = ({
  show,
  onHide,
  status,
  title,
  IdUser,
  IdMissionOrder,
  selectedMissionOrder,
  updateMissionOrderList,
}) => {
  const { translate } = useTranslate();

  // Fonction de téléchargement du PDF
  const handleDownloadPreview = () => {
    if (!selectedMissionOrder) {
      toast.warn("No mission order selected", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const doc = new jsPDF();

    // Récupérer le contenu du modal
    const content = `
      Mission Ref: ${selectedMissionOrder?.ref_mission}
      Object: ${selectedMissionOrder?.object_mission}
      Driver: ${selectedMissionOrder?.driver_mission}
      Vehicle: ${selectedMissionOrder?.immatriculation_vehicule}
      Departure Location: ${selectedMissionOrder?.dep_loc_mission}
      Itinerary: ${selectedMissionOrder?.itinerary_mission}
    `;

    // Ajouter le contenu au PDF
    doc.text(content, 10, 10);

    // Télécharger le PDF
    doc.save("MissionOrder_Preview.pdf");

    toast.success("Preview downloaded as PDF", {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold", color: "grey" }}>
          {title || ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {selectedMissionOrder ? (
          <div>
            <p>
              <strong>{translate("Mission Ref")}:</strong>{" "}
              {selectedMissionOrder.ref_mission}
            </p>
            <p>
              <strong>{translate("Object")}:</strong>{" "}
              {selectedMissionOrder.object_mission}
            </p>
            <p>
              <strong>{translate("Driver")}:</strong>{" "}
              {selectedMissionOrder.driver_mission}
            </p>
            <p>
              <strong>{translate("Vehicle")}:</strong>{" "}
              {selectedMissionOrder.immatriculation_vehicule}
            </p>
            <p>
              <strong>{translate("Departure Location")}:</strong>{" "}
              {selectedMissionOrder.dep_loc_mission}
            </p>
            <p>
              <strong>{translate("Itinerary")}:</strong>{" "}
              {selectedMissionOrder.itinerary_mission}
            </p>
            <button
              className="btn btn-outline-primary"
              onClick={handleDownloadPreview}
            >
              {translate("Download Preview")}
            </button>
          </div>
        ) : (
          <p>{translate("No data available")}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-danger mt-2 mx-auto" onClick={onHide}>
          {translate("Close")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MissionOrderModal;
