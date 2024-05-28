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
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    // Concaténer les composantes dans le format souhaité
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }