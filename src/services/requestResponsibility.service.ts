import {
  ResponsiblePayload,
  RequesterPayload,
} from "../types/requestResponsibility.types";

const backendUrl = process.env.REACT_APP_BACKEND_URL + "/api/geop";

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();

    console.error("API returned non-JSON response");
    console.error("Status:", response.status);
    console.error("URL:", response.url);
    console.error("Response:", text);

    throw new Error(`API returned non-JSON response: ${response.url}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function searchResponsiblesApi(payload: {
  search: string;
  page: number;
  limit: number;
}) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/responsibles/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function getRequestersByResponsibleApi(id_responsable: number) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/responsibles/${id_responsable}/requesters`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    }
  );

  return handleResponse(response);
}

export async function getAvailableRequestersApi(payload: {
  id_responsable: number;
  search: string;
  limit?: number;
}) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/requesters/available`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function createResponsibleApi(payload: ResponsiblePayload) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/responsibles/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function updateResponsibleApi(payload: ResponsiblePayload) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/responsibles/update`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function createRequesterAndAssignApi(payload: RequesterPayload) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/requesters/create-and-assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function assignRequesterApi(payload: {
  id_responsable: number;
  id_demandeur: number;
  position_validation?: number;
}) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}

export async function unassignRequesterApi(payload: {
  id_responsable: number;
  id_demandeur: number;
}) {
  const response = await fetch(
    `${backendUrl}/request-responsibilities/unassign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
}