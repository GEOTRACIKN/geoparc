import { useEffect, useRef, useState } from "react";
import { useGpPagePreferences } from "./useGpPagePreferences";

type SearchType = string | number;
type SortValue = string | number;

type ListPagePreferences = {
  visibleColumns: string[];
  pageSize: number;
  searchType: SearchType;
  searchTypeLabel: string;
  searchText: string;
  sortColumn: SortValue;
  sortDirection: string;
  filters: Record<string, unknown>;
  selectedVehicleId: number | string | null;
};

type ListPagePreferenceBindings = {
  pageKey: string;
  pageSize: number;
  setPageSize: (value: number) => void;
  searchType: SearchType;
  setSearchType: (value: any) => void;
  searchTypeLabel?: string;
  setSearchTypeLabel?: (value: string) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  sortColumn?: SortValue;
  setSortColumn?: (value: any) => void;
  sortDirection?: string;
  setSortDirection?: (value: any) => void;
  visibleColumns?: string[];
  restoreVisibleColumns?: (columns: string[]) => void;
  filters?: Record<string, unknown>;
  restoreFilters?: (filters: Record<string, unknown>) => void;
  selectedVehicleId?: number | string | null;
  setSelectedVehicleId?: (value: number | string | null) => void;
};

/**
 * Adaptateur commun pour les anciennes pages de listes GeoParc.
 *
 * Il attend la préférence distante avant de déclarer la page prête. La page
 * peut ainsi différer son premier appel API et éviter de charger la liste
 * complète avant d'appliquer la recherche restaurée.
 */
export function useListPagePreferences({
  pageKey,
  pageSize,
  setPageSize,
  searchType,
  setSearchType,
  searchTypeLabel = String(searchType),
  setSearchTypeLabel,
  searchText,
  setSearchText,
  sortColumn = "",
  setSortColumn,
  sortDirection = "",
  setSortDirection,
  visibleColumns,
  restoreVisibleColumns,
  filters = {},
  restoreFilters,
  selectedVehicleId = null,
  setSelectedVehicleId,
}: ListPagePreferenceBindings) {
  const boundVisibleColumns = visibleColumns ?? [];
  const managesVisibleColumns = visibleColumns !== undefined;
  const {
    preferences,
    setPreferences,
    loaded,
    saving,
    error,
    resetPreferences,
  } = useGpPagePreferences<ListPagePreferences>(pageKey, {
    visibleColumns: boundVisibleColumns,
    pageSize,
    searchType,
    searchTypeLabel,
    searchText,
    sortColumn,
    sortDirection,
    filters,
    selectedVehicleId,
  });
  const hydratedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const visibleColumnsKey = boundVisibleColumns.join("|");
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    if (!loaded || hydratedRef.current) return;
    hydratedRef.current = true;

    setPageSize(Number(preferences.pageSize) || pageSize);
    setSearchType(preferences.searchType);
    setSearchTypeLabel?.(String(preferences.searchTypeLabel || searchTypeLabel));
    setSearchText(String(preferences.searchText || ""));
    setSortColumn?.(preferences.sortColumn);
    setSortDirection?.(String(preferences.sortDirection || sortDirection));

    if (restoreVisibleColumns) {
      restoreVisibleColumns(preferences.visibleColumns || []);
    }
    if (restoreFilters) {
      restoreFilters(preferences.filters || {});
    }
    if (setSelectedVehicleId) {
      setSelectedVehicleId(preferences.selectedVehicleId ?? null);
    }

    setReady(true);
  }, [
    loaded,
    pageSize,
    preferences,
    restoreFilters,
    restoreVisibleColumns,
    setPageSize,
    setSearchText,
    setSearchType,
    setSearchTypeLabel,
    setSelectedVehicleId,
    setSortColumn,
    setSortDirection,
    sortDirection,
    searchTypeLabel,
  ]);

  useEffect(() => {
    if (!ready) return;

    void setPreferences({
      ...(managesVisibleColumns
        ? { visibleColumns: boundVisibleColumns }
        : {}),
      pageSize,
      searchType,
      searchTypeLabel,
      searchText,
      sortColumn,
      sortDirection,
      filters,
      selectedVehicleId,
    });
    // Arrays/objects use stable serialized dependency keys.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtersKey,
    pageSize,
    ready,
    searchText,
    searchType,
    searchTypeLabel,
    selectedVehicleId,
    setPreferences,
    sortColumn,
    sortDirection,
    visibleColumnsKey,
  ]);

  return { ready, saving, error, resetPreferences };
}
