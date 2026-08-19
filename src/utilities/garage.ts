export const GARAGE_PERMISSION_ID = 41;

export const GARAGE_SEARCH_FIELDS = [
  "id_garage",
  "date_intervention",
  "immatriculation_vehicule",
  "subject",
  "priority",
  "status",
  "service",
  "date_update",
] as const;

export const GARAGE_PAGE_SIZES = [10, 20, 50, 100, 200, 500] as const;
export const GARAGE_SORT_DIRECTIONS = ["ASC", "DESC"] as const;

export type GarageSortDirection = typeof GARAGE_SORT_DIRECTIONS[number];

export const GARAGE_PRIORITIES = ["Urgent", "Normal"] as const;
export const GARAGE_STATUSES = [
  "Under diagnosis",
  "Under repair",
  "Closed",
  "Request",
  "Pending OR",
  "OR established",
  "Pending part",
] as const;

export function getGaragePriorityLabel(priority: string): string {
  return GARAGE_PRIORITIES.includes(priority as typeof GARAGE_PRIORITIES[number])
    ? priority
    : priority || "Unknown";
}

export function normalizeGaragePrioritySearch(
  search: string,
  translatedUrgent: string,
  translatedNormal: string
): string {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  if (normalizedSearch === translatedUrgent.trim().toLocaleLowerCase()) return "Urgent";
  if (normalizedSearch === translatedNormal.trim().toLocaleLowerCase()) return "Normal";
  return search;
}

export function normalizeGarageStatusSearch(
  search: string,
  translatedStatuses: Record<string, string>
): string {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matchingStatus = GARAGE_STATUSES.find(
    (status) => translatedStatuses[status]?.trim().toLocaleLowerCase() === normalizedSearch
  );
  return matchingStatus || search.trim();
}

export function normalizeGarageSearchType(value: unknown): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed < GARAGE_SEARCH_FIELDS.length
    ? parsed
    : 0;
}

export function normalizeGaragePageSize(value: unknown): number {
  const parsed = Number(value);
  return GARAGE_PAGE_SIZES.includes(parsed as typeof GARAGE_PAGE_SIZES[number])
    ? parsed
    : GARAGE_PAGE_SIZES[0];
}

export function normalizeGarageSortColumn(value: unknown): string {
  return GARAGE_SEARCH_FIELDS.includes(value as typeof GARAGE_SEARCH_FIELDS[number])
    ? String(value)
    : "id_garage";
}

export function normalizeGarageSortDirection(value: unknown): GarageSortDirection {
  return value === "DESC" ? "DESC" : "ASC";
}

export function getNextGarageSort(
  currentColumn: string,
  currentDirection: string,
  selectedColumn: string
): GarageSortDirection {
  return currentColumn === selectedColumn && currentDirection === "ASC" ? "DESC" : "ASC";
}

type StoredPermission = {
  id_permission?: number;
  can_read?: number;
  can_update?: number;
};

export function hasGaragePermission(
  action: "read" | "update",
  storedPermissions = localStorage.getItem("geop_userPermissions"),
  userId = Number(localStorage.getItem("GeopUserID") || 0)
): boolean {
  if (userId === 1) return true;
  if (!storedPermissions) return false;

  try {
    const permissions = JSON.parse(storedPermissions) as StoredPermission[];
    const garagePermission = Array.isArray(permissions)
      ? permissions.find((permission) => permission.id_permission === GARAGE_PERMISSION_ID)
      : undefined;
    return garagePermission?.[action === "read" ? "can_read" : "can_update"] === 1;
  } catch {
    return false;
  }
}
