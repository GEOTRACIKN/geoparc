import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MissionOrderModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null;
  title?: string | null;
  IdUser: number;
  IdMissionOrder: number;
  selectedMissionOrder: any;
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

  // Download PDF preview of the mission order
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
  
    // Set font for the document
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    // Add a title
    doc.text("Mission Order Preview", 105, 20, { align: "center" });
  
    // Add the mission details as text (not in a table)
    doc.text(`Mission Ref: ${selectedMissionOrder?.ref_mission || "N/A"}`, 20, 30);
    doc.text(`Object: ${selectedMissionOrder?.object_mission || "N/A"}`, 20, 40);
    doc.text(`Mission Date: ${selectedMissionOrder?.date_mission || "N/A"}`, 20, 50);
    doc.text(`Vehicle: ${selectedMissionOrder?.immatriculation_vehicule || "N/A"}`, 20, 60);
    doc.text(`Trailer: ${selectedMissionOrder?.trailer_mission || "N/A"}`, 20, 70);
    doc.text(`Driver: ${selectedMissionOrder?.driver_mission || "N/A"}`, 20, 80);
    doc.text(`Function: ${selectedMissionOrder?.function_mission || "N/A"}`, 20, 90);
    doc.text(`Departure Location: ${selectedMissionOrder?.dep_loc_mission || "N/A"}`, 20, 100);
    doc.text(`Departure Date-Time: ${selectedMissionOrder?.dep_date_mission || "N/A"}`, 20, 110);
  
    // Data for the table with the specified fields
    const tableData = [
      // First row - labels
      [
        "Departure Mileage",
        "New KM",
        "Itinerary",
        "Distance Travelled",
        "Number of Nights",
        "Idle Time (Days)",
      ],
      // Second row - values from selectedMissionOrder
      [
        selectedMissionOrder?.vehicle_km_mission || "N/A",
        selectedMissionOrder?.new_km_mission || "N/A",
        selectedMissionOrder?.itinerary_mission || "N/A",
        selectedMissionOrder?.distance_travelled || "N/A",
        selectedMissionOrder?.nights || "N/A",
        selectedMissionOrder?.idle_time || "N/A",
      ],
    ];
  
    // Generate the table with autoTable
    autoTable(doc, {
      head: [tableData[0]],  // Titles row
      body: [tableData[1]],  // Values row
      startY: 120,
      margin: { left: 20, right: 20 },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
    });
  
    // Save the PDF
    doc.save("MissionOrder_Preview.pdf");
  
    // Show success toast
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
      <Modal.Body>
        {selectedMissionOrder ? (
          <div>
            <p><strong>Ordre de mission N°:</strong> {selectedMissionOrder.ref_mission}</p>
            <p><strong>Objet:</strong> {selectedMissionOrder.object_mission}</p>
            <p><strong>Référence #</strong> {selectedMissionOrder.ref_mission}</p>
            <p><strong>Date Mission:</strong> {selectedMissionOrder.date_mission}</p>
            <p><strong>Véhicule:</strong> {selectedMissionOrder.immatriculation_vehicule}</p>
            <p><strong>Remorque:</strong> {selectedMissionOrder.trailer_mission || "-"}</p>
            <p><strong>Conducteur:</strong> {selectedMissionOrder.driver_mission}</p>
            <p><strong>Fonction:</strong> {selectedMissionOrder.function_mission || "-"}</p>
            <p><strong>Lieu de départ:</strong> {selectedMissionOrder.dep_loc_mission}</p>
            <p><strong>Date-heure départ:</strong> {selectedMissionOrder.dep_date_mission}</p>
            <p><strong>Destination:</strong> {selectedMissionOrder.destination_mission}</p>

            {/* Table for Kilométrage and other details */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Détails</th>
                  <th scope="col">Valeurs</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Kilométrage de départ</td><td>{selectedMissionOrder.departure_mileage}</td></tr>
                <tr><td>Kilométrage "auto"</td><td>{selectedMissionOrder.auto_mileage}</td></tr>
                <tr><td>Kilométrage de retour</td><td>{selectedMissionOrder.return_mileage}</td></tr>
                <tr><td>Distance parcourue</td><td>{selectedMissionOrder.distance_travelled}</td></tr>
                <tr><td>Nombre de nuitées</td><td>{selectedMissionOrder.nights}</td></tr>
                <tr><td>Immobilisation (J)</td><td>{selectedMissionOrder.idle_time}</td></tr>
              </tbody>
            </table>

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
