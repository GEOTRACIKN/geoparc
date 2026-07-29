import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getGpPagePreferences,
  GpPreferences,
  resetGpPagePreferences,
  saveGpPagePreferences,
} from "../services/gpPreferences.service";

const SAVE_DEBOUNCE_MS = 400;

function getStorageKey(idUser: number, pageKey: string) {
  return `gpPagePreferences:v1:${idUser}:${pageKey}`;
}

function readLocalPreferences<T extends GpPreferences>(
  idUser: number,
  pageKey: string,
  defaults: T
): T {
  if (!idUser) return defaults;

  try {
    const stored = localStorage.getItem(getStorageKey(idUser, pageKey));
    if (!stored) return defaults;

    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object"
      ? ({ ...defaults, ...parsed } as T)
      : defaults;
  } catch {
    return defaults;
  }
}

export function useGpPagePreferences<T extends GpPreferences>(
  pageKey: string,
  defaults: T
) {
  const { user } = useAuth();
  const idUser = Number(
    user?.id_user ||
      localStorage.getItem("GeopUserID") ||
      localStorage.getItem("userid") ||
      0
  );
  const defaultsRef = useRef(defaults);
  const previousPageKeyRef = useRef(pageKey);

  if (previousPageKeyRef.current !== pageKey) {
    previousPageKeyRef.current = pageKey;
    defaultsRef.current = defaults;
  }

  const stableDefaults = defaultsRef.current;
  const [preferences, setPreferencesState] = useState<T>(() =>
    readLocalPreferences(idUser, pageKey, stableDefaults)
  );
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dirtyKeysRef = useRef<Set<keyof T>>(new Set());
  const latestPreferencesRef = useRef<T>(preferences);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    latestPreferencesRef.current = preferences;
  }, [preferences]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError(null);
    dirtyKeysRef.current.clear();

    const localPreferences = readLocalPreferences(
      idUser,
      pageKey,
      stableDefaults
    );
    setPreferencesState(localPreferences);
    latestPreferencesRef.current = localPreferences;

    if (!idUser) {
      setLoaded(true);
      return () => {
        cancelled = true;
      };
    }

    getGpPagePreferences<T>(pageKey)
      .then((remotePreferences) => {
        if (cancelled) return;

        setPreferencesState((current) => {
          const next = {
            ...stableDefaults,
            ...current,
            ...remotePreferences,
          } as T;

          dirtyKeysRef.current.forEach((key) => {
            next[key] = current[key];
          });

          latestPreferencesRef.current = next;
          localStorage.setItem(
            getStorageKey(idUser, pageKey),
            JSON.stringify(next)
          );
          return next;
        });
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError : new Error(String(loadError))
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [idUser, pageKey, stableDefaults]);

  const flush = useCallback(async () => {
    if (!idUser || dirtyKeysRef.current.size === 0) return;

    const keysToSave = Array.from(dirtyKeysRef.current);
    keysToSave.forEach((key) => dirtyKeysRef.current.delete(key));

    const patch = keysToSave.reduce((result, key) => {
      result[key] = latestPreferencesRef.current[key];
      return result;
    }, {} as Partial<T>);

    setSaving(true);
    setError(null);

    try {
      await saveGpPagePreferences(pageKey, patch);
    } catch (saveError) {
      keysToSave.forEach((key) => dirtyKeysRef.current.add(key));
      setError(
        saveError instanceof Error ? saveError : new Error(String(saveError))
      );
    } finally {
      setSaving(false);
    }
  }, [idUser, pageKey]);

  const scheduleSave = useCallback(() => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      void flush();
    }, SAVE_DEBOUNCE_MS);
  }, [flush]);

  const setPreference = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPreferencesState((current) => {
        const next = { ...current, [key]: value };
        latestPreferencesRef.current = next;

        if (idUser) {
          dirtyKeysRef.current.add(key);
          localStorage.setItem(
            getStorageKey(idUser, pageKey),
            JSON.stringify(next)
          );
          scheduleSave();
        }

        return next;
      });
    },
    [idUser, pageKey, scheduleSave]
  );

  const setPreferences = useCallback(
    (patch: Partial<T>) => {
      setPreferencesState((current) => {
        const next = { ...current, ...patch } as T;
        latestPreferencesRef.current = next;

        if (idUser) {
          (Object.keys(patch) as Array<keyof T>).forEach((key) =>
            dirtyKeysRef.current.add(key)
          );
          localStorage.setItem(
            getStorageKey(idUser, pageKey),
            JSON.stringify(next)
          );
          scheduleSave();
        }

        return next;
      });
    },
    [idUser, pageKey, scheduleSave]
  );

  const resetPreferences = useCallback(async () => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    dirtyKeysRef.current.clear();
    setSaving(true);
    setError(null);

    try {
      if (idUser) {
        await resetGpPagePreferences(pageKey);
        localStorage.removeItem(getStorageKey(idUser, pageKey));
      }

      const next = { ...stableDefaults } as T;
      latestPreferencesRef.current = next;
      setPreferencesState(next);
    } catch (resetError) {
      const normalizedError =
        resetError instanceof Error
          ? resetError
          : new Error(String(resetError));
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setSaving(false);
    }
  }, [idUser, pageKey, stableDefaults]);

  useEffect(
    () => () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      void flush();
    },
    [flush]
  );

  return {
    preferences,
    setPreference,
    setPreferences,
    resetPreferences,
    loaded,
    saving,
    error,
  };
}
