import React from "react";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MissionReportModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null;
  title?: string | null;
  IdUser: number;
  IdMissionReport: number;
  selectedMissionReport: any;
  updateMissionReportList: () => void | Promise<void>;
}

const MissionReportModal: React.FC<MissionReportModalProps> = ({
  show,
  onHide,
  status,
  title,
  IdUser,
  IdMissionReport,
  selectedMissionReport,
  updateMissionReportList,
}) => {
  const { translate } = useTranslate();

  function formatDatetimeLocal(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  const handleDownloadPreview = () => {
    if (!selectedMissionReport) {
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
    doc.text(`${translate("Mission Report No")} : ${String(selectedMissionReport.id_misrap)}`, 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(`${translate("Subject")} : ${String(selectedMissionReport.objt_misrap || '')}`, 105, 30, { align: "center" });

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
    doc.text(`${translate("Departure Place")}:`, 20, yPosition + 50);
    doc.text(`${translate("Mission Place")}:`, 20, yPosition + 60);
    doc.text(`${translate("Amortization")}:`, 20, yPosition + 70);

    // Colonne droite
    doc.text(`${translate("Departure Date")}:`, 110, yPosition);
    doc.text(`${translate("Return Date")}:`, 110, yPosition + 10);
    doc.text(`${translate("Expenses")}:`, 110, yPosition + 20);
    doc.text(`${translate("Accompaniment")}:`, 110, yPosition + 30);
    doc.text(`${translate("Itinerary")}:`, 110, yPosition + 40);

    // Valeurs
    doc.setFont("helvetica", "normal");
    doc.text(String(selectedMissionReport?.ref_misrap || "N/A"), 60, yPosition);
    doc.text(String(selectedMissionReport?.carb_misrap || "N/A"), 60, yPosition + 10);
    doc.text(String(selectedMissionReport?.immatriculation_vehicule || "N/A"), 60, yPosition + 20);
    doc.text(String(selectedMissionReport?.remorque_misrap || "N/A"), 60, yPosition + 30);
    doc.text(String(selectedMissionReport?.cond_misrap || "N/A"), 60, yPosition + 40);
    doc.text(String(selectedMissionReport?.dep_misrap || "N/A"), 60, yPosition + 50);
    doc.text(String(selectedMissionReport?.lieu_misrap || "N/A"), 60, yPosition + 60);
    doc.text(String(selectedMissionReport?.amort_misrap || "N/A"), 60, yPosition + 70);

    doc.text(formatDatetimeLocal(selectedMissionReport?.date_dep_misrap) || "N/A", 150, yPosition);
    doc.text(formatDatetimeLocal(selectedMissionReport?.date_arr_misrap) || "N/A", 150, yPosition + 10);
    doc.text(String(selectedMissionReport?.frais_misrap || "N/A"), 150, yPosition + 20);
    doc.text(String(selectedMissionReport?.acc_misrap || "N/A"), 150, yPosition + 30);
    doc.text(String(selectedMissionReport?.itnr_misrap || "N/A"), 150, yPosition + 40);

    // Table data
    const tableData = [
      [
        translate("Return KM"), 
        translate("Distance"), 
        translate("Nights"), 
        translate("Immobilization"), 
        translate("Duration")
      ],
      [
        String(selectedMissionReport?.km_ret_misrap || "N/A"),
        String(selectedMissionReport?.dist_misrap || "N/A"),
        String(selectedMissionReport?.nuit_misrap || "N/A"),
        String(selectedMissionReport?.immob_misrap || "N/A"),
        String(selectedMissionReport?.durr_misrap || "N/A")
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

    doc.save(`${translate("Mission_order")}_${selectedMissionReport.id_misrap}.pdf`);

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
          {selectedMissionReport ? (
            <>
              {/* Main title */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#2c3e50'
                }}>
                  {translate("Mission Report No")} : {selectedMissionReport.id_misrap}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#7f8c8d'
                }}>
                  {translate("Subject")} : {selectedMissionReport.objt_misrap}
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
                      {selectedMissionReport.ref_misrap}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Fuel type")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionReport.carb_misrap}
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
                      {selectedMissionReport.immatriculation_vehicule}
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
                      {selectedMissionReport.remorque_misrap || "-"}
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
                      {selectedMissionReport.cond_misrap}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Departure Place")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionReport.lieu_misrap}
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
                      {formatDatetimeLocal(selectedMissionReport.date_dep_misrap)}
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
                      {formatDatetimeLocal(selectedMissionReport.date_arr_misrap)}
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
                      {selectedMissionReport.frais_misrap || "-"}
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
                      {selectedMissionReport.acc_misrap || "-"}
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
                      {selectedMissionReport.itnr_misrap || "-"}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Mission Place")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionReport.lieu_misrap}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#34495e'
                    }}>
                      {translate("Amortization")}
                    </label>
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}>
                      {selectedMissionReport.amort_misrap}
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
                          {translate("Return KM")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Distance")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Nights")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Immobilization")}
                        </th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {translate("Duration")}
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
                          {selectedMissionReport.km_ret_misrap || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionReport.dist_misrap || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionReport.nuit_misrap || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionReport.immob_misrap || "N/A"}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'center',
                          border: '1px solid #ddd'
                        }}>
                          {selectedMissionReport.durr_misrap || "N/A"}
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

export default MissionReportModal;