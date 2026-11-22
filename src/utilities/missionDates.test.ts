import { missionDatesError, parseMissionDatetime } from "./missionDates";

test("accepts minute and second precision without duplicating seconds", () => {
  expect(parseMissionDatetime("2026-10-28T09:00")).toBe("2026-10-28T09:00:00");
  expect(parseMissionDatetime("2026-10-28T09:00:30")).toBe("2026-10-28T09:00:30");
  expect(parseMissionDatetime("2026-10-28T09:00:30.500")).toBe("2026-10-28T09:00:30.500");
  expect(parseMissionDatetime("")).toBeNull();
  expect(parseMissionDatetime("2026-10-28T09:00:00:00")).toBeNull();
});

test("rejects missing or invalid dates and inverted chronology", () => {
  expect(missionDatesError(null, "2026-10-28T12:00:00")).not.toBeNull();
  expect(missionDatesError("2026-10-28T09:00:00", null)).not.toBeNull();
  expect(missionDatesError("invalid", "2026-10-28T12:00:00")).not.toBeNull();
  expect(missionDatesError("2026-10-28T12:00:00", "2026-10-28T09:00:00")).not.toBeNull();
  expect(missionDatesError("2026-10-28T09:00:00", "2026-10-28T12:00:00")).toBeNull();
  expect(missionDatesError("2026-10-28T09:00:00", "2026-10-28T09:00:00")).toBeNull();
});
