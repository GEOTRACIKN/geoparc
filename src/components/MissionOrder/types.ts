// components/MissionOrder/types.ts

export interface MissionOrder {
    id_mission: number;
    ref_mission: number;
    object_mission: string;
    fuel_loading_mission: number;
    fuel_type_mission: number;
    expenses_mission: number;
    tank_mission: number;
    trailer_mission: number;
    driver_mission: number;
    accomp_mission: number;
    dep_loc_mission: string;
    dep_date_mission: number;
    dep_dest_mission: string;
    return_date_mission: number;
    itinerary_mission: string;
    vehicle_km_mission: number;
    new_km_mission: number;
    fuel_cost_mission: number;
    fuel_level_mission: number;
    voucher_mission: number;
    immatriculation_vehicule: string;
    id_vehicule: number;
    id_user: string;
  }
  