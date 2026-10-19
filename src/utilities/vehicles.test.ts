import {
  getNextVehicleSort,
  normalizeVehiclePage,
  normalizeVehiclePageSize,
  normalizeVehicleSearchType,
  normalizeVehicleSortColumn,
  normalizeVehicleSortDirection,
  normalizeVehicleStates,
} from "./vehicles";

test("normalizes persisted vehicle table preferences", () => {
  expect(normalizeVehiclePageSize(50)).toBe(50);
  expect(normalizeVehiclePageSize(13)).toBe(10);
  expect(normalizeVehicleSearchType(4)).toBe(4);
  expect(normalizeVehicleSearchType(3)).toBe(1);
  expect(normalizeVehicleSortColumn("etat_vehicule")).toBe("etat_vehicule");
  expect(normalizeVehicleSortColumn("state")).toBe("id_vehicule");
  expect(normalizeVehicleSortDirection("DESC")).toBe("DESC");
  expect(normalizeVehicleSortDirection("invalid")).toBe("ASC");
  expect(normalizeVehiclePage(3)).toBe(3);
  expect(normalizeVehiclePage(0)).toBe(1);
});

test("keeps only supported states and sorts predictably", () => {
  expect(normalizeVehicleStates(["Disponible", "HS", "invalid"])).toEqual(["Disponible", "HS"]);
  expect(getNextVehicleSort("id_vehicule", "DESC", "etat_vehicule")).toBe("ASC");
  expect(getNextVehicleSort("etat_vehicule", "ASC", "etat_vehicule")).toBe("DESC");
});
