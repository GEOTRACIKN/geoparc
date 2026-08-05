import { useCallback } from "react";
import { useGpPagePreferences } from "./useGpPagePreferences";

type ReferenceTableDefaults = {
  sortColumn?: string;
  sortDirection?: string;
  visibleColumns?: string[];
};

export function useReferenceTablePreferences(
  pageKey: string,
  defaults: ReferenceTableDefaults = {}
) {
  const { preferences, setPreference, resetPreferences, loaded, saving, error } =
    useGpPagePreferences(`reference:${pageKey}`, {
      visibleColumns: defaults.visibleColumns || [],
      pageSize: 10,
      searchType: "text",
      searchText: "",
      sortColumn: defaults.sortColumn || "",
      sortDirection: defaults.sortDirection || "DESC",
      filters: {} as Record<string, unknown>,
      selectedVehicleId: null as number | null,
    });

  return {
    currentPageSize: preferences.pageSize,
    setCurrentPageSize: useCallback(
      (value: number) => setPreference("pageSize", value),
      [setPreference]
    ),
    currentSearchText: preferences.searchText,
    setCurrentSearchText: useCallback(
      (value: string) => setPreference("searchText", value),
      [setPreference]
    ),
    currentSortColumn: preferences.sortColumn,
    setCurrentSortColumn: useCallback(
      (value: string) => setPreference("sortColumn", value),
      [setPreference]
    ),
    currentSortDirection: preferences.sortDirection,
    setCurrentSortDirection: useCallback(
      (value: string) => setPreference("sortDirection", value),
      [setPreference]
    ),
    resetPreferences,
    loaded,
    saving,
    error,
  };
}
