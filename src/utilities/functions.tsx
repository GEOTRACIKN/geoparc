import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, Modal } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { polygon } from "@turf/helpers";
import area from "@turf/area";
import { lineString } from "@turf/helpers";
import length from "@turf/length";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface PreferencePayload {
  id_user: number;
  id_page: number;
  column_name: string;
}

export async function addHiddenColumn(payload: PreferencePayload) {
  const res = await fetch(`${backendUrl}/api/preference/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to save preference");
  return data;
}

export async function removeHiddenColumn(payload: PreferencePayload) {
  const { id_user, id_page, column_name } = payload;

  const res = await fetch(
    `${backendUrl}/api/preference/delete/${id_user}/${id_page}/${encodeURIComponent(
      column_name
    )}`,
    { method: "DELETE", credentials: "include" }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete preference");
  return data;
}

export async function getHiddenColumns(
  id_user: number,
  id_page: number
): Promise<string[]> {
  const res = await fetch(
    `${backendUrl}/api/preference/hidden/${id_user}/${id_page}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.message || "Failed to load hidden columns");

  return Array.isArray(data) ? data.map((r: any) => r.column_name) : [];
}

export function formatDateToTimestamp(dateString: string): string {
  if (!dateString) {
    return "-";
  }
  // Créer une nouvelle instance de Date à partir de la chaîne de caractères
  const date = new Date(dateString);

  // Extraire les composantes de la date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 car les mois vont de 0 à 11
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Concaténer les composantes dans le format souhaité
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

// Exporter la fonction de copie vers le presse-papiers
export function useClipboard(name: string) {
  const [copiedId, setCopiedId] = useState<string>(name);

  function copyToClipboard(tagValue: string, tagId: string) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = tagValue;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    // Marquer le tag comme copié
    setCopiedId(tagId);
    setTimeout(() => setCopiedId(name), 2000); // Effacer le feedback après 2 secondes
  }

  return { copyToClipboard, copiedId };
}

export function formatToTimestamp(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString(); // ou utilisez des méthodes spécifiques pour obtenir le format souhaité
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
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 car les mois vont de 0 à 11
  const day = date.getDate().toString().padStart(2, "0");

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
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
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
    toast.error(
      "Une erreur s'est produite lors de la génération du fichier Excel.",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
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
    toast.error(
      "Une erreur s'est produite lors de la génération du fichier PDF.",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );
  }
}

