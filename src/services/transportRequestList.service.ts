import {
  TransportRequestListCountPayload,
  TransportRequestListCountResponse,
  TransportRequestListItem,
  TransportRequestListSearchPayload,
} from "../types/transportRequestList.types";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export async function getTransportRequestList(
  payload: TransportRequestListSearchPayload
): Promise<TransportRequestListItem[]> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load transport requests");
  }

  return result;
}

export async function getTransportRequestListCount(
  payload: TransportRequestListCountPayload
): Promise<TransportRequestListCountResponse> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/totalpage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load transport request count");
  }

  return result;
}

export async function updateTransportRequestListStatus(payload: {
  id_transport_request: number;
  id_user: string | null;
  status_request: string;
  approval_status?: string;
  approval_required?: number;
}): Promise<{ message?: string }> {
  const response = await fetch(
    `${backendUrl}/api/geop/transportRequestManage/update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update transport request");
  }

  return result;
}
