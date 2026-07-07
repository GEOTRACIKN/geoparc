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

export async function searchAddressSuggestionsApi(
  query: string
): Promise<AddressSuggestion[]> {
  const search = query.trim();

  if (search.length < 3) {
    return [];
  }

  const urls = [
    `https://geotrackin.xyz/nominatim/search.php?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(
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