// Fonction pour gérer la confirmation de téléchargement
export function handleDownloadConfirm(
  format: string,
  downloadExcelFunction: () => void,
  downloadPDFFunction: () => void
) {
  // Sélectionnez le format de téléchargement
  if (format === "excel") {
    downloadExcelFunction();
  } else if (format === "pdf") {
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
    <Modal show={show} onHide={onHide} centered>
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
          <Button variant="danger" onClick={() => onDownloadConfirm("pdf")}>
            PDF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export function engineStat(
  enginestat: number,
  speed: number,
  translate?: (key: string) => string
) {
  let iconState = "asset/images/mapicon/stop.png";
  let tooltipMessage = translate
    ? translate("engineStopped")
    : "Engine stopped";

  if (enginestat == 0) {
    iconState = "asset/images/mapicon/stop.png";
    tooltipMessage = translate ? translate("engineStopped") : "Engine stopped";
  } else {
    if (enginestat == 1 && speed > 5) {
      iconState = "asset/images/mapicon/on-icon.png";
      tooltipMessage = translate
        ? translate("engineRunning")
        : "Engine running";
    } else {
      iconState = "asset/images/mapicon/pause.png";
      tooltipMessage = translate ? translate("enginePaused") : "Engine paused";
    }
  }

  return { iconState, tooltipMessage };
}

export async function getAddressFromCoordinates(
  lat: number,
  lon: number
): Promise<string> {
  const apiUrl = `https://geotrackin.xyz/nominatim/reverse.php?format=jsonv2&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }
    const data = await response.json();
    // Assuming your API returns an object with an 'address' property
    const address = data.display_name;
    return address;
  } catch (error: any) {
    // Explicitly type error as 'any' or 'unknown'
    console.error("Error:", error.message);
    throw new Error("Failed to fetch address");
  }
}

export function formatDateForAlgeriaTimeZone(dateString: any) {
  // Parse the dateString into a Date object
  const date = new Date(dateString);

  // Convert the date to Algeria time zone
  const options = { timeZone: "Africa/Algiers" };
  const formattedDate = date.toLocaleString(undefined, options);

  // Return the formatted date
  return formattedDate;
}

export function extractObjectName(str: string) {
  // Utilisation d'une expression régulière pour extraire le nom de l'objet
  const match = str.match(/^([A-Z]+)\(.+\)$/);
  console.log(match);
  // Vérification si le nom de l'objet a été trouvé dans la chaîne
  if (match && match[1]) {
    // Retourne le nom de l'objet extrait
    return match[1];
  } else {
    return null; // Retourne null si aucun correspondance n'a été trouvée
  }
}

export interface Geofence {
  id: number;
  type?: "circle" | "polygon" | "polyline" | "marker" | "rectangle";
  center?: [number, number];
  radius?: number;
  positions?: [number, number][];
  position?: [number, number];
}

export function parseGeofenceAttributes(
  areageof: string,
  id: number
): Geofence {
  try {
    let result: Geofence = { id };

    if (areageof.startsWith("POLYGON")) {
      result.type = "polygon";
      const coordinatesString = areageof.slice(9, -2); // Remove "POLYGON((" at the start and "))" at the end
      const coordinatesArray: [number, number][] = coordinatesString
        .split(",")
        .map((coordinatePairString: string) => {
          const [lat, lon] = coordinatePairString
            .trim()
            .split(" ")
            .map(parseFloat);
          return [lat, lon];
        });
      result.positions = coordinatesArray;
    } else if (areageof.startsWith("LINESTRING")) {
      result.type = "polyline";
      const coordinatesString = areageof.slice(11, -1); // Remove "LINESTRING(" at the start and ")" at the end
      const coordinatesArray: [number, number][] = coordinatesString
        .split(",")
        .map((coordinatePairString: string) => {
          const [lat, lon] = coordinatePairString
            .trim()
            .split(" ")
            .map(parseFloat);
          return [lat, lon];
        });
      result.positions = coordinatesArray;
    } else if (areageof.startsWith("CIRCLE")) {
      result.type = "circle";
      const coords = areageof.slice(7, -1).split(",").map(parseFloat); // Remove "CIRCLE(" at the start and ")" at the end
      result.center = [coords[0], coords[1]];
      result.radius = coords[2];
    } else {
      console.error("Type de zone non pris en charge :", areageof);
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de l'analyse de la chaîne d'attributs geofence :",
      error
    );
    return {
      id: id,
      type: undefined,
    };
  }
}

// Définir les types pour les géofences
type CircleGeofence = {
  type: "CIRCLE";
  radius: number; // en mètres
};

type RectangleGeofence = {
  type: "RECTANGLE";
  width: number; // en mètres
  height: number; // en mètres
};

type PolygonGeofence = {
  type: "POLYGON";
  vertices: { x: number; y: number }[]; // Liste des sommets du polygone
};

type LineStringGeofence = {
  type: "LINESTRING";
  points: { x: number; y: number }[]; // Liste des points de la ligne
};

// Type générique pour les géofences
type Geofencing = CircleGeofence | PolygonGeofence | LineStringGeofence;

// Fonction pour analyser la chaîne et retourner un objet Geofence
export function parseGeofencing(input: string): Geofencing {
  const match = input.match(/^(\w+)\(([^,]+),[^,]+,(\d+(\.\d+)?)\)$/);

  if (match && match[1] === "CIRCLE") {
    return {
      type: "CIRCLE",
      radius: parseFloat(match[3]),
    };
  }

  // Expression régulière pour capturer le type POLYGON
  const polygonMatch = input.match(/^POLYGON\(\(([^)]+)\)\)$/);
  if (polygonMatch) {
    // Capturer les coordonnées des sommets
    const vertices = polygonMatch[1]
      .split(",")
      .map((coord) => coord.trim().split(" ").map(Number))
      .map(([x, y]) => ({ x, y })); // Convertir en objets { x, y }

    return {
      type: "POLYGON",
      vertices,
    };
  }

  const lineStringMatch = input.match(/^LINESTRING\(([^)]+)\)$/);
  if (lineStringMatch) {
    const points = lineStringMatch[1].split(",").map((point) => {
      const [x, y] = point.split(" ").map((coord) => parseFloat(coord));
      return { x, y };
    });
    return {
      type: "LINESTRING",
      points,
    };
  }

  throw new Error("Type de géofence inconnu ou format invalide");
}

// Fonction pour calculer la surface ou la longueur
export const calculateSurfaceOrLength = (geofence: Geofencing): number => {
  switch (geofence.type) {
    case "CIRCLE":
      // Surface d'un cercle: π * r^2
      return (Math.PI * Math.pow(geofence.radius, 2)) / 1000;

    case "POLYGON":
      // Surface d'un polygone: algorithme de l'aire de Shoelace

      console.log("geofence.vertices");

      const vertices = geofence.vertices;
      const coordinates = vertices.map((vertex) => [vertex.x, vertex.y]);

      // Ajouter le premier point à la fin pour fermer le polygone
      coordinates.push(coordinates[0]);

      // Créer le polygone avec Turf
      const poly = polygon([coordinates]);

      // Calculer l'aire en mètres carrés
      const areaInSquareMeters = area(poly);

      // Conversion en kilomètres carrés
      const areaInSquareKilometers = areaInSquareMeters / 1000;
      console.log("Area in square:", areaInSquareKilometers);
      return areaInSquareKilometers;

    case "LINESTRING":
      // Longueur d'une ligne: somme des distances entre les points

      const points = geofence.points.map((vertex) => [vertex.x, vertex.y]);

      // Créer un LINESTRING avec Turf
      const line = lineString(points);

      // Calculer la distance du LINESTRING
      const distance = length(line, { units: "kilometers" });

      return distance;

    default:
      throw new Error("Type de géofence inconnu");
  }
};

export const formatDate = (inputDate: string | Date | null | undefined) => {
  if (!inputDate) return "--/--/----"; // Valeur par défaut si null ou undefined

  if (inputDate instanceof Date) {
    // Si c'est un objet Date, on formate directement
    return format(inputDate, "dd/MM/yyyy");
  }

  if (typeof inputDate === "string") {
    // Vérifier si la chaîne est bien une date
    const parsedDate = parseISO(inputDate);
    if (isValid(parsedDate)) {
      return format(parsedDate, "dd/MM/yyyy");
    }

    // Si la date est sous format MM/DD/YYYY, on la convertit
    const parts = inputDate.split("/");
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${day}/${month}/${year}`; // Conversion MM/DD/YYYY -> DD/MM/YYYY
    }
  }

  return "--/--/----"; // Si aucun format valide
};
