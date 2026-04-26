export interface MissionOrderCreatePayload {
  id_vehicule: number | string;
  ref_mission: number | string;
  object_mission: string;
  fuel_loading_mission: number | string;
  fuel_type_mission: string;
  expenses_mission: number | string;
  tank_mission: number | string;
  trailer_mission: number | string;
  driver_mission: string;
  accomp_mission: string;
  dep_loc_mission: string;
  dep_date_mission: string;
  dep_dest_mission: string;
  return_date_mission: string;
  itinerary_mission: string;
  new_km_mission: number | string;
  fuel_cost_mission: number | string;
  fuel_level_mission: number | string;
  voucher_mission: number | string;
  id_user: number | string | null;
}

export interface MissionOrderCreateResponse {
  message: string;
  id_mission: number;
}