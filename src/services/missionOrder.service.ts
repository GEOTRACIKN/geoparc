import {
  MissionOrderCreatePayload,
  MissionOrderCreateResponse,
} from "../types/missionOrder.types";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export async function createMissionOrderApi(
  payload: MissionOrderCreatePayload
): Promise<MissionOrderCreateResponse> {
  const response = await fetch(
    `${backendUrl}/api/geop/missionOrderManage/create`,
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
    throw new Error(result.message || "Failed to create mission");
  }

  return result;
}