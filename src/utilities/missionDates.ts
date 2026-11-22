export function parseMissionDatetime(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(value)) return null;
  if (!Number.isFinite(new Date(value).getTime())) return null;
  return value.length === 16 ? `${value}:00` : value;
}

export function missionDatesError(departure: string | null, arrival: string | null): string | null {
  if (!departure || !arrival) return "Veuillez renseigner les dates de départ et de retour.";
  const departureTime = new Date(departure).getTime();
  const arrivalTime = new Date(arrival).getTime();
  if (!Number.isFinite(departureTime) || !Number.isFinite(arrivalTime)) {
    return "Veuillez renseigner des dates de départ et de retour valides.";
  }
  return departureTime > arrivalTime
    ? "La date de départ doit être antérieure ou égale à la date de retour"
    : null;
}
