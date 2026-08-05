const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export type GpPreferenceValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

export type GpPreferences = Record<string, GpPreferenceValue>;

type PreferencesResponse<T extends GpPreferences> = {
  pageKey: string;
  preferences: Partial<T>;
};

const preferencesCache = new Map<string, Partial<GpPreferences>>();
const pendingPreferenceRequests = new Map<
  string,
  Promise<Partial<GpPreferences>>
>();

function getCacheKey(pageKey: string) {
  const idUser =
    localStorage.getItem("GeopUserID") ||
    localStorage.getItem("userid") ||
    "anonymous";
  return `${idUser}:${pageKey}`;
}

export function clearGpPreferencesCache() {
  preferencesCache.clear();
  pendingPreferenceRequests.clear();
}

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

export async function getGpPagePreferences<T extends GpPreferences>(
  pageKey: string
): Promise<Partial<T>> {
  const cacheKey = getCacheKey(pageKey);
  const cached = preferencesCache.get(cacheKey);
  if (cached) return cached as Partial<T>;

  const pending = pendingPreferenceRequests.get(cacheKey);
  if (pending) return pending as Promise<Partial<T>>;

  const request = (async () => {
    const response = await fetch(
      `${backendUrl}/api/geop/preferences/${encodeURIComponent(pageKey)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data?.message || "Unable to load GeoParc preferences");
    }

    const result = data as PreferencesResponse<T>;
    const preferences =
      result.preferences && typeof result.preferences === "object"
        ? result.preferences
        : {};
    preferencesCache.set(cacheKey, preferences);
    return preferences;
  })().finally(() => {
    pendingPreferenceRequests.delete(cacheKey);
  });

  pendingPreferenceRequests.set(cacheKey, request);
  return request;
}

export async function saveGpPagePreferences<T extends GpPreferences>(
  pageKey: string,
  preferences: Partial<T>
) {
  const response = await fetch(
    `${backendUrl}/api/geop/preferences/${encodeURIComponent(pageKey)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences }),
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to save GeoParc preferences");
  }

  const cacheKey = getCacheKey(pageKey);
  preferencesCache.set(cacheKey, {
    ...preferencesCache.get(cacheKey),
    ...preferences,
  });

  return data;
}

export async function resetGpPagePreferences(pageKey: string) {
  const response = await fetch(
    `${backendUrl}/api/geop/preferences/${encodeURIComponent(pageKey)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || "Unable to reset GeoParc preferences");
  }


  preferencesCache.delete(getCacheKey(pageKey));

  return data;
}
