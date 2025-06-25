import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../hooks/LanguageProvider";
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
    const imageBase64 = "="; 
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
