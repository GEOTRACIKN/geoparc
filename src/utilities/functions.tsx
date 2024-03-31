import * as XLSX from 'xlsx';



export function formatToTimestamp(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString(); // ou utilisez des méthodes spécifiques pour obtenir le format souhaité
  return formattedDate;
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



export function engineStatClass(enginestat: number, speed: number) {

  let iconState = "stop";

  if (enginestat == 0) {
    iconState = "stop";
  }
  else {
    if (enginestat == 1 && speed > 5) {
      iconState = "move";
    } else {
      iconState = "pause";
    }
  }

  return iconState;
}


export function Distance(distanceEnMetres: number | null): string {
  if (distanceEnMetres === null || isNaN(distanceEnMetres)) {
    return "0 m";
  }

  if (distanceEnMetres < 1000) {
    return `${distanceEnMetres} m`;
  } else {
    const distanceEnKilometres = distanceEnMetres / 1000;
    return distanceEnKilometres.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " km";
  }
}

export function toTimestamp(dateString: string): string {
  // Remove the 'T' and '.000Z' from the date string
  return dateString.replace('T', ' ').replace('.000Z', '');
}

export function directionStat(direction: number) {



  let iconState = "las la-stop blue";


  return iconState;
}

// functions.ts
export function BarreReseau(gsmlvl: number) {
  if (gsmlvl < 20) {
    return "las la-signal fs-2 ; color: red;";
  } else if (gsmlvl >= 20 && gsmlvl < 50) {
    return "las la-signal fs-2 ; color: orange;";
  } else if (gsmlvl >= 50 && gsmlvl < 80) {
    return "las la-signal fs-2 ; color: yellow;";
  } else {
    return "las la-signal fs-2 ; color: green;";
  }
}

export function ValiderPosition(NST: number): string {
  return NST === 1 ? "lab la-font-awesome-flag fs-2 green" : "lab la-font-awesome-flag fs-2 red";
}

export function renderStateCell(state: number, onClickCallback?: () => void) {
  const handleClick = () => {
    if (onClickCallback && state === 1) {
      onClickCallback();
    }
  };

  if (state === 1) {
    return (
      <td onClick={handleClick} style={{ cursor: 'pointer' }}>
        <i className="las la-file-invoice" style={{ color: 'green', fontSize: '24px' }}></i>
      </td>
    );
  } else {
    return (
      <td onClick={handleClick} style={{ cursor: 'not-allowed' }}>
        <i className="las la-file-invoice" style={{ color: 'gray', fontSize: '24px' }}></i>
      </td>
    );
  }
};



export function getReportName(type: string, translate: (key: string) => string): string {
  switch (type) {
    case "1":
      return translate("Reconstitution d'itinéraire");
    case "2":
      return translate("Rapport de proximité");
    case "3":
      return translate("Alarmes");
    case "4":
      return translate("Diagramme de distance, vitesse et contact");
    case "5":
      return translate("Diagramme de réservoir de carburant (IO)");
    case "6":
      return translate("Diagramme de signal GSM et GPS");
    case "7":
      return translate("Diagramme du moteur");
    case "8":
      return translate("Diagramme de distance et de consommation (CAN)");
    case "10":
      return translate("Rapport de contact");
    case "11":
      return translate("Statistiques de RPM (CAN)");
    case "12":
      return translate("Statistiques de vitesse (CAN)");
    case "13":
      return translate("Statistiques de vitesse");
    case "14":
      return translate("Diagramme de Gantt sur la proximité");
    case "15":
      return translate("Diagramme de Gantt sur le contact");
    case "16":
      return translate("Diagramme d'état du système");
    case "17":
      return translate("Trafic mobile");
    case "18":
      return translate("Diagramme de réservoir de carburant");
    case "19":
      return translate("Diagramme de température (RHT)");
    case "20":
      return translate("Diagramme de distance et de consommation (FFS)");
    case "21":
      return translate("Diagrammes de tachygraphe (TCO)");
    case "25":
      return translate("Rapport de violation de vitesse");
    case "26":
      return translate("QHSE (Qualité, Hygiène, Sécurité, Environnement)");
    case "27":
      return translate("Rapport de comportement du conducteur");
    case "29":
      return translate("Rapport d'amplitude de travail");
    case "30":
      return translate("Rapport de flotte");
    case "31":
      return translate("Rapport de flotte (CAN)");
    case "33":
      return translate("HOS (Heure de service) - PSN");
    case "34":
      return translate("Rapport de trajet");
    case "45":
      return translate("Rapport CO2/Kg");
    default:
      return translate("Type de rapport inconnu");
  }
}
    
   
   
    export async function getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
      const apiUrl = `https://geotrackin.xyz/nominatim/reverse.php?format=jsonv2&lat=${lat}&lon=${lon}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Échec de récupération de l\'adresse');
        }
        const data = await response.json();
        // Supposons que votre API renvoie un objet avec une propriété 'address'
        const address = data.display_name;
        return address || ''; // Si l'adresse est vide, retourner une chaîne vide
      } catch (error: any) { // Typer explicitement l'erreur en tant que 'any' ou 'unknown'
        console.error('Erreur :', error.message);
        // En cas d'erreur, retourner les coordonnées latitudinales et longitudinales
        return `Latitude: ${lat}, Longitude: ${lon}`;
      }
    }
    

export const Round = (value: number, decimals: number) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export function handleDownloadExcel(data: any, nameFile: string) {
  // /*exemple : 
  // interface GroupeDeviceCSV {
  //   'id': string;
  //   'Nom du groupe': string;
  //   'Description du groupe': string;
  //   "Date de mise à jour"?: string;
  // } 
  // loop data:
  //   return {
  //     'id': user.id_groupe,
  //     'Nom du groupe': user.nom_groupe,
  //     'Description du groupe': user.description_groupe,
  //   };*/


  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "GroupesVehicles");
  return XLSX.writeFile(wb, `${nameFile}.xlsx`);


};






// export async function getAdresse(LAT: number, LNG: number) {
//   try {
//     const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${LAT}&lon=${LNG}&format=json`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const res = await response.json();
//     const objadd: any = res.address;

//     return ` Pays : ${objadd.country} , Wilaya : ${objadd.state} , ${objadd.road}  `;
//   } catch (error) {
//     console.error(error);
//     return 'Erreur';
//   }
// }


// Fonction utilitaire pour convertir la durée au format 'HH:mm:ss' en secondes BY HICHEM
export function convertDurationToSeconds(duration: string): number {
  const parts = duration.match(/(\d+)h (\d+)m (\d+)s/);

  if (parts) {
    const hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const seconds = parseInt(parts[3], 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
}
// Fonction utilitaire pour formater la durée à partir du nombre de secondes BY HICHEM
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// Fonction utilitaire pour formater la durée en jours, heures, minutes et secondes BY HICHEM
export function formatDurationWithDays(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formattedDuration = '';
  if (days > 0) {
    formattedDuration += `${days}j `;
  }
  if (hours > 0) {
    formattedDuration += `${hours}h `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes}m `;
  }
  formattedDuration += `${seconds}s`;

  return formattedDuration.trim();
}





// By Younes
// Fonction utilitaire pour récupérer les adresses des rapports depuis un tableau de données contenant Juste les coordonnées
export async function getAdressesFromCoords(
  locations: {
    id: number;
    lat: number;
    lon: number;
  }[]
) {
  try {
    const geoResponse = await fetch(
      "https://geotrackin.xyz/reverse_geocode.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locations),
      }
    );

    if (!geoResponse.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${geoResponse.status}`);
    }

    const responseData = await geoResponse.json();

    // Vérifier si l'adresse a été récupérée avec succès
    for (let i = 0; i < responseData.length; i++) {
      if (!responseData[i].address) {
        // Si l'adresse est vide, retourner les coordonnées lat et lon à la place
        responseData[i].address = `Lat: ${locations[i].lat}, Lon: ${locations[i].lon}`;
      }
    }

    return responseData;
  } catch (error) {
    console.error("Erreur lors de la récupération des adresses:", error);
    // En cas d'erreur, renvoyer les coordonnées latitudinales et longitudinales
    return locations.map(location => ({ address: `Lat: ${location.lat}, Lon: ${location.lon}` }));
  }
}



