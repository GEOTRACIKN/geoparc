
// global.d.ts

// Base interface for all widgets
export interface BaseWidgetProps {
  id: string;     // Unique widget identifier
  type: string;   // Widget type (e.g., 'fleetCounter', 'fleetState', etc.)
}

// Interface for alert data
export interface Alert {
  id: number;
  type: string;
  matriculation: string;
  message: string;
  timestamp: string;
}

// Specific interface for the FleetCounter widget
export interface FleetCounterProps extends BaseWidgetProps {
  type: 'fleetCounter';
  numberOfItem: number;
  title: string;
  icon: string;
  color: string;
  linkTo: string;
}

// Specific interface for the FleetState widget
export interface FleetStateProps extends BaseWidgetProps {
  type: 'fleetState';
  options: {
    DrivingValue: number;
    ParckingValue: number;
    ParkingEngineRunningValue: number;
    LastTransmissionValue: number;
  };
}

// Specific interface for the StatsComponent widget
export interface StatsComponentProps extends BaseWidgetProps {
  type: 'statsComponent';
  psn: string;
}

// Specific interface for the Alerts widget
export interface AlertsProps extends BaseWidgetProps {
  type: 'alerts';
  alerts: Alert[];
}

// Specific interface for the FleetCo2 widget
export interface FleetCo2Props extends BaseWidgetProps {
  type: 'fleetCo2';
  data: any;
  // Add specific properties if necessary
}

// src/components/Dashboard/types.ts



export interface Widget {
  id: string;          // Identifiant unique, par exemple 'widget1'
  id_dashboard: number;
  id_widget?: number;
  id_user: number;
  content: string;
  type: string;        // Type de widget, par exemple 'chart', 'table', 'text'
  x: number;           // Position X dans le grid
  y: number;           // Position Y dans le grid
  w: number;           // Largeur du widget
  h: number;           // Hauteur du widget
}





// Union of prop types for widgets
export type WidgetProps =
  | FleetCounterProps
  | FleetStateProps
  | StatsComponentProps
  | AlertsProps
  | FleetCo2Props;
