export type TransportRequestListStatus =
  | "pending"
  | "pending_fleet_processing"
  | "approved"
  | "rejected"
  | "cancelled"
  | "mission_created";

export type TransportRequestListType = "Normal" | "Urgent";

export interface TransportRequestListItem {
  id_transport_request: number;
  request_type: TransportRequestListType;
  object_request: string;
  requester_phone: string;
  departure_datetime: string | null;
  departure_location: string;
  arrival_datetime: string | null;
  arrival_location: string;
  status_request: TransportRequestListStatus;
  created_at?: string | null;
  id_vehicule?: number | string | null;
}

export interface TransportRequestListSearchPayload {
  limitValue: number;
  currentPage: number;
  id_user: string | null;
  search: string;
  type?: string;
  colum?: string;
  sort?: "ASC" | "DESC";
}

export interface TransportRequestListCountPayload {
  id_user: string | null;
  search: string;
  type?: string;
}

export interface TransportRequestListCountResponse {
  count: number;
}

export interface TransportRequestListStatusUpdatePayload {
  id_transport_request: number;
  id_user: string | null;
  status_request: TransportRequestListStatus;
  approval_status?: "pending" | "approved" | "rejected" | "cancelled";
  approval_required?: 0 | 1;
}
