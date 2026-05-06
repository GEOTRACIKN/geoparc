import {
  TransportRequestInterface,
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