import {
  clearGpPreferencesCache,
  getGpPagePreferences,
  resetGpPagePreferences,
  saveGpPagePreferences,
} from "./gpPreferences.service";

const fetchMock = jest.fn();

function response(body: unknown, ok = true) {
  return {
    ok,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

beforeEach(() => {
  clearGpPreferencesCache();
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

test("deduplicates preference reads for the same user and page", async () => {
  fetchMock.mockResolvedValue(
    response({ pageKey: "vehicles", preferences: { pageSize: 20 } })
  );

  const firstRead = getGpPagePreferences("vehicles");
  const secondRead = getGpPagePreferences("vehicles");

  await expect(Promise.all([firstRead, secondRead])).resolves.toEqual([
    { pageSize: 20 },
    { pageSize: 20 },
  ]);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test("loads the authenticated user's preferences for a page", async () => {
  fetchMock.mockResolvedValue(
    response({
      pageKey: "vehicles",
      preferences: { pageSize: 20, sortDirection: "ASC" },
    })
  );

  await expect(getGpPagePreferences("vehicles")).resolves.toEqual({
    pageSize: 20,
    sortDirection: "ASC",
  });
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/api/geop/preferences/vehicles"),
    expect.objectContaining({ method: "GET", credentials: "include" })
  );
});

test("saves only the supplied preference patch", async () => {
  fetchMock.mockResolvedValue(response({ message: "saved" }));

  await saveGpPagePreferences("vehicles", { pageSize: 50 });

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/api/geop/preferences/vehicles"),
    expect.objectContaining({
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ preferences: { pageSize: 50 } }),
    })
  );
});

test("resets all preferences for one page", async () => {
  fetchMock.mockResolvedValue(response({ deletedPreferences: 8 }));

  await resetGpPagePreferences("vehicles");

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/api/geop/preferences/vehicles"),
    expect.objectContaining({ method: "DELETE", credentials: "include" })
  );
});

test("surfaces the API error message", async () => {
  fetchMock.mockResolvedValue(response({ message: "Invalid page key" }, false));

  await expect(getGpPagePreferences("invalid page")).rejects.toThrow(
    "Invalid page key"
  );
});
