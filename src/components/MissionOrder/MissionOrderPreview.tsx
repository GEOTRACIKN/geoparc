import React from "react";
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

  function formatDatetimeLocal(dateString: string | number): string {
    if (!dateString) return "";
    const date = typeof dateString === 'number' 
      ? new Date(dateString * 1000) 
      : new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  const handleDownloadPreview = () => {
    if (!selectedMissionOrder) {
      toast.warn(translate("No mission order selected"), {
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

    // Configuration du document
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${translate("Mission Order No")} : ${String(selectedMissionOrder.id_mission)}`, 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(`${translate("Subject")} : ${String(selectedMissionOrder.object_mission || '')}`, 105, 30, { align: "center" });

    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 40, 190, 40);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Colonne gauche
    let yPosition = 50;
    doc.setFont("helvetica", "bold");
    doc.text(`${translate("Mission Reference")}:`, 20, yPosition);
    doc.text(`${translate("Fuel type")}:`, 20, yPosition + 10);
    doc.text(`${translate("Vehicle")}:`, 20, yPosition + 20);
    doc.text(`${translate("Trailer")}:`, 20, yPosition + 30);
    doc.text(`${translate("Driver")}:`, 20, yPosition + 40);
    doc.text(`${translate("Departure Location")}:`, 20, yPosition + 50);
    doc.text(`${translate("Destination")}:`, 20, yPosition + 60);
    doc.text(`${translate("Expenses")}:`, 20, yPosition + 70);

    // Colonne droite
    doc.text(`${translate("Departure Date")}:`, 110, yPosition);
    doc.text(`${translate("Return Date")}:`, 110, yPosition + 10);
    doc.text(`${translate("Fuel loading")}:`, 110, yPosition + 20);
    doc.text(`${translate("Accompaniment")}:`, 110, yPosition + 30);
    doc.text(`${translate("Itinerary")}:`, 110, yPosition + 40);
    doc.text(`${translate("Tank")}:`, 110, yPosition + 50);

    // Valeurs
    doc.setFont("helvetica", "normal");
    doc.text(String(selectedMissionOrder?.ref_mission || "N/A"), 60, yPosition);
    doc.text(String(selectedMissionOrder?.fuel_type_mission || "N/A"), 60, yPosition + 10);
    doc.text(String(selectedMissionOrder?.immatriculation_vehicule || "N/A"), 60, yPosition + 20);
    doc.text(String(selectedMissionOrder?.trailer_mission || "N/A"), 60, yPosition + 30);
    doc.text(String(selectedMissionOrder?.driver_mission || "N/A"), 60, yPosition + 40);
    doc.text(String(selectedMissionOrder?.dep_loc_mission || "N/A"), 60, yPosition + 50);
    doc.text(String(selectedMissionOrder?.dep_dest_mission || "N/A"), 60, yPosition + 60);
    doc.text(String(selectedMissionOrder?.expenses_mission || "N/A"), 60, yPosition + 70);

    doc.text(formatDatetimeLocal(selectedMissionOrder?.dep_date_mission) || "N/A", 150, yPosition);
    doc.text(formatDatetimeLocal(selectedMissionOrder?.return_date_mission) || "N/A", 150, yPosition + 10);
    doc.text(String(selectedMissionOrder?.fuel_loading_mission || "N/A"), 150, yPosition + 20);
    doc.text(String(selectedMissionOrder?.accomp_mission || "N/A"), 150, yPosition + 30);
    doc.text(String(selectedMissionOrder?.itinerary_mission || "N/A"), 150, yPosition + 40);
    doc.text(String(selectedMissionOrder?.tank_mission || "N/A"), 150, yPosition + 50);

    // Table data
    const tableData = [
      [
        translate("Vehicle KM"), 
        translate("New KM"), 
        translate("Fuel cost"), 
        translate("Fuel level"), 
        translate("Voucher")
      ],
      [
        String(selectedMissionOrder?.vehicle_km_mission || "N/A"),
        String(selectedMissionOrder?.new_km_mission || "N/A"),
        String(selectedMissionOrder?.fuel_cost_mission || "N/A"),
        String(selectedMissionOrder?.fuel_level_mission || "N/A"),
        String(selectedMissionOrder?.voucher_mission || "N/A")
      ]
    ];

    // Génération du tableau
    autoTable(doc, {
      head: [tableData[0]],
      body: [tableData[1]],
      startY: yPosition + 90,
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      margin: { left: 20 }
    });

    doc.save(`${translate("Mission_order")}_${selectedMissionOrder.id_mission}.pdf`);

    toast.success(translate("PDF generated successfully"), {
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

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }}>
      <div style={{
        width: '800px',
        maxWidth: '95%',
        maxHeight: '90vh',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderBottom: '2px solid #333',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {translate("Mission Order Details")}
          </h2>
          <button 
            onClick={onHide}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#333'
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 130px)'
        }}>
          {selectedMissionOrder ? (
            <>
              {/* Main title */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#2c3e50'
                }}>
                  {translate("Mission Order No")} : {selectedMissionOrder.id_mission}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#7f8c8d'
                }}>
                  {translate("Subject")} : {selectedMissionOrder.object_mission}
                </p>
              </div>

              <hr style={{ border: '1px solid #eee', margin: '20px 0' }} />

              {/* Two columns content */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '25px'
              }}>
                {/* Left column */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Mission Reference")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.ref_mission}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Fuel Type")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.fuel_type_mission}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Vehicle")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.immatriculation_vehicule}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Trailer")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.trailer_mission || "-"}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Driver")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.driver_mission}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Departure Location")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.dep_loc_mission}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Destination")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.dep_dest_mission}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Expenses")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.expenses_mission || "-"}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Departure date")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {formatDatetimeLocal(selectedMissionOrder.dep_date_mission)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Return date")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {formatDatetimeLocal(selectedMissionOrder.return_date_mission)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Fuel loading")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.fuel_loading_mission || "-"}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Accompaniment")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.accomp_mission || "-"}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Itinerary")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.itinerary_mission || "-"}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Tank")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionOrder.tank_mission || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical details table */}
              <div style={{ margin: '25px 0' }}>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  textAlign: 'center'
                }}>
                  {translate("Technical Details")}
                </h4>
                <div style={{
                  overflowX: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{
                        backgroundColor: '#2c3e50',
                        color: 'white'
                      }}>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Vehicle KM")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("New KM")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Fuel cost")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Fuel level")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Voucher")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionOrder.vehicle_km_mission || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionOrder.new_km_mission || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionOrder.fuel_cost_mission || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionOrder.fuel_level_mission || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionOrder.voucher_mission || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Download button */}
              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button
                  onClick={handleDownloadPreview}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a252f'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}
                >
                  {translate("Download PDF")}
                </button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#7f8c8d'
            }}>
              {translate("No data available")}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '15px',
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <button
            onClick={onHide}
            style={{
              padding: '10px 25px',
              backgroundColor: 'white',
              color: '#2c3e50',
              border: '2px solid #2c3e50',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2c3e50';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#2c3e50';
            }}
          >
            {translate("Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionOrderModal;