import { renderHook, waitFor } from "@testing-library/react";
import {
  getGpPagePreferences,
  saveGpPagePreferences,
} from "../services/gpPreferences.service";
import { useGpVisibleColumns } from "./useGpVisibleColumns";

jest.mock("../services/gpPreferences.service", () => ({
  getGpPagePreferences: jest.fn(),
  saveGpPagePreferences: jest.fn(),
}));

const getPreferencesMock = getGpPagePreferences as jest.MockedFunction<
  typeof getGpPagePreferences
>;
const savePreferencesMock = saveGpPagePreferences as jest.MockedFunction<
  typeof saveGpPagePreferences
>;

beforeEach(() => {
  jest.clearAllMocks();
  savePreferencesMock.mockResolvedValue({} as any);
});

it("restaure les colonnes visibles dans la structure historique", async () => {
  getPreferencesMock.mockResolvedValue({
    visibleColumns: ["id", "name"],
  });
  const setSelectedColumns = jest.fn();
  const current = { id: true, name: false, cost: true };

  renderHook(() =>
    useGpVisibleColumns(
      "roles",
      current,
      setSelectedColumns,
      true
    )
  );

  await waitFor(() => expect(setSelectedColumns).toHaveBeenCalledTimes(1));
  const restore = setSelectedColumns.mock.calls[0][0];

  expect(restore(current)).toEqual({
    id: true,
    name: true,
    cost: false,
  });
});

it("initialise la préférence distante avec les colonnes locales existantes", async () => {
  getPreferencesMock.mockResolvedValue({ visibleColumns: [] });
  const selectedColumns = { id: true, name: false, cost: true };

  renderHook(() =>
    useGpVisibleColumns(
      "roles",
      selectedColumns,
      jest.fn(),
      true
    )
  );

  await waitFor(() =>
    expect(savePreferencesMock).toHaveBeenCalledWith("roles", {
      visibleColumns: ["id", "cost"],
    })
  );
});
