export function formatToTimestamp(timestamp: string | number | Date) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString(); // ou utilisez des méthodes spécifiques pour obtenir le format souhaité
    return formattedDate;
  } 
  