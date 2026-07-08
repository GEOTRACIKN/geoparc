import {
  TransportRequestInterface,
  TransportRequestRequesterOption,
  TransportRequestResponsibleOption,
  TransportRequestResponse,
} from "../types/transportRequest.types";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export async function createTransportRequestApi(
  payload: TransportRequestInterface,
): Promise<TransportRequestResponse> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create transport request");
  }

  return result;
}

export async function getTransportRequestResponsiblesByEmailApi(
  email: string
): Promise<TransportRequestResponsibleOption[]> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/requester-responsibles?email=${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load responsibles");
  }

  return result.data || [];
}

export async function getTransportRequestResponsiblesApi(
  search: string = ""
): Promise<TransportRequestResponsibleOption[]> {
  const response = await fetch(
    `${backendUrl}/api/geop/request-responsibilities/responsibles/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        search,
        page: 1,
        limit: 50,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load responsibles");
  }

  return (result.data || []).map((responsible: any) => ({
    id_demandeur: responsible.id_demandeur,
    id_responsable: responsible.id_responsable,
    mat_responsable: responsible.mat,
    first_name: responsible.first_name,
    last_name: responsible.last_name,
    email_responsable: responsible.email,
    phone: responsible.phone,
  }));
}

export async function getTransportRequestRequestersApi(
  search: string
): Promise<TransportRequestRequesterOption[]> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/requesters?search=${encodeURIComponent(
      search
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load requesters");
  }

  return result.data || [];
}

export interface AddressSuggestion {
  place_id: number | string;
  display_name: string;
  lat?: string;
  lon?: string;
}

export interface ReverseAddressResult {
  display_name: string;
  lat: number;
  lon: number;
}

export interface RouteDirectionsResult {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
  provider: "mapbox" | "osrm";
}

export async function searchAddressSuggestionsApi(
  query: string
): Promise<AddressSuggestion[]> {
  const search = query.trim();

  if (search.length < 3) {
    return [];
  }

  const urls = [
    `https://geotrackin.com/nominatim/search.php?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(
      search
    )}`,
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(
      search
    )}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Address search failed:", error);
    }
  }

  throw new Error("Failed to search address");
}

export async function reverseAddressApi(
  lat: number,
  lon: number
): Promise<ReverseAddressResult> {
  const urls = [
    `https://geotrackin.com/nominatim/reverse.php?format=jsonv2&lat=${lat}&lon=${lon}`,
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        return {
          display_name: data.display_name || `${lat}, ${lon}`,
          lat,
          lon,
        };
      }
    } catch (error) {
      console.error("Address reverse geocoding failed:", error);
    }
  }

  return {
    display_name: `${lat}, ${lon}`,
    lat,
    lon,
  };
}

function mapRouteCoordinates(coordinates: any[]): [number, number][] {
  return coordinates
    .map((coordinate) => {
      const lon = Number(coordinate?.[0]);
      const lat = Number(coordinate?.[1]);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
      }

      return [lat, lon] as [number, number];
    })
    .filter((coordinate): coordinate is [number, number] => Boolean(coordinate));
}

export async function getRouteDirectionsApi(
  departure: { lat: number; lon: number },
  arrival: { lat: number; lon: number },
  signal?: AbortSignal
): Promise<RouteDirectionsResult> {
  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const endpoints = [
    ...(mapboxToken
      ? [
          {
            provider: "mapbox" as const,
            url: `https://api.mapbox.com/directions/v5/mapbox/driving/${departure.lon},${departure.lat};${arrival.lon},${arrival.lat}?geometries=geojson&overview=full&access_token=${encodeURIComponent(
              mapboxToken
            )}`,
          },
        ]
      : []),
    {
      provider: "osrm" as const,
      url: `https://router.project-osrm.org/route/v1/driving/${departure.lon},${departure.lat};${arrival.lon},${arrival.lat}?overview=full&geometries=geojson`,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, { signal });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const route = data.routes?.[0];
      const coordinates = mapRouteCoordinates(route?.geometry?.coordinates || []);

      if (coordinates.length > 1) {
        return {
          coordinates,
          distanceMeters: Number(route.distance) || 0,
          durationSeconds: Number(route.duration) || 0,
          provider: endpoint.provider,
        };
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        throw error;
      }

      console.error("Route calculation failed:", error);
    }
  }

  throw new Error("Failed to calculate route");
}
