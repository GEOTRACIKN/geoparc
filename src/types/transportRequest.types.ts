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
  requester_email: string;
  id_gp_demandeur?: number | null;
  departure_datetime: string | null;
  departure_location: string;
  arrival_datetime: string | null;
  arrival_location: string;
  id_gp_responsable?: number | null;
  id_user: string | null;
  status_request: "pending";
}

export interface TransportRequestRequesterOption {
  id_demandeur: number;
  mat?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface TransportRequestResponsibleOption {
  id_demandeur?: number | null;
  id_responsable: number;
  mat_responsable?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email_responsable?: string | null;
  phone?: string | null;
  position_validation?: number | null;
}

export interface TransportRequestResponse {
  message?: string;
  success?: boolean;
  id_demande?: number;
  id_transport_request?: number;
  data?: TransportRequestInterface | TransportRequestInterface[];
}
