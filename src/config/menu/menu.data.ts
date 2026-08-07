export interface MenuItem {
  id: number;
  label: string;
  icon: string;
  to?: string;
  permissionId: number;
  subItems?: MenuItem[];
  divider?: boolean;
}

export const menuItems: MenuItem[] = [

  { id: 1, label: "Dashboard", icon: "las la-home", to: "/", permissionId: 36 },

  { id: 2, label: "Role", icon: "las la-check-circle", to: "/role", permissionId: 38 },

  {
    id: 3,
    label: "Vehicles",
    icon: "las la-car",
    permissionId: 37,
    subItems: [
      { id: 4, label: "List vehicles", icon: "las la-list-alt", to: "/vehicles", permissionId: 37 },
      { id: 5, label: "Vehicle checks", icon: "las la-check-double", to: "/vehicles-checks", permissionId: 37 },
      { id: 6, label: "Vehicle cost", icon: "las la-hand-holding-usd", to: "/vehicle-cost", permissionId: 37 },
      { id: 7, label: "Vehicle sinister", icon: "las la-car-crash", to: "/vehicle-sinister", permissionId: 37 },
    ],
  },

  {
    id: 8,
    label: "Drivers",
    icon: "las la-user-nurse",
    permissionId: 38,
    subItems: [
      { id: 9, label: "List drivers", icon: "las la-list-alt", to: "/drivers", permissionId: 38 },
      { id: 10, label: "Contracts", icon: "las la-file-contract", to: "/contrat", permissionId: 38 },
      { id: 11, label: "Training", icon: "las la-user-nurse", to: "/training", permissionId: 38 },
    ],
  },
  {
    id: 12,
    label: "parks",
    icon: "las la-parking",
    permissionId: 34,
    subItems: [
      { id: 13, label: "list_parks", icon: "las la-list-alt", to: "/parks", permissionId: 34 },
      { id: 14, label: "new_park", icon: "las la-pen-nib", to: "/park/add", permissionId: 34 },
    ],
  },

  {
    id: 15,
    label: "Missions",
    icon: "las la-map-marked-alt",
    permissionId: 39,
    subItems: [
      { id: 16, label: "mission_request", icon: "las la la-route", to: "/transport-request-list", permissionId: 39 },
      { id: 16, label: "Mission Order", icon: "las la-tasks", to: "/mission-order", permissionId: 39 },
      { id: 17, label: "Mission Report", icon: "las la-file-alt", to: "/mission-report", permissionId: 39 },
    ],
  },

  { id: 18, label: "Deadline", icon: "lar la-life-ring", to: "/deadline", permissionId: 51 },

  {
    id: 19,
    label: "HSE",
    icon: "las la-shield-alt",
    permissionId: 40,
    subItems: [
      { id: 20, label: "Warnings", icon: "las la-exclamation-triangle", to: "/warnings", permissionId: 40 },
      { id: 21, label: "Violations", icon: "las la-ban", to: "/violation", permissionId: 40 },
      { id: 22, label: "Fire extinguisher management", icon: "las la-fire-extinguisher", to: "/fire-ext", permissionId: 40 },
      { id: 23, label: "Emergency box management", icon: "las la-briefcase-medical", to: "/pharmacy-box", permissionId: 40 },
    ],
  },

  {
    id: 24,
    label: "GMAO",
    icon: "las la-cogs",
    permissionId: 41,
    subItems: [
      { id: 25, label: "Reception", icon: "las la-clipboard-check", to: "/reception", permissionId: 41 },
      { id: 26, label: "Garage", icon: "las la-warehouse", to: "/garage", permissionId: 41 },
      { id: 27, label: "Planned interviews", icon: "las la-calendar-alt", to: "/planning-interviews", permissionId: 41 },
      { id: 28, label: "Servicing", icon: "las la-tools", to: "/servicing", permissionId: 41 },
      { id: 29, label: "Tire Change", icon: "las la-car", to: "/pneu", permissionId: 41 },
      { id: 30, label: "Parts Replacement", icon: "las la-suitcase", to: "/piece", permissionId: 41 },
    ],
  },

  {
    id: 31,
    label: "Fuel",
    icon: "las la-gas-pump",
    permissionId: 42,
    subItems: [
      { id: 32, label: "Fuel consumption", icon: "las la-gas-pump", to: "/fuel_management", permissionId: 42 },
      { id: 33, label: "Card management", icon: "las fa-id-card", to: "/card_management", permissionId: 42 },
      { id: 34, label: "Tank management", icon: "las fa-truck-moving", to: "/tank_management", permissionId: 42 },
      { id: 35, label: "Cash management", icon: "las fa-money-bill-wave", to: "/cash_management", permissionId: 42 },
    ],
  },

  { id: 36, label: "Administrative", icon: "las la-suitcase", to: "/administratif", permissionId: 53 },

  {
    id: 37,
    label: "Stock",
    icon: "las la-store",
    permissionId: 42,
    subItems: [
      { id: 38, label: "Tire", icon: "las la-cogs", to: "/pneu_stock", permissionId: 42 },
      { id: 39, label: "Items", icon: "las la-boxes", to: "/piece_stock", permissionId: 42 },
      { id: 40, label: "Demande pièces", icon: "las la-box-open", to: "/Demandes_pieces", permissionId: 42 },
      { id: 45, label: "Bon de réception", icon: "las la-clipboard-list", to: "/bon-reception", permissionId: 42 },
    ],
  },

  { id: 41, label: "Notifications", icon: "las la-bell", to: "/notifications", permissionId: 52 },

  { id: 42, label: "Reference", icon: "las la-check-circle", to: "/reference", permissionId: 38 },

  { id: 46, label: "Reports", icon: "ri-file-chart-line", to: "/reports", permissionId: 36 },

  { id: 43, label: "Settings", icon: "las la-cog", to: "/Settings", permissionId: 10 },

  { id: 44, label: "Help", icon: "lar la-life-ring", to: "/Help", permissionId: 11 },
];
