import {
  getNextGarageSort,
  GARAGE_PRIORITIES,
  GARAGE_STATUSES,
  getGaragePriorityLabel,
  hasGaragePermission,
  normalizeGaragePageSize,
  normalizeGaragePrioritySearch,
  normalizeGarageSearchType,
  normalizeGarageSortColumn,
  normalizeGarageSortDirection,
  normalizeGarageStatusSearch,
} from "./garage";

beforeEach(() => localStorage.clear());

test("normalizes saved garage preferences", () => {
  expect(normalizeGaragePageSize(50)).toBe(50);
  expect(normalizeGaragePageSize(13)).toBe(10);
  expect(normalizeGarageSearchType(7)).toBe(7);
  expect(normalizeGarageSearchType(99)).toBe(0);
  expect(normalizeGarageSortColumn("priority")).toBe("priority");
  expect(normalizeGarageSortColumn("Priority")).toBe("id_garage");
  expect(normalizeGarageSortDirection("DESC")).toBe("DESC");
  expect(normalizeGarageSortDirection("DROP TABLE")).toBe("ASC");
});

test("starts a newly selected column ascending and toggles the active column", () => {
  expect(getNextGarageSort("id_garage", "DESC", "priority")).toBe("ASC");
  expect(getNextGarageSort("priority", "ASC", "priority")).toBe("DESC");
  expect(getNextGarageSort("priority", "DESC", "priority")).toBe("ASC");
});

test("checks garage read and update permissions independently", () => {
  const permissions = JSON.stringify([
    { id_permission: 41, can_read: 1, can_update: 0 },
  ]);

  expect(hasGaragePermission("read", permissions, 7)).toBe(true);
  expect(hasGaragePermission("update", permissions, 7)).toBe(false);
  expect(hasGaragePermission("update", "not json", 7)).toBe(false);
  expect(hasGaragePermission("update", null, 1)).toBe(true);
});

test("covers intervention priorities and every supported garage status", () => {
  expect(GARAGE_PRIORITIES).toEqual(["Urgent", "Normal"]);
  expect(getGaragePriorityLabel("Urgent")).toBe("Urgent");
  expect(getGaragePriorityLabel("Normal")).toBe("Normal");
  expect(getGaragePriorityLabel("Critical")).toBe("Critical");
  expect(normalizeGaragePrioritySearch("Urgente", "Urgente", "Normal")).toBe("Urgent");
  expect(normalizeGaragePrioritySearch("normal", "Urgente", "Normal")).toBe("Normal");
  expect(normalizeGarageStatusSearch("En réparation", {
    "Under repair": "En réparation",
  })).toBe("Under repair");
  expect(normalizeGarageStatusSearch(" inconnu ", {})).toBe("inconnu");
  expect(GARAGE_STATUSES).toEqual([
    "Under diagnosis",
    "Under repair",
    "Closed",
    "Request",
    "Pending OR",
    "OR established",
    "Pending part",
  ]);
});