interface HasLatAndLng {
  LAT: number;
  LNG: number;
}

interface ReportData extends HasLatAndLng {
  [key: string]: any;
}

interface ReportDataWithAddress extends ReportData {
  address: string;
}

// Fonction utilitaire pour récupérer les adresses des rapports depuis un tableau de données contenant les coordon avec les données
export async function getAdressesFromData<T extends ReportData>(
  data: T[]
): Promise<(T & ReportDataWithAddress)[]> {
  const locations = data.map((report: T, index: number) => ({
    id: index,
    lat: report.LAT,
    lon: report.LNG
  }));

  const geoResponse = await fetch(
    "https://geotrackin.xyz/reverse_geocode.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locations),
    }
  );

  if (!geoResponse.ok) {
    throw new Error(`Erreur HTTP ! Statut : ${geoResponse.status}`);
  }

  const addresses = await geoResponse.json();

  return data.map((report: T, index: number) => ({
    ...report,
    address: addresses[index].address
  }));
}

export function formatDateForAlgeriaTimeZone(dateString: any) {
  // Parse the dateString into a Date object
  const date = new Date(dateString);

  // Convert the date to Algeria time zone
  const options = { timeZone: 'Africa/Algiers' };
  const formattedDate = date.toLocaleString(undefined, options);

  // Return the formatted date
  return formattedDate;
}

