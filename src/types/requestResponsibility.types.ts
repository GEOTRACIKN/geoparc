export interface Responsible {
  id_responsable: number;
  id_user?: number | null;
  mat?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: number;
  total_requesters?: number;
}

export interface Requester {
  id_demandeur: number;
  id_user?: number | null;
  mat?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  position_validation?: number;
  is_active?: number;
}

export interface ResponsiblePayload {
  id_responsable?: number;
  mat?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: number;
}

export interface RequesterPayload {
  id_demandeur?: number;
  id_responsable?: number;
  mat?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  position_validation?: number;
}

export interface PaginatedResponsiblesResponse {
  data: Responsible[];
  total: number;
  page: number;
  limit: number;
}