import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button, Modal } from 'react-bootstrap';
import { toast, Bounce } from 'react-toastify';

export function formatDateToTimestamp(dateString: string): string {
    if (!dateString) {
      return "-";
    }
    // Créer une nouvelle instance de Date à partir de la chaîne de caractères
    const date = new Date(dateString);
  
    // Extraire les composantes de la date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois vont de 0 à 11
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    // Concaténer les composantes dans le format souhaité
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }
 
  //Fonction sans heure juste la date
  export function toTimestamp(dateString: string): string {
    if (!dateString) {
        return "-";
    }
    // Créer une nouvelle instance de Date à partir de la chaîne de caractères
    const date = new Date(dateString);
  
    // Extraire les composantes de la date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois vont de 0 à 11
    const day = date.getDate().toString().padStart(2, '0');
  
    // Concaténer les composantes dans le format souhaité
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
}

// Fonction généralisée pour générer un fichier Excel
export async function generateExcelFile(
  sheetName: string,
  headers: string[],
  data: any[][]
) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Définition des propriétés de la feuille de calcul pour un affichage plus esthétique
    worksheet.properties.defaultRowHeight = 30;
    worksheet.properties.defaultColWidth = 25;

    // Ajouter les en-têtes à la feuille
    worksheet.addRow(headers).font = { bold: true };

    // Ajouter les données à la feuille
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Générer un fichier Excel en buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Créer un blob pour le téléchargement
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheetName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    // Notification de succès
    toast.success("Le fichier Excel a été téléchargé avec succès.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du fichier Excel :", error);

    // Notification d'erreur
    toast.error("Une erreur s'est produite lors de la génération du fichier Excel.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
}

// Fonction généralisée pour générer un fichier PDF
export async function generatePDFFile(
  sheetName: string,
  headers: string[],
  data: any[][]
) {
  try {
    const doc = new jsPDF();

    // Ajouter un titre
    doc.setFontSize(16);
    doc.text(sheetName, 14, 16);

    // Ajouter les données au PDF
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      margin: { top: 30 },
      styles: { fontSize: 10 },
    });

    // Générer le PDF en buffer
    const blob = doc.output("blob");

    // Créer un URL pour le téléchargement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sheetName}.pdf`; // Nom du fichier basé sur le nom de l'onglet
    a.click();
    window.URL.revokeObjectURL(url);

    // Notification de succès
    toast.success("Le fichier PDF a été téléchargé avec succès.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du fichier PDF :", error);

    // Notification d'erreur
    toast.error("Une erreur s'est produite lors de la génération du fichier PDF.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
}
// Fonction pour gérer la confirmation de téléchargement
export function handleDownloadConfirm(
  format: string,
  downloadExcelFunction: () => void,
  downloadPDFFunction: () => void
) {
  // Sélectionnez le format de téléchargement
  if (format === 'excel') {
    downloadExcelFunction();
  } else if (format === 'pdf') {
    downloadPDFFunction();
  }
}

// Fonction pour le modal de téléchargement
export function DownloadModal({
  show,
  onHide,
  onDownloadConfirm,
}: {
  show: boolean;
  onHide: () => void;
  onDownloadConfirm: (format: string) => void;
 
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Select Download Format</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
       Please select the format to download the data
        <div className="mt-3 d-flex justify-content-center">
          <Button
            variant="success"
            className="mr-2"
            onClick={() => onDownloadConfirm("excel")}
          >
            Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => onDownloadConfirm("pdf")}
          >
            PDF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}


export function engineStat(enginestat: number, speed: number, translate?: (key: string) => string) {
  let iconState = "asset/images/mapicon/stop.png";
  let tooltipMessage = translate ? translate("engineStopped") : "Engine stopped";


  if (enginestat == 0) {

    iconState = "asset/images/mapicon/stop.png";
    tooltipMessage = translate ? translate("engineStopped") : "Engine stopped";

  } else {

    if (enginestat == 1 && speed > 5) {
      iconState = "asset/images/mapicon/on-icon.png";
      tooltipMessage = translate ? translate("engineRunning") : "Engine running";
    } else {
      iconState = "asset/images/mapicon/pause.png";
      tooltipMessage = translate ? translate("enginePaused") : "Engine paused";
    }
  }

  return { iconState, tooltipMessage };
}



export async function getAddressFromCoordinates(lat: number, lon: number): Promise<string> {

  const apiUrl = `https://geotrackin.xyz/nominatim/reverse.php?format=jsonv2&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    const data = await response.json();
    // Assuming your API returns an object with an 'address' property
    const address = data.display_name;
    return address;
  } catch (error: any) { // Explicitly type error as 'any' or 'unknown'
    console.error('Error:', error.message);
    throw new Error('Failed to fetch address');
  }
}

interface BonPDFData {
  client?: string;
  num_bon?: string;
  date_creation?: string | null;
  categorie?: string;
  type?: string;
  quantite?: number;
  prix?: number;
}

interface BonPDFData {
  client?: string;
  num_bon?: string;
  date_creation?: string | null;
  categorie?: string;
  type?: string;
  quantite?: number;
  prix?: number;
}

export function generateBonPDF(d: BonPDFData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ================= TITRE (CENTRÉ) =================
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("BON DE LIVRAISON", doc.internal.pageSize.getWidth() / 2, 50, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const leftX = 40; // société
  const rightX = 400; // client
  const startY = 90;
  const lineHeight = 20;

  // ================= INFOS SOCIÉTÉ (COLONNE GAUCHE) =================
  doc.text("Société :", leftX, startY);
  doc.text("Adresse :", leftX, startY + lineHeight);
  doc.text("Téléphone :", leftX, startY + lineHeight * 2);

  // ================= INFOS CLIENT (COLONNE DROITE) =================
  doc.text(`Client : ${d.client || "-"}`, rightX, startY);
  doc.text(`N° Bon : ${d.num_bon || "-"}`, rightX, startY + lineHeight);
  doc.text(
    `Date : ${
      d.date_creation
        ? toTimestamp(d.date_creation)
        : toTimestamp(new Date().toISOString())
    }`,
    rightX,
    startY + lineHeight * 2
  );

  // ================= TABLEAU PIÈCES =================
  autoTable(doc, {
    startY: startY + lineHeight * 4, // un peu d'espace après les infos
    head: [["Pièce", "Type", "Quantité", "Prix"]],
    body: [
      [
        d.categorie || "",
        d.type || "",
        d.quantite ?? "",
        d.prix ?? "",
      ],
    ],
    styles: {
      fontSize: 10,
      valign: "middle",
    },
    headStyles: {
      fillColor: [249, 115, 22], // ORANGE
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      2: { halign: "center" }, // Quantité centrée
      3: { halign: "center" }, // Prix centré
    },
  });

  // ================= SIGNATURE / CACHET =================
  const finalY = (doc as any).lastAutoTable?.finalY ?? startY + lineHeight * 6;
  doc.text("Signature :", leftX, finalY + 60);
  doc.text("Cachet :", rightX, finalY + 60);

  // ================= DOWNLOAD =================
  doc.save(`Bon_${d.num_bon || "piece"}.pdf`);
}



