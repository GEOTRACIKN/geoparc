import { useEffect, useRef } from "react";
import {
  getGpPagePreferences,
  saveGpPagePreferences,
} from "../services/gpPreferences.service";

type ColumnSelection = Record<string, boolean> | string[];

function toVisibleColumns(selection: ColumnSelection) {
  return Array.isArray(selection)
    ? selection
    : Object.entries(selection)
        .filter(([, visible]) => visible)
        .map(([column]) => column);
}

/**
 * Pont de migration pour les anciennes listes qui géraient leurs colonnes
 * uniquement dans localStorage.
 */
export function useGpVisibleColumns<T extends ColumnSelection>(
  pageKey: string,
  selectedColumns: T,
  setSelectedColumns: (value: any) => void,
  preferencesReady: boolean
) {
  const hydratedRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const visibleColumns = toVisibleColumns(selectedColumns);
  const visibleColumnsKey = visibleColumns.join("|");

  useEffect(() => {
    if (!preferencesReady || hydratedRef.current) return;

    let cancelled = false;
    void getGpPagePreferences<{ visibleColumns: string[] }>(pageKey)
      .then((preferences) => {
        if (cancelled) return;
        const restored = Array.isArray(preferences.visibleColumns)
          ? preferences.visibleColumns
          : [];

        if (restored.length > 0) {
          skipNextSaveRef.current = true;
          setSelectedColumns((current: T) => {
            if (Array.isArray(current)) return restored;
            const restoredSet = new Set(restored);
            return Object.keys(current).reduce(
              (result, column) => ({
                ...result,
                [column]: restoredSet.has(column),
              }),
              {} as Record<string, boolean>
            );
          });
        } else {
          void saveGpPagePreferences(pageKey, { visibleColumns });
        }
        hydratedRef.current = true;
      })
      .catch(() => {
        hydratedRef.current = true;
      });

    return () => {
      cancelled = true;
    };
    // Hydration is intentionally performed once for this mounted page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, preferencesReady]);

  useEffect(() => {
    if (!preferencesReady || !hydratedRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveGpPagePreferences(pageKey, { visibleColumns });
    }, 250);

    return () => window.clearTimeout(timeout);
    // The serialized key is the stable dependency for the column selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, preferencesReady, visibleColumnsKey]);
}
