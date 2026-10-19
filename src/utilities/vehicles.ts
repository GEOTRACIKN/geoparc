export const VEHICLE_PAGE_SIZES = [10, 20, 50, 100, 200, 500] as const;
export const VEHICLE_SEARCH_TYPES = [0, 1, 4] as const;
export const VEHICLE_SORT_COLUMNS = [
  "id_vehicule",
  "modele_vehicule",
  "immatriculation_vehicule",
  "etat_vehicule",
  "nom_conducteur",
  "username_user",
] as const;
export const VEHICLE_STATES = [
  "Disponible",
  "Disponible-Hs",
  "Affecté",
  "En panne",
  "En réparation",
  "HS",
] as const;

export function normalizeVehiclePageSize(value: unknown): number {
  const parsed = Number(value);
  return VEHICLE_PAGE_SIZES.includes(parsed as typeof VEHICLE_PAGE_SIZES[number]) ? parsed : 10;
}

export function normalizeVehicleSearchType(value: unknown): number {
  const parsed = Number(value);
  return VEHICLE_SEARCH_TYPES.includes(parsed as typeof VEHICLE_SEARCH_TYPES[number]) ? parsed : 1;
}

export function normalizeVehicleSortColumn(value: unknown): string {
  return VEHICLE_SORT_COLUMNS.includes(value as typeof VEHICLE_SORT_COLUMNS[number])
    ? String(value)
    : "id_vehicule";
}

export function normalizeVehicleSortDirection(value: unknown): "ASC" | "DESC" {
  return value === "DESC" ? "DESC" : "ASC";
}

export function normalizeVehiclePage(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function getNextVehicleSort(currentColumn: string, currentSort: string, selectedColumn: string) {
  return currentColumn === selectedColumn && currentSort === "ASC" ? "DESC" : "ASC";
}

export function normalizeVehicleStates(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((state): state is string =>
    VEHICLE_STATES.includes(state as typeof VEHICLE_STATES[number])
  );
}
