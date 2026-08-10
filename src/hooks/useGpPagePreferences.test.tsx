import { act, renderHook, waitFor } from "@testing-library/react";
import { useGpPagePreferences } from "./useGpPagePreferences";
import {
  getGpPagePreferences,
  saveGpPagePreferences,
} from "../services/gpPreferences.service";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock("../services/gpPreferences.service", () => ({
  getGpPagePreferences: jest.fn(),
  resetGpPagePreferences: jest.fn(),
  saveGpPagePreferences: jest.fn(),
}));

const getPreferencesMock = getGpPagePreferences as jest.MockedFunction<
  typeof getGpPagePreferences
>;
const savePreferencesMock = saveGpPagePreferences as jest.MockedFunction<
  typeof saveGpPagePreferences
>;

const defaults = {
  searchText: "",
  searchType: 1,
  pageSize: 10,
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  getPreferencesMock.mockResolvedValue({
    searchText: "flèchebleue",
    searchType: 3,
    pageSize: 20,
  });
  savePreferencesMock.mockResolvedValue({});
});

test("hydrates the saved search using the GeoParc user session", async () => {
  localStorage.setItem("GeopUserID", "42");

  const { result } = renderHook(() =>
    useGpPagePreferences("vehicles", defaults)
  );

  await waitFor(() => expect(result.current.loaded).toBe(true));

  expect(getPreferencesMock).toHaveBeenCalledWith("vehicles");
  expect(result.current.preferences).toEqual({
    searchText: "flèchebleue",
    searchType: 3,
    pageSize: 20,
  });
});

test("persists a changed search for the GeoParc user", async () => {
  localStorage.setItem("GeopUserID", "42");

  const { result } = renderHook(() =>
    useGpPagePreferences("vehicles", defaults)
  );

  await waitFor(() => expect(result.current.loaded).toBe(true));

  act(() => {
    result.current.setPreferences({
      searchText: "nouvelle recherche",
      searchType: 3,
    });
  });

  await waitFor(
    () =>
      expect(savePreferencesMock).toHaveBeenCalledWith("vehicles", {
        searchText: "nouvelle recherche",
      }),
    { timeout: 1500 }
  );
});

test("does not persist preferences when values are unchanged", async () => {
  localStorage.setItem("GeopUserID", "42");

  const { result } = renderHook(() =>
    useGpPagePreferences("vehicles", defaults)
  );

  await waitFor(() => expect(result.current.loaded).toBe(true));

  act(() => {
    result.current.setPreferences({
      searchText: "flèchebleue",
      searchType: 3,
      pageSize: 20,
    });
  });

  await new Promise((resolve) => window.setTimeout(resolve, 500));
  expect(savePreferencesMock).not.toHaveBeenCalled();
});
