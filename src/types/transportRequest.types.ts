export type TransportRequestType = "Normal" | "Urgent";

export type TransportRequestStatus =
  | "pending_manager_approval"
  | "pending_fleet_processing"
  | "approved"
  | "rejected"
  | "mission_created"
  | "cancelled";

export interface TransportRequestInterface {
  object_request: string;
  request_type: "Normal" | "Urgent";
  requester_phone: string;
  departure_datetime: string | null;
  departure_location: string;
  arrival_datetime: string | null;
  arrival_location: string;
  id_user: string | null;
  status_request: "pending";
}

export interface TransportRequestResponse {
  id_transport_request: number;
  message: string;
}