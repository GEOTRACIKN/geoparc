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

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

export async function getGpPagePreferences<T extends GpPreferences>(
  pageKey: string
): Promise<Partial<T>> {
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
  return result.preferences && typeof result.preferences === "object"
    ? result.preferences
    : {};
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

  return data;
}
