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
    doc.setFontSize(16);
    // Add an image at the top-left corner
    const imageBase64 = "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"; 
    doc.addImage(imageBase64, "PNG", 10, 10, 30, 30); // Position x:10, y:10, largeur:30, hauteur:30
  
    // Add a title
    

    const title = `Mission Order ID : ${selectedMissionOrder.id_mission}`;
    doc.text(title, 105, 20, { align: "center" });
  
    // Add the subtitle: object_mission
    doc.setFontSize(14);
    const subtitle = `Object : ${selectedMissionOrder.object_mission}`;
    doc.text(subtitle, 105, 30, { align: "center" });

    doc.setFontSize(12);

  
              
// Titles
doc.text("Mission Ref :", 20, 50); 
doc.text("Object :", 20, 60);
doc.text("Mission Date:", 20, 70);
doc.text("Vehicle  :", 20, 80); // Updated label for vehicle registration
doc.text("Trailer :", 20, 90);
doc.text("Driver :", 20, 100);
doc.text("Departure Location :", 20, 110);
doc.text("Departure Date-Time :", 20, 120);

// Added missing fields here before setting font to bold
doc.text("Expenses :", 20, 130); // Added label for expenses
doc.text("Tank :", 20, 140); // Added label for tank
doc.text("Accompaniment :", 20, 150); // Added label for accompaniment
doc.text("Return Date :", 20, 160); // Added label for return date-time

// Set bold for values
doc.setFont("helvetica", "bold"); // Set bold font for values

// Values (in bold)
doc.text(`${selectedMissionOrder?.ref_mission || "N/A"}`, 70, 50);
doc.text(`${selectedMissionOrder?.object_mission || "N/A"}`, 70, 60);
doc.text(`${selectedMissionOrder?.date_mission || "N/A"}`, 70, 70);
doc.text(`${selectedMissionOrder?.immatriculation_vehicule || "N/A"}`, 70, 80);
doc.text(`${selectedMissionOrder?.trailer_mission || "N/A"}`, 70, 90);
doc.text(`${selectedMissionOrder?.driver_mission || "N/A"}`, 70, 100);
doc.text(`${selectedMissionOrder?.dep_loc_mission || "N/A"}`, 70, 110);
doc.text(`${selectedMissionOrder?.dep_date_mission || "N/A"}`, 70, 120);

doc.text(`${selectedMissionOrder?.expenses_mission || "N/A"}`, 70, 130); // Added
doc.text(`${selectedMissionOrder?.tank_mission || "N/A"}`, 70, 140); // Added
doc.text(`${selectedMissionOrder?.accomp_mission || "N/A"}`, 70, 150); // Added
doc.text(`${selectedMissionOrder?.return_date_mission || "N/A"}`, 70, 160); // Added




            
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
      head: [tableData[0]], // Titles row
      body: [tableData[1]], // Values row
      startY: 200,
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


 // Define the table data
const tableFuel = [
  // First row - labels
  [
    "Fuel Loading Type",
    "Fuel Type",
    "Fuel Cost",
    "Fuel Level",
  ],
  // Second row - values from selectedMissionOrder
  [
    selectedMissionOrder?.fuel_loading_mission || "N/A",
    selectedMissionOrder?.fuel_type_mission || "N/A",
    selectedMissionOrder?.fuel_cost_mission || "N/A",
    selectedMissionOrder?.fuel_level_mission || "N/A",
  ],
];

// Get the page width
const pageWidth = doc.internal.pageSize.width;

// Calculate the table width by summing up the cell widths (adjust if needed)
const tableWidth = 30 * tableFuel[0].length; // Assuming all cells are 30px wide, adjust this calculation if necessary

// Calculate margin.left to center the table horizontally
const marginLeft = (pageWidth - tableWidth) / 2;

// Generate the table with autoTable
autoTable(doc, {
  head: [tableFuel[0]], // Titles row
  body: [tableFuel[1]], // Values row
  startY: 250, // Set the Y position
  margin: { left: marginLeft, right: 20 }, // Center the table horizontally using margin.left
  theme: "grid",
  columnStyles: {
    0: { cellWidth: 30 },
    1: { cellWidth: 30 },
    2: { cellWidth: 30 },
    3: { cellWidth: 30 },
  },
  styles: {
    fontSize: 10,
    cellPadding: 4,
    halign: "center", // Align text horizontally within cells
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
    doc.save("MissionOrder.pdf");
  
    // Show success toast
    toast.success("Mission Order downloaded as PDF", {
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
    <Modal
    show={show}
    onHide={onHide}
    centered
    size="lg"
    dialogClassName="pdf-modal"
    style={{
      width: '794px', // Width of A4 in pixels
      height: '1123px', // Height of A4 in pixels
      maxWidth: '100%',
      margin: 'auto', // This centers the modal horizontally
      top: '50%', // Start at the vertical center of the viewport
      left: '50%', // Start at the horizontal center of the viewport
      transform: 'translate(-50%, -50%)', // Adjust both horizontal and vertical positioning
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title style={{ fontWeight: "bold", color: "grey" }}>
        {title || ""}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ overflowY: "auto", height: 'calc(100% - 60px)' }}>
      {selectedMissionOrder ? (
        <div>
          <p><strong>Mission Order ID:</strong> {selectedMissionOrder.ref_mission}</p>
          <p><strong>Object:</strong> {selectedMissionOrder.object_mission}</p>
          <p><strong>Mission Date:</strong> {selectedMissionOrder.date_mission}</p>
          <p><strong>Vehicle:</strong> {selectedMissionOrder.immatriculation_vehicule}</p>
          <p><strong>Trailer:</strong> {selectedMissionOrder.trailer_mission || "-"}</p>
          <p><strong>Driver:</strong> {selectedMissionOrder.driver_mission}</p>
          <p><strong>Departure Location:</strong> {selectedMissionOrder.dep_loc_mission}</p>
          <p><strong>Departure Date-Time:</strong> {selectedMissionOrder.dep_date_mission}</p>
          <p><strong>Destination:</strong> {selectedMissionOrder.destination_mission}</p>
          <p><strong>Expenses:</strong> {selectedMissionOrder.expenses_mission || "-"}</p> 
          <p><strong>Tank:</strong> {selectedMissionOrder.tank_mission || "-"}</p> 
          <p><strong>Accompaniment:</strong> {selectedMissionOrder.accomp_mission || "-"}</p> 
          <p><strong>Return Date:</strong> {selectedMissionOrder.return_date_mission || "-"}</p> 

  
          <table className="table table-bordered" style={{ width: "100%", marginTop: "20px", borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "center", fontWeight: "bold" }}>KM</th>
                <th scope="col" style={{ textAlign: "center", fontWeight: "bold" }}>New KM</th>
                <th scope="col" style={{ textAlign: "center", fontWeight: "bold" }}>Itinerary</th>
                <th scope="col" style={{ textAlign: "center", fontWeight: "bold" }}>Distance</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedMissionOrder.vehicle_km_mission || "N/A"}</td>
                <td>{selectedMissionOrder.new_km_mission || "N/A"}</td>
                <td>{selectedMissionOrder.itinerary_mission || "N/A"}</td>
                <td>{selectedMissionOrder.distance_travelled || "N/A"}</td>



              </tr>
            
            </tbody>
          </table>
  
          <button
            className="btn btn-outline-primary"
            onClick={handleDownloadPreview}
            style={{ marginTop: "20px", display: "block", width: "100%" }}
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
